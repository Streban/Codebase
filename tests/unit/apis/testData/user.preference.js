const mongoose = require('mongoose')
const dummyUserPreference = [
    {
        serviceName: "emailSvc",
        table_name: "Inbox",
        columnId: new mongoose.Types.ObjectId(),
        sticky: true,
        position: 1,
        isShow: true,
        userId: "user1",
        isDeleted: false,
        createdBy: "admin",
        businessId: "business100"
    },
    {
        serviceName: "emailSvc",
        table_name: "Sent",
        columnId: new mongoose.Types.ObjectId(),
        sticky: false,
        position: 2,
        isShow: true,
        userId: "user2",
        isDeleted: false,
        createdBy: "admin",
        businessId: "business101"
    },
    {
        serviceName: "emailSvc",
        table_name: "Drafts",
        columnId: new mongoose.Types.ObjectId(),
        sticky: false,
        position: 3,
        isShow: false,
        userId: "user3",
        isDeleted: false,
        createdBy: "admin",
        businessId: "business102"
    },
    {
        serviceName: "emailSvc",
        table_name: "Spam",
        columnId: new mongoose.Types.ObjectId(),
        sticky: true,
        position: 4,
        isShow: true,
        userId: "user4",
        isDeleted: true,
        createdBy: "admin",
        businessId: "business103"
    },
    {
        serviceName: "emailSvc",
        table_name: "Trash",
        columnId: new mongoose.Types.ObjectId(),
        sticky: true,
        position: 5,
        isShow: false,
        userId: "user5",
        isDeleted: true,
        createdBy: "admin",
        businessId: "business104"
    }
];

const singlleUserPreference = {
    serviceName: "emailSvc",
    table_name: "Trash",
    columnId: new mongoose.Types.ObjectId(),
    sticky: true,
    position: 6,
    isShow: false,
    userId: "user5",
    isDeleted: true,
    createdBy: "admin",
    businessId: "business104"
}


module.exports = { singlleUserPreference, dummyUserPreference }