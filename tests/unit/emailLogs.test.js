const { createOne, findEmailLogs, removeAll, removeMany, removeOne } = require('../../apis/controller/emaillog.controller')
const EmailLog = require("../../apis/models/emaillog");


describe('Mail Logs Test Cases', () => {
    describe('findEmailLogs Function', () => {

        it('successfully retrieves email logs based on a query', async () => {
            const res = await EmailLog.create({
                user: 'testUser',
                emails: ['test@example.com'],
                type: 'notification',
                status: 'OK',
                messageId: '123',
                businessId: 'business123',
                template: 'templateName',
                shortCode: 'code123',
                data: { key: 'value' },
            });

            // Function call
            const logs = await findEmailLogs({ user: 'testUser' });
            expect(logs).toBeInstanceOf(Array);
            expect(logs).toHaveLength(1);
            expect(logs[0].user).toBe('testUser');
        });

        it('handles errors when finding email logs fails', async () => {
            // Mock EmailLog.find to simulate a failure
            EmailLog.find = jest.fn().mockImplementationOnce((query, callback) => {
                callback(new Error('Failed to retrieve data'), null);
            });

            // Function call and assertion for error handling
            await expect(findEmailLogs({ user: 'testUser' })).rejects.toThrow('Failed to retrieve data');
        });
    });




    describe('removeOne Function', () => {

        it('successfully deletes an email log entry', async () => {
            const emailLog = await EmailLog.create({
                user: 'testUser',
                emails: ['test@example.com'],
                type: 'notification',
                status: 'OK',
                messageId: '123',
                businessId: 'business123',
                template: 'templateName',
                shortCode: 'code123',
                data: { key: 'value' },
            });

            const deletedDoc = await removeOne(emailLog._id);

            expect(deletedDoc).not.toBeNull();
            expect(deletedDoc._id.toString()).toBe(emailLog._id.toString());

            const findDeletedDoc = await EmailLog.findById(emailLog._id);
            expect(findDeletedDoc).toBeNull();
        });



    })

    describe('removeMany Function', () => {

        it('successfully deletes multiple email log entries', async () => {
            const emailLogs = await EmailLog.insertMany([
                {
                    user: 'testUser1',
                    emails: ['test1@example.com'],
                    type: 'notification',
                    status: 'OK',
                    messageId: '123',
                    businessId: 'business123',
                    template: 'templateName',
                    shortCode: 'code123',
                    data: { key: 'value1' },
                },
                {
                    user: 'testUser2',
                    emails: ['test2@example.com'],
                    type: 'notification',
                    status: 'OK',
                    messageId: '456',
                    businessId: 'business456',
                    template: 'templateName',
                    shortCode: 'code456',
                    data: { key: 'value2' },
                }
            ]);

            const idsToDelete = emailLogs.map(log => log._id);

            const deletionResult = await removeMany(idsToDelete);

            expect(deletionResult.deletedCount).toBe(2);

        });

        // it('handles errors when deletion fails', async () => {
        //     EmailLog.deleteMany = jest.fn().mockImplementationOnce((query, callback) => {
        //         callback(new Error('Deletion failed'), null);
        //     });

        //     // Function call and assertion for error handling
        //     await expect(removeMany(['invalid_id'])).rejects.toThrow('Deletion failed');
        // });
    });

    describe('removeAll Function', () => {

        it('successfully deletes all email log entries', async () => {
            await EmailLog.insertMany([
                {
                    user: 'testUser1',
                    emails: ['test1@example.com'],
                    type: 'notification',
                    status: 'OK',
                    messageId: '123',
                    businessId: 'business123',
                    template: 'templateName',
                    shortCode: 'code123',
                    data: { key: 'value1' },
                },
                {
                    user: 'testUser2',
                    emails: ['test2@example.com'],
                    type: 'notification',
                    status: 'OK',
                    messageId: '456',
                    businessId: 'business456',
                    template: 'templateName',
                    shortCode: 'code456',
                    data: { key: 'value2' },
                }
            ]);

            const deletionResult = await removeAll();
            expect(deletionResult.acknowledged).toBeTruthy();

        });

    });



    describe('createOne Function', () => {

        it('successfully creates a new email log entry', async () => {
            const testData = {
                user: 'testUser',
                emails: ['test@example.com'],
                status: 'OK',
                type: 'notification',
                data: { key: 'value' },
                messageId: '12345',
                template: 'welcome',
                businessId: 'biz123'
            };

            const createdDoc = await createOne(testData);

            expect(createdDoc).toBeDefined();
            expect(createdDoc._id).toBeDefined();
            expect(createdDoc.user).toBe(testData.user);
            expect(createdDoc.status).toBe(testData.status);

            const foundDoc = await EmailLog.findById(createdDoc._id);
            expect(foundDoc).not.toBeNull();
        });

    });



});