
jest.mock('../../utils/kafka', () => {
    const mockSubscribe = jest.fn();
    const mockRun = jest.fn().mockImplementation(({ eachMessage }) => {
        const message = {
            topic: 'test1',
            partition: 0,
            message: {
                value: JSON.stringify({ userName: 'test name', email: 'test@gmail.com', businessId: '123' }),
                headers: { eventType: Buffer.from('Business_User_Added') },
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

const { ConsumeBusinessAction } = require('../../utils/consumer3')

const { sendEmail } = require('../../utils/sendEmail');



describe('ConsumeBusinessAction function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('processes Kafka message and sends email for "Business_User_Added" event type', async () => {
        await ConsumeBusinessAction({ topic: 'test1' });
        expect(sendEmail).toHaveBeenCalled();
        expect(sendEmail).toHaveBeenCalledTimes(1);
        expect(sendEmail.mock.calls[0][0]).toEqual(expect.objectContaining({
            email: 'test@gmail.com',
            template: expect.any(String),
            subject: 'Business_Action',
            type: expect.any(String),
            businessId: '123' || undefined,
        }));

        const { plexaarKafka } = require("../../utils/kafka");

        expect(plexaarKafka.consumer().commitOffsets).toHaveBeenCalledWith([{ topic: 'test1', partition: 0, offset: '1' }]);
    });

    it('does not call sendEmail for messages with an eventType other than Business_User_Added', async () => {

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

        await ConsumeBusinessAction({ topic: 'test1' });

        // Verify that sendEmail was not called since the eventType does not match
        expect(sendEmail).not.toHaveBeenCalled();
    });

});
