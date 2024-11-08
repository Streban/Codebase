
jest.mock('../../utils/kafka', () => {
    const mockSubscribe = jest.fn();
    const mockRun = jest.fn().mockImplementation(({ eachMessage }) => {
        const message = {
            topic: 'test1',
            partition: 0,
            message: {
                value: JSON.stringify({ firstName: 'your_name', accountNumber: "you_account_number", primaryEmail: 'test@gmail.com', businessId: '123' }),
                headers: { eventType: Buffer.from('plexaar_user_basic_profile') },
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

const { ConsumePlexaarUserAction } = require('../../utils/consumer3')

const { sendEmail } = require('../../utils/sendEmail');



describe('ConsumeBusinessAction function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('processes Kafka message and sends email for "plexaar_user_basic_profile" event type', async () => {
        await ConsumePlexaarUserAction({ topic: 'test1' });
        expect(sendEmail).toHaveBeenCalled();
        expect(sendEmail).toHaveBeenCalledTimes(1);
        expect(sendEmail.mock.calls[0][0]).toEqual(expect.objectContaining({
            email: 'test@gmail.com',
            template: expect.any(String),
            subject: expect.any(String),
            type: expect.any(String),
            businessId: expect.anything(),
        }));
        const { businessId } = sendEmail.mock.calls[0][0];
        expect(businessId === '123' || businessId === undefined).toBe(true);

        const { plexaarKafka } = require("../../utils/kafka");

        expect(plexaarKafka.consumer().commitOffsets).toHaveBeenCalledWith([{ topic: 'test1', partition: 0, offset: '1' }]);
    });

    it('does not call sendEmail for messages with an eventType other than plexaar_user_basic_profile', async () => {

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

        await ConsumePlexaarUserAction({ topic: 'test1' });

        expect(sendEmail).not.toHaveBeenCalled();
    });

});
