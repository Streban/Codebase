const { createMany, createOne, findOneByFilter, findOneByBusinessId, findOneByShortCode, getAll, removeAll, removeOne, updateOne } = require('../../apis/controller/emailTemplate.controller')

const EmailTemplate = require('../../apis/models/emailTemplate')



describe("Email Templates Test Cases", () => {
    describe("createMany Function", () => {


        it("successfully creates multiple email template entries", async () => {
            const templates = [
                { title: "Welcome Email", fields: ["name", "date"], template: "<h1>Welcome, {{name}}</h1>", businessId: "biz123", shortCode: "welcome_email", type: "greeting" },
                { title: "Reminder Email", fields: ["name", "appointmentDate"], template: "<h1>Reminder, {{name}}</h1>", businessId: "biz456", shortCode: "reminder_email", type: "reminder" }
            ];

            const createdTemplates = await createMany(templates);

            expect(Array.isArray(createdTemplates)).toBe(true);
            expect(createdTemplates.length).toBe(templates.length);

            createdTemplates.forEach((doc, index) => {
                expect(doc.title).toBe(templates[index].title);
                expect(doc.fields).toEqual(expect.arrayContaining(templates[index].fields));
                expect(doc.template).toBe(templates[index].template);
                expect(doc.businessId).toBe(templates[index].businessId);
                expect(doc.shortCode).toBe(templates[index].shortCode);
                expect(doc.type).toBe(templates[index].type);
            });
        });
    })




    describe("findOneByShortCode Function", () => {

        it("successfully finds an email template by shortCode", async () => {
            // Seed the database with a test document
            const testData = {
                title: "Test Template",
                fields: ["field1", "field2"],
                template: "<p>Example</p>",
                businessId: "testBusinessId",
                shortCode: "testShortCode",
                type: "testType",
            };
            await EmailTemplate.create(testData);

            const foundTemplate = await findOneByShortCode(testData.shortCode);

            expect(foundTemplate).not.toBeNull();
            expect(foundTemplate.shortCode).toBe(testData.shortCode);
            expect(foundTemplate.title).toBe(testData.title);
            expect(foundTemplate.fields).toEqual(expect.arrayContaining(testData.fields));
        });

        it("returns null for a non-existent shortCode", async () => {
            const foundTemplate = await findOneByShortCode("nonExistentShortCode");
            expect(foundTemplate).toBeNull();
        });
    });
    describe("findOneBussinesID Function", () => {

        it("successfully finds an email template by businessId", async () => {
            // Seed the database with a test document
            const testData = {
                title: "Test Template",
                fields: ["field1", "field2"],
                template: "<p>Example</p>",
                businessId: "testBusinessId1",
                shortCode: "testShortCode1",
                type: "testType",
            };
            await EmailTemplate.create(testData);

            const foundTemplate = await findOneByBusinessId({ businessId: testData.businessId });

            expect(foundTemplate).not.toBeNull();
            expect(foundTemplate.businessId).toBe(testData.businessId);
            expect(foundTemplate.title).toBe(testData.title);
            expect(foundTemplate.fields).toEqual(expect.arrayContaining(testData.fields));
        });

        it("returns null for a non-existent Business", async () => {
            const foundTemplate = await findOneByBusinessId({ businessId: "nonExistentBusinessId" });
            expect(foundTemplate).toBeNull();
        });
    });




    describe("findOneByFilter Function", () => {


        it("successfully finds an email template by filter", async () => {
            // Seed the database with a test document
            const testData = {
                title: "FindOne Test Template",
                fields: ["name", "date"],
                template: "Your appointment is on {{date}}",
                businessId: "uniqueBusinessId123",
                shortCode: "findOneTest",
                type: "reminder",
            };
            await EmailTemplate.create(testData);

            const filter = { shortCode: testData.shortCode };

            const foundTemplate = await findOneByFilter(filter);

            expect(foundTemplate).not.toBeNull();
            expect(foundTemplate.title).toBe(testData.title);
            expect(foundTemplate.businessId).toBe(testData.businessId);
            expect(foundTemplate.shortCode).toBe(testData.shortCode);
            expect(foundTemplate.type).toBe(testData.type);
        });

        it("returns null for a filter that matches no documents", async () => {
            const nonExistentFilter = { shortCode: "nonExistentCode" };
            const foundTemplate = await findOneByFilter(nonExistentFilter);
            expect(foundTemplate).toBeNull();
        });
    });




    describe("updateOne Function", () => {


        it("successfully updates an email template", async () => {
            const seedData = {
                title: "Original Title",
                fields: ["name", "date"],
                template: "<p>{{name}}, your appointment is on {{date}}</p>",
                businessId: "business123",
                shortCode: "updateTest",
                type: "notification",
            };
            const seededTemplate = await EmailTemplate.create(seedData);

            const updateData = { title: "Updated Title" };

            const updatedTemplate = await updateOne(seededTemplate._id, updateData);

            expect(updatedTemplate).not.toBeNull();
            expect(updatedTemplate.title).toBe(updateData.title);
            expect(updatedTemplate.template).toBe(seedData.template);
        });

    });


    describe("removeAll Function", () => {


        it("successfully deletes all email templates", async () => {
            await EmailTemplate.create([
                { title: "Template 1", fields: ["field1"], template: "Template 1 Content", businessId: "biz1", shortCode: "temp1", type: "type1" },
                { title: "Template 2", fields: ["field2"], template: "Template 2 Content", businessId: "biz2", shortCode: "temp2", type: "type2" },
            ]);

            const deletionResult = await removeAll();

            expect(deletionResult).toBeDefined();
            expect(deletionResult.deletedCount).toBeGreaterThanOrEqual(2);

            const remainingTemplates = await EmailTemplate.find({});
            expect(remainingTemplates.length).toBe(0);
        });
    });




    describe("createOne Function", () => {


        it("successfully creates a new email template", async () => {
            const testData = { title: "Template 1", fields: ["field1"], template: "Template 1 Content", businessId: "biz1", shortCode: "temp1", type: "type1" }

            const createdTemplate = await createOne(testData);

            expect(createdTemplate).toBeDefined();
            expect(createdTemplate._id).toBeDefined();
            expect(createdTemplate.title).toBe(testData.title);
            expect(createdTemplate.fields).toEqual(expect.arrayContaining(testData.fields));
            expect(createdTemplate.template).toBe(testData.template);
            expect(createdTemplate.shortCode).toBe(testData.shortCode);
            expect(createdTemplate.type).toBe(testData.type);

            const foundTemplate = await EmailTemplate.findById(createdTemplate._id);
            expect(foundTemplate).not.toBeNull();
        });

    });

    describe("getAll Function", () => {


        it("successfully retrieves email templates with pagination", async () => {
            await EmailTemplate.create([
                { title: "Template 1", fields: ["field1"], template: "Content 1", businessId: "bizd1", shortCode: "temp331", type: "type1" },
                { title: "Template 2", fields: ["field2"], template: "Content 2", businessId: "bizs1", shortCode: "temp333s2", type: "type2" },
            ]);
            const filter = {};
            const options = {
                page: 1,
                limit: 10,
            };

            const result = await getAll(filter, options);
            expect(result.docs).toBeDefined();
            expect(result.docs.length).toBeGreaterThanOrEqual(2);
            expect(result.totalDocs).toBeGreaterThanOrEqual(2);
            expect(result.page).toBe(options.page);
            expect(result.limit).toBe(options.limit);
        });

    });

});
