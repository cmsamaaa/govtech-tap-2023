import {household_list} from "../constants/db.seed";

const Household = require('../models/household.schema')

/**
 * If the environment is not test, then find all households,
 * if there are none, then insert the household_list.
 */
export async function insertSeed() {
    if (process.env.NODE_ENV !== 'test') {
        const result = await Household.find();
        if (result.length === 0)
            await Household.insertMany(household_list);
    }
}
