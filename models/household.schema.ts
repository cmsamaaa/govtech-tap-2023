import { Schema, model } from 'mongoose';
import { IHousehold } from './household.model';

const FamilyMember = require('../models/familyMember.schema');

const householdSchema: Schema<IHousehold> = new Schema<IHousehold>({
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

module.exports = model<IHousehold>('Households', householdSchema);