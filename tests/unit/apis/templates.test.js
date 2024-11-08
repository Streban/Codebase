const app = require('../../../app')
const request = require('supertest')(app);

const EmailTemplate = require('../../../apis/models/emailTemplate')




const prefix_url = '/email_svc/pb/templates'



const dummyTemplates = [
    { title: "Welcome Email", fields: ["name", "email"], template: "<p>Welcome, {{name}}</p>", shortCode: "WELCOME", type: "welcome", businessId: "business1" },
    { title: "Goodbye Email", fields: ["name"], template: "<p>Goodbye, {{name}}</p>", shortCode: "GOODBYE", type: "farewell", businessId: "business2" },
    { title: "Reminder Email", fields: ["name", "date"], template: "<p>Reminder for {{name}} on {{date}}</p>", shortCode: "REMINDER", type: "reminder", businessId: "business3" },
    { title: "Promotion Email", fields: ["name", "discount"], template: "<p>Hi {{name}}, get {{discount}} off!</p>", shortCode: "PROMO", type: "promotion", businessId: "business4" },
    { title: "Notification Email", fields: ["name", "notification"], template: "<p>Hi {{name}}, {{notification}}</p>", shortCode: "NOTIFY", type: "notification", businessId: "business5" }
];





describe('Templates apis Test Cases', () => {
    describe('POST /email_svc/pb/templates', () => {
        it('should create a new email template and return it', async () => {
            const newTemplate = {
                fields: ['name', 'email'],
                template: '<p>Hello {{name}}</p>',
                title: 'Welcome Email',
                shortCode: 'WELCOME_EMAIL',
                type: 'welcome',
                businessId: 'business123'
            };


            const response = await request.post(prefix_url)
                .send(newTemplate)
                .expect('Content-Type', /json/)
                .expect(200);


            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('_id');
            expect(response.body.data.fields).toEqual(newTemplate.fields);
            expect(response.body.data.template).toEqual(newTemplate.template);
            expect(response.body.data.title).toEqual(newTemplate.title);
            expect(response.body.data.shortCode).toEqual(newTemplate.shortCode);
            expect(response.body.data.type).toEqual(newTemplate.type);
            expect(response.body.data.businessId).toEqual(newTemplate.businessId);
        });
    })



    describe('GET /email_svc/pb/templates', () => {
        beforeAll(async () => {
            await EmailTemplate.insertMany(dummyTemplates);
        });

        afterAll(async () => {
            await EmailTemplate.deleteMany({});
        });




        it('paginates the result set', async () => {
            const response = await request.get(prefix_url)
                .query({ page: 2, limit: 2 })
                .expect(200);


            expect(response.body.data.docs).toHaveLength(2);
            expect(response.body.data).toHaveProperty('totalDocs');
            expect(response.body.data).toHaveProperty('limit', 2);
            expect(response.body.data).toHaveProperty('page', 2);
        });


        it('sorts the result set', async () => {
            const response = await request.get(prefix_url)
                .query({ sort: 'title', limit: 5 })
                .expect(200);

            const titles = response.body.data.docs.map(template => template.title);
            const sortedTitles = [...titles].sort();

            expect(titles).toEqual(sortedTitles);
        });


        it('filters the result set by businessId', async () => {
            const testBusinessId = 'business1';
            const response = await request.get(prefix_url)
                .query({ businessId: testBusinessId })
                .expect(200);

            response.body.data.docs.forEach(doc => {
                expect(doc.businessId).toEqual(testBusinessId);
            });
        });

        it('filters the result set by shortCode', async () => {
            const shortCode = 'WELCOME';
            const response = await request.get(prefix_url)
                .query({ shortCode: shortCode })
                .expect(200);


            expect(response.body.data.docs[0].shortCode).toEqual(shortCode);
        });
    });



    describe('PUT /:ID endpoint', () => {
        it('updates an email template and returns the updated document', async () => {
            const template = { title: "Welcome Email", fields: ["name", "email"], template: "<p>Welcome, {{name}}</p>", shortCode: "WELCOME", type: "welcome", businessId: "business1" }
            const createdTemplate = await EmailTemplate.create(template)
            const templateId = createdTemplate._id
            const updateData = {
                title: 'Upadted Template Title',
                type: 'updated type'
            };

            const response = await request.put(`${prefix_url}/${templateId}`)
                .send(updateData)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.body.data).toHaveProperty('_id', templateId.toString());
            expect(response.body.data).toMatchObject(updateData);
            expect(response.body).toHaveProperty('message', 'Email Template updated successfully.');
        });

    });
    describe('DELETE /:ID endpoint', () => {
        it('Delete an email template', async () => {
            const template = { title: "Welcome Email", fields: ["name", "email"], template: "<p>Welcome, {{name}}</p>", shortCode: "WELCOME TYPE", type: "welcome type", businessId: "business9" }
            const createdTemplate = await EmailTemplate.create(template)
            const templateId = createdTemplate._id
            const updateData = {
                title: 'Upadted Template Title',
                type: 'updated type'
            };

            const response = await request.put(`${prefix_url}/${templateId}`)
                .send(updateData)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.body.data).toHaveProperty('_id', templateId.toString());
            expect(response.body.data).toMatchObject(updateData);
            expect(response.body).toHaveProperty('message', 'Email Template updated successfully.');
        });

    });



})