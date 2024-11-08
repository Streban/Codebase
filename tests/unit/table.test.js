const TableController = require('../../apis/controller/table.controller');
const Table = require('../../apis/models/table.model');

describe('Table Test cases', () => {
    describe('createOne function', () => {
        it("should create a table successfully", async () => {
            const table_body = {
                table_name: "test_table",
                column_name: "name2",
                sticky: true,
                businessId: "123"
            };
            const tableCreated = await TableController.createOne(table_body);
            const { _id, __v, createdAt, updatedAt, ...dataWithoutMetadata } = tableCreated.toObject();
            const expectedData = { position: 1, isShow: true, ...table_body };
            expect(dataWithoutMetadata).toEqual(expectedData);
        });
    });

    describe('createMany function', () => {
        it("should create multiple tables successfully", async () => {
            const tables = [
                {
                    table_name: "test_table1",
                    column_name: "name1",
                    sticky: true,
                    businessId: "123"
                },
                {
                    table_name: "test_table2",
                    column_name: "name2",
                    sticky: true,
                    businessId: "123"
                }
            ];

            const createdTables = await TableController.createMany(tables);
            for (let i = 0; i < createdTables.length; i++) {
                const { _id, __v, createdAt, updatedAt, ...dataWithoutMetadata } = createdTables[i].toObject();
                const expectedData = { position: 1, isShow: true, ...tables[i] };
                expect(dataWithoutMetadata).toEqual(expectedData);
            }
        });
    });

    describe('findTables function', () => {
        it("should find tables based on query successfully", async () => {
            const query = { businessId: "123" };
            const foundTables = await TableController.findTables(query);
            expect(foundTables.length).toBeGreaterThan(0);
            for (let table of foundTables) {
                expect(table.businessId).toBe(query.businessId);
            }
        });

        it("should return empty array if no tables found based on query", async () => {
            const query = { businessId: "non_existing_id" };
            const foundTables = await TableController.findTables(query);
            expect(foundTables).toEqual([]);
        });
    });

    describe('removeOne function', () => {
        it("should remove a table successfully", async () => {
            const tableToCreate = {
                table_name: "test_table_to_remove",
                column_name: "name",
                sticky: true,
                businessId: "123"
            };
            const createdTable = await TableController.createOne(tableToCreate);
            const removedTable = await TableController.removeOne(createdTable._id);
            expect(removedTable).toBeDefined();
            expect(removedTable._id).toEqual(createdTable._id);
            const findRemovedTable = await Table.findById(createdTable._id);
            expect(findRemovedTable).toBeNull();
        });

        it("should update positions of other tables after removing one", async () => {
            const tablesToCreate = [
                {
                    table_name: "test_table_to_update_position1",
                    column_name: "name1",
                    sticky: true,
                    businessId: "22"
                },
                {
                    table_name: "test_table_to_update_position2",
                    column_name: "name2",
                    sticky: true,
                    businessId: "22"
                }
            ];
            await TableController.createMany(tablesToCreate);
            const tableToRemove = await Table.findOne({ table_name: "test_table_to_update_position1" });
            const removedTable = await TableController.removeOne(tableToRemove._id);
            const updatedTables = await Table.find({ businessId: "22" }).sort({ position: 1 });

            //!need to be test again 
            // expect(updatedTables.length).toBe(1);
            // expect(updatedTables[0].position).toBe(1);
        });

        it("should return null if trying to remove non-existing table", async () => {
            const nonExistingId = "609c3d05a3a1a328447c3b57";
            const removedTable = await TableController.removeOne(nonExistingId);
            expect(removedTable).toBeNull();
        });
    });

    describe('updateOne function', () => {
        it("should update table's sticky column successfully", async () => {
            const tableToCreate = {
                table_name: "test_table_to_update_1",
                column_name: "name",
                sticky: true,
                businessId: "123"
            };

            const tableToCreate_2 = {
                ...tableToCreate,
                table_name: "test_table_to_update_2",
                sticky: true
            }

            const createdTable = await TableController.createOne(tableToCreate);

            const createdTable_2 = await TableController.createOne(tableToCreate_2);

            const updatedTable = await TableController.updateOne(createdTable._id, { sticky: false });

            // expect(updatedTable.sticky).toBe(false);


            await expect(TableController.updateOne(createdTable_2._id, { sticky: true })).rejects.toThrow('Table Column Already Not Sticky');
        });


        it("should update table's position successfully", async () => {
            const tablesToCreate = [
                {
                    table_name: "test_table_position1",
                    column_name: "name1",
                    sticky: true,
                    businessId: "123"
                },
                {
                    table_name: "test_table_position2",
                    column_name: "name2",
                    sticky: true,
                    businessId: "123"
                }
            ];
            for (const tableData of tablesToCreate) {
                await TableController.createOne(tableData);
            }

            const tableToUpdate = await Table.findOne({ table_name: "test_table_position1" });
            const newPosition = 3;
            const updatedTable = await TableController.updateOne(tableToUpdate._id, { position: newPosition });
            expect(updatedTable.position).toBe(newPosition);

            await expect(TableController.updateOne(tableToUpdate._id, { position: 0 })).rejects.toThrow('Invalid Position');
        });
    });





    describe('getAll function', () => {
        it("should retrieve documents from the 'Table' collection with pagination", async () => {
            // Define a mock filter and options for pagination
            const filter = {};
            const options = {
                page: 1,
                limit: 10
            };

            const result = await TableController.getAll(filter, options);

            expect(result).toHaveProperty('docs');
            expect(result).toHaveProperty('totalDocs');
            expect(result).toHaveProperty('limit');
            expect(result).toHaveProperty('page');
            expect(result).toHaveProperty('totalPages');
            expect(result).toHaveProperty('pagingCounter');
            expect(result).toHaveProperty('hasPrevPage');
            expect(result).toHaveProperty('hasNextPage');
            expect(result).toHaveProperty('prevPage');
            expect(result).toHaveProperty('nextPage');
            console.log("------------------------------", result)
        });




        it("should handle errors gracefully", async () => {
            const filter = {};
            const options = {
                page: 1,
                limit: 10
            };

            jest.spyOn(Table, 'paginate').mockImplementationOnce(() => {
                return Promise.reject(new Error('Pagination Error'));
            });

            await expect(TableController.getAll(filter, options)).rejects.toThrow('Pagination Error');

            Table.paginate.mockRestore();
        });
    });

});
