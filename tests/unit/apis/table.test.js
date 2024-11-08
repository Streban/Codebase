const Table = require('../../../apis/models/table.model');
const mongoose = require('mongoose');

const app = require('../../../app')
const request = require('supertest')(app);
const EmailTemplate = require('../../../apis/models/emailTemplate')


const prefix_url = '/email_svc/pb/table'


const tableObjects = [
    {
        table_name: "Customers1",
        column_name: "CustomerName1",
        column_no: "1",
        sticky: true,
        sticky_priority: "high",
        position: 2,
        isShow: true,
        businessId: "business123"
    },
    {
        table_name: "Orders",
        column_name: "OrderDate",
        column_no: "2",
        sticky: false,
        sticky_priority: "medium",
        position: 1,
        isShow: false,
        businessId: "business456"
    },
    {
        table_name: "Products",
        column_name: "ProductName",
        column_no: "3",
        sticky: true,
        sticky_priority: "low",
        position: 3,
        isShow: true,
        businessId: "business789"
    },
    {
        table_name: "Invoices",
        column_name: "InvoiceTotal",
        column_no: "4",
        sticky: false,
        sticky_priority: "medium",
        position: 4,
        isShow: true,
        businessId: "business101"
    }
];



const dummyTemplates = [
    { title: "Welcome Email", fields: ["name", "email"], template: "<p>Welcome, {{name}}</p>", shortCode: "WELCOME", type: "welcome", businessId: "business1" },
    { title: "Goodbye Email", fields: ["name"], template: "<p>Goodbye, {{name}}</p>", shortCode: "GOODBYE", type: "farewell", businessId: "business2" },
    { title: "Reminder Email", fields: ["name", "date"], template: "<p>Reminder for {{name}} on {{date}}</p>", shortCode: "REMINDER", type: "reminder", businessId: "business3" },
    { title: "Promotion Email", fields: ["name", "discount"], template: "<p>Hi {{name}}, get {{discount}} off!</p>", shortCode: "PROMO", type: "promotion", businessId: "business4" },
    { title: "Notification Email", fields: ["name", "notification"], template: "<p>Hi {{name}}, {{notification}}</p>", shortCode: "NOTIFY", type: "notification", businessId: "business5" }
];


