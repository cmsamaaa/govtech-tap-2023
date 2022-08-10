import {household_list} from "../constants/db.seed";

const Household = require('../models/household.schema')

export async function insertSeed() {
    if (process.env.NODE_ENV !== 'test') {
        const result = await Household.find();
        if (result.length === 0)
            await Household.insertMany(household_list);
    }
}
