"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FamilyMember = require('../models/familyMember.schema');
const householdSchema = new mongoose_1.Schema({
    householdType: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    postal: {
        type: Number,
        required: true
    },
    familyMembers: [
        FamilyMember.schema
    ]
});
module.exports = (0, mongoose_1.model)('Households', householdSchema);