describe('table Apis Test Cases', () => {
    describe('POST /', () => {

        it('should create a new table and return it', async () => {
            const newTableData = {
                table_name: "Customers",
                column_name: "CustomerName",
                column_no: "1",
                sticky: true,
                sticky_priority: "high",
                position: 2,
                isShow: true,
                businessId: "business123"
            }

            const response = await request.post(prefix_url)
                .send(newTableData)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.data.table_name).toEqual(newTableData.table_name)
            expect(response.body.data.businessId).toEqual(newTableData.businessId)
            expect(response.body.data).toHaveProperty('_id')
        });


    });
    describe('Paginate and get All Table Logs', () => {
        beforeAll(async () => {
            await Table.insertMany(tableObjects);
        });
        afterAll(async () => {
            await Table.deleteMany({});
        });


        it('paginates the result set', async () => {
            const response = await request.get(prefix_url)
                .query({ page: 1, limit: 2 })
                .expect(200);
            expect(response.body.data.docs).toHaveLength(2);
            expect(response.body.data).toHaveProperty('totalDocs');
            expect(response.body.data).toHaveProperty('limit', 2);
            expect(response.body.data).toHaveProperty('page', 1);
        });


        it('sorts the result set', async () => {
            const response = await request.get(prefix_url)
                .query({ sort: 'table_name', limit: 5 })
                .expect(200);

            const titles = response.body.data.docs.map(table => table.table_name);
            const sortedTitles = [...titles].sort();

            expect(titles).toEqual(sortedTitles);
        });


        it('filters the result set by table_name', async () => {
            const table_name = 'Customers';
            const response = await request.get(prefix_url)
                .query({ table_name: table_name })
                .expect(200);

            response.body.data.docs.forEach(doc => {
                expect(doc.table_name).toEqual(table_name);
            });
        });

        ;

    });
    describe('PUT /:ID endpoint with database', () => {
        let tableId;

        beforeAll(async () => {

            const sampleTable = await Table.create({
                table_name: "Initial Name",
                column_name: "Initial Column",
                column_no: "1",
                sticky: false,
                position: 2,
                isShow: true,
                businessId: "initialBusinessId",
            });
            tableId = sampleTable._id.toString();
        });

        afterAll(async () => {
            await Table.deleteMany({});
        });

        it('successfully updates a table and returns the updated document', async () => {
            const updatedData = {
                table_name: "Updated Name",
                sticky: true,
                position: 1,
            };

            const response = await request.put(`${prefix_url}/${tableId}`)
                .send(updatedData)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.data).toMatchObject(updatedData);
            expect(response.body.message).toBe("Email Table updated successfully.");

            const updatedTable = await Table.findById(tableId);
            expect(updatedTable.table_name).toBe(updatedData.table_name);
            expect(updatedTable.sticky).toBe(updatedData.sticky);
            expect(updatedTable.position).toBe(updatedData.position);
        });

        it('fails to update due to validation error', async () => {
            const invalidData = {
                position: -1, // Assuming a negative position is invalid
            };

            const response = await request.put(`${prefix_url}/${tableId}`)
                .send(invalidData)
                .expect('Content-Type', /json/)


            expect(response.body).toHaveProperty('message');
        });

        it('tries to update a non-existent table', async () => {
            const nonExistentTableId = new mongoose.Types.ObjectId(); // Generate a random ID

            const updatedData = {
                table_name: "Some Name",
            };

            const response = await request.put(`${prefix_url}/${nonExistentTableId}`)
                .send(updatedData)
                .expect('Content-Type', /json/)


            expect(response.body).toHaveProperty('message');
        });




    });
    describe('DELETE /', () => {


        let tableId;
        beforeAll(async () => {
            const sampleTable = await Table.create({
                table_name: "Initial Names",
                column_name: "Initial Columns",
                column_no: "1",
                sticky: false,
                position: 2,
                isShow: true,
                businessId: "initialBusinessIds",
            });
            tableId = sampleTable._id.toString();
        });
        it('should update a table and return it', async () => {

            const response = await request.delete(`${prefix_url}/${tableId}`)
                .expect(200);
            expect(response.body.message).toEqual('Email Table deleted successfully.')

        });

    });

    describe('GET /email_svc/pb/templates', () => {

        beforeAll(async () => {
            await Table.insertMany(tableObjects);
            await EmailTemplate.insertMany(dummyTemplates);
        });



        it('should return modified tables based on email templates', async () => {
            const { table_name, businessId } = tableObjects[0];

            const response = await request.get(`${prefix_url}/template-table?table_name=${table_name}&userId=${businessId}`)
                .expect(200);

            console.log("----------------------->>>>", response.body);
            expect(response.body).toBeDefined();
            expect(Array.isArray(response.body)).toBe(true);

            const expectedTable = response.body.find(table => table.table_name === table_name);
            expect(expectedTable).toBeDefined();

        });


        it('should return an empty array for a non-existent table', async () => {

            const table_name = 'non-exiting-table'
            const businessId = 'non-exiting-businessId'

            const response = await request.get(`${prefix_url}/template-table?table_name=${table_name}&userId=${businessId}`)
                .expect(200);

            expect(response.body).toBeDefined();
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });


        it('should return tables sorted by position', async () => {
            const { table_name, businessId } = tableObjects[0];
            const response = await request.get(`${prefix_url}/template-table?table_name=${table_name}&userId=${businessId}`)
                .expect(200);

            let lastPosition = -1;
            for (let table of response.body) {
                expect(table.position).toBeGreaterThan(lastPosition);
                lastPosition = table.position;
            }
        });





    });


});