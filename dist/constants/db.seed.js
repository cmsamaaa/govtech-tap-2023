"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.household_list = void 0;
const ObjectId = require('mongoose').Types.ObjectId;
exports.household_list = [
    {
        _id: ObjectId('000000000001'),
        householdType: "HDB",
        address: "308A Anchorvale Link",
        unit: "12-88",
        postal: "541308",
        familyMembers: [
            {
                _id: ObjectId('100000000001'),
                name: "John Doe",
                gender: "Male",
                maritalStatus: "Married",
                spouse: "Jane Doe",
                occupationType: "Employed",
                annualIncome: 30000,
                DOB: new Date("1978-09-27")
            },
            {
                _id: ObjectId('100000000002'),
                name: "Jane Doe",
                gender: "Female",
                maritalStatus: "Married",
                spouse: "100000000001",
                occupationType: "Unemployed",
                annualIncome: 24000,
                DOB: new Date("1980-08-24")
            },
            {
                _id: ObjectId('100000000003'),
                name: "Jack Doe",
                gender: "Male",
                maritalStatus: "Single",
                occupationType: "Student",
                annualIncome: 0,
                DOB: new Date("2010-09-14")
            }
        ]
    },
    {
        _id: ObjectId('000000000002'),
        householdType: "HDB",
        address: "438 Yishun Ave 11",
        unit: "06-311",
        postal: "760438",
        familyMembers: [
            {
                _id: ObjectId('200000000001'),
                name: "Aaron Lim",
                gender: "Male",
                maritalStatus: "Married",
                spouse: "Andrea Lim",
                occupationType: "Employed",
                annualIncome: 25260,
                DOB: new Date("1958-03-06")
            },
            {
                _id: ObjectId('200000000002'),
                name: "Andrea Lim",
                gender: "Female",
                maritalStatus: "Married",
                spouse: "200000000001",
                occupationType: "Unemployed",
                annualIncome: 0,
                DOB: new Date("1960-07-12")
            },
            {
                _id: ObjectId('200000000003'),
                name: "William Tan",
                gender: "Male",
                maritalStatus: "Single",
                occupationType: "Employed",
                annualIncome: 78000,
                DOB: new Date("1980-04-20")
            },
            {
                _id: ObjectId('200000000004'),
                name: "Adrian Lim",
                gender: "Male",
                maritalStatus: "Single",
                occupationType: "Student",
                annualIncome: 0,
                DOB: new Date("1997-07-11")
            },
            {
                _id: ObjectId('200000000005'),
                name: "Granny Lim",
                gender: "Female",
                maritalStatus: "Widowed",
                occupationType: "Unemployed",
                annualIncome: 0,
                DOB: new Date("1938-08-08")
            }
        ]
    },
    {
        _id: ObjectId('000000000003'),
        householdType: "HDB",
        address: "177 Bukit Batok West Ave. 8",
        unit: "03-102",
        postal: "650177",
        familyMembers: [
            {
                _id: ObjectId('300000000001'),
                name: "James Tan",
                gender: "Male",
                maritalStatus: "Married",
                spouse: "Jessie Tan",
                occupationType: "Employed",
                annualIncome: 85000,
                DOB: new Date("1982-01-18")
            },
            {
                _id: ObjectId('300000000002'),
                name: "Jessie Tan",
                gender: "Female",
                maritalStatus: "Married",
                spouse: "300000000001",
                occupationType: "Employed",
                annualIncome: 60000,
                DOB: new Date("1986-03-23")
            },
            {
                _id: ObjectId('300000000003'),
                name: "Melissa Tan",
                gender: "Female",
                maritalStatus: "Single",
                occupationType: "Student",
                annualIncome: 0,
                DOB: new Date("1997-07-20")
            },
            {
                _id: ObjectId('300000000004'),
                name: "May Tan",
                gender: "Female",
                maritalStatus: "Single",
                occupationType: "Student",
                annualIncome: 0,
                DOB: new Date("2011-12-02")
            }
        ]
    },
    {
        _id: ObjectId('000000000004'),
        householdType: "Condominium",
        address: "3 Punggol Field Walk",
        unit: "02-05",
        postal: "828740",
        familyMembers: [
            {
                _id: ObjectId('400000000001'),
                name: "Dennis Chua",
                gender: "Male",
                maritalStatus: "Married",
                spouse: "Lily Chua",
                occupationType: "Employed",
                annualIncome: 120000,
                DOB: new Date("1982-08-18")
            },
            {
                _id: ObjectId('400000000002'),
                name: "Lily Chua",
                gender: "Female",
                maritalStatus: "Married",
                spouse: "400000000001",
                occupationType: "Employed",
                annualIncome: 65000,
                DOB: new Date("1990-08-15")
            },
            {
                _id: ObjectId('400000000003'),
                name: "Toddler Chua",
                gender: "Male",
                maritalStatus: "Single",
                occupationType: "Unemployed",
                annualIncome: 0,
                DOB: new Date("2021-02-01")
            },
            {
                _id: ObjectId('400000000004'),
                name: "Baby Chua",
                gender: "Female",
                maritalStatus: "Single",
                occupationType: "Student",
                annualIncome: 0,
                DOB: new Date("2022-07-21")
            }
        ]
    },
    {
        _id: ObjectId('000000000005'),
        householdType: "Landed",
        address: "151 Countryside Road",
        unit: "01-01",
        postal: "786877",
        familyMembers: [
            {
                _id: ObjectId('500000000001'),
                name: "Richie Wong",
                gender: "Male",
                maritalStatus: "Married",
                spouse: "Lily Chua",
                occupationType: "Employed",
                annualIncome: 382000,
                DOB: new Date("1972-01-01")
            },
            {
                _id: ObjectId('500000000002'),
                name: "Roselyn Wong",
                gender: "Female",
                maritalStatus: "Married",
                spouse: "500000000001",
                occupationType: "Employed",
                annualIncome: 100000,
                DOB: new Date("1981-06-08")
            },
            {
                _id: ObjectId('500000000003'),
                name: "Raelynn Chua",
                gender: "Female",
                maritalStatus: "Single",
                occupationType: "Employed",
                annualIncome: 32000,
                DOB: new Date("2002-12-01")
            },
            {
                _id: ObjectId('500000000004'),
                name: "Nicole Chua",
                gender: "Female",
                maritalStatus: "Single",
                occupationType: "Student",
                annualIncome: 0,
                DOB: new Date("2003-11-15")
            },
            {
                _id: ObjectId('500000000005'),
                name: "Ray Chua",
                gender: "Male",
                maritalStatus: "Single",
                occupationType: "Student",
                annualIncome: 0,
                DOB: new Date("2008-07-21")
            }
        ]
    }
];
