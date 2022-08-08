"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const familyMemberSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    maritalStatus: {
        type: String,
        required: true
    },
    spouse: {
        type: String
    },
    occupationType: {
        type: String,
        required: true
    },
    annualIncome: {
        type: Number,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    }
}, {
    timestamps: false,
    versionKey: false
});
module.exports = (0, mongoose_1.model)('FamilyMembers', familyMemberSchema);
