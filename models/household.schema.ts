import {Schema, model} from 'mongoose';
import {IHousehold} from './household.model';

const householdSchema: Schema<IHousehold> = new Schema({
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
    }
});

module.exports = model('Households', householdSchema);