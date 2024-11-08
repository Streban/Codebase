// Mock Kafka consumer setup specifically for InvitationStaffPlexaarEmail scenario
jest.mock('../../utils/kafka', () => {
    const mockSubscribe = jest.fn();
    const mockRun = jest.fn().mockImplementation(({ eachMessage }) => {
        const message = {
            topic: 'test1',
            partition: 0,
            message: {
                value: JSON.stringify({
                    email: 'test@example.com',
                    businessId: 'business123',
                    eventName: 'Staff Invitation',
                    placeholder: 'test data',
                }),
                headers: { eventType: Buffer.from('plexaar_staff_invitation') },
                offset: '0',
            },
        };


        eachMessage(message);
    });
    const mockCommitOffsets = jest.fn();

    return {
        plexaarKafka: {
            consumer: jest.fn(() => ({
                connect: jest.fn(),
                subscribe: mockSubscribe,
                run: mockRun,
                commitOffsets: mockCommitOffsets,
            })),
        },
    };
});


jest.mock('../../utils/sendEmail', () => {
    const originalModule = jest.requireActual('../../utils/sendEmail');

    return {
        ...originalModule,
        sendEmail: jest.fn().mockResolvedValue('Mocked sendEmail'),
    };
});


jest.mock('../../utils/parseTemplate', () => {
    const originalModule = jest.requireActual('../../utils/parseTemplate');

    return {
        ...originalModule,
        parseTemplate: jest.fn((template, fields, data) =>
            template.replace('{{eventName}}', data.eventName).replace('{{placeholder}}', data.placeholder)
        ),
    };
});


jest.mock('../../apis/controller/emailTemplate.controller', () => {
    const originalModule = jest.requireActual('../../apis/controller/emailTemplate.controller');

    return {
        ...originalModule,
        findOneByBusinessId: jest.fn().mockResolvedValue({
            template: 'Your {{eventName}} template {{placeholder}}',
            fields: ['eventName', 'placeholder'],
        }),
    };
});



const { InvitationStaffPlexaarEmail } = require('../../utils/consumer3')

const { sendEmail } = require('../../utils/sendEmail');
const { parseTemplate } = require('../../utils/parseTemplate');

describe('InvitationStaffPlexaarEmail function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('processes Kafka message and sends email for "plexaar_staff_invitation" event type', async () => {

        await InvitationStaffPlexaarEmail({ topic: 'test1' });

        expect(parseTemplate).toHaveBeenCalled();
        expect(parseTemplate.mock.calls[0][0]).toContain('Your ');
        expect(parseTemplate.mock.calls[0][2]).toMatchObject({
            eventName: 'Staff Invitation',
            placeholder: 'test data',
        });

        expect(sendEmail).toHaveBeenCalled();
        expect(sendEmail).toHaveBeenCalledTimes(1);
        expect(sendEmail.mock.calls[0][0]).toEqual(expect.objectContaining({
            email: 'test@example.com',
            template: expect.any(String),
            subject: expect.any(String),
            type: expect.any(String),
            businessId: 'business123',
        }));

        // Finally, assert offsets were committed as expected
        const { plexaarKafka } = require('../../utils/kafka');
        expect(plexaarKafka.consumer().commitOffsets).toHaveBeenCalledWith([{ topic: 'test1', partition: 0, offset: '1' }]);
    });

    it('does not call sendEmail for messages with an eventType other than plexaar_staff_invitation', async () => {

        const mockEachMessage = async ({ eachMessage }) => {
            const message = {
                topic: 'test1',
                partition: 0,
                message: {
                    value: JSON.stringify({/* message content */ }),
                    headers: { eventType: Buffer.from('Different_Event_Type') },
                    offset: '0',
                },
            };
            await eachMessage(message);
        };

        const { plexaarKafka } = require('../../utils/kafka');
        plexaarKafka.consumer.mockReturnValue({
            connect: jest.fn(),
            subscribe: jest.fn(),
            run: mockEachMessage,
            commitOffsets: jest.fn(),
        });

        await InvitationStaffPlexaarEmail({ topic: 'test1' });

        expect(sendEmail).not.toHaveBeenCalled();


    });
});
