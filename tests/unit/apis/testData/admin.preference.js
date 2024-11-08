const dummyAdminPreferences = [
    {
        serviceName: "emailSvc",
        table_name: "users",
        column_name: "first_name",
        columnId: "507f191e810c19729de860ea",
        sticky: false,
        position: 1,
        isShow: true,
        isDeleted: true,
        createdBy: "admin",
        businessId: "business1",
    },
    {
        serviceName: "emailSvc",
        table_name: "orders",
        column_name: "order_id",
        columnId: "507f191e810c19729de860eb",
        sticky: true,
        position: 2,
        isShow: false,
        isDeleted: true,
        createdBy: "manager",
        businessId: "business2",
    },
    {
        serviceName: "emailSvc",
        table_name: "payments",
        column_name: "amount",
        columnId: "507f191e810c19729de860ec",
        sticky: false,
        position: 3,
        isShow: true,
        isDeleted: false,
        createdBy: "finance",
        businessId: "business3",
    },
    {
        serviceName: "emailSvc",
        table_name: "products",
        column_name: "product_name",
        columnId: "507f191e810c19729de860ed",
        sticky: true,
        position: 4,
        isShow: false,
        isDeleted: false,
        createdBy: "product_manager",
        businessId: "business4",
    },
    {
        serviceName: "emailSvc",
        table_name: "customers",
        column_name: "last_name",
        columnId: "507f191e810c19729de860ee",
        sticky: true,
        position: 5,
        isShow: true,
        isDeleted: true,
        createdBy: "support",
        businessId: "business5",
    }
];

const singlleAdminPreference = {
    serviceName: "emailSvc",
    table_name: "userss",
    column_name: "first_names",
    columnId: "507f191e810c19729de860ea",
    sticky: false,
    position: 6,
    isShow: true,
    isDeleted: true,
    createdBy: "admin",
    businessId: "business6",
}


module.exports = {
    dummyAdminPreferences,
    singlleAdminPreference
}