import { Schema } from "mongoose";

export type HouseholdType = 'Landed' | 'Condominium' | 'HDB';

export interface IHousehold {
    _id?: Schema.Types.ObjectId;
    householdType: HouseholdType;
    street?: String;
    unit?: String;
    postal?: Number;
    familyMembers?: [];
}

export function isValidHouseholdType(householdType: String): householdType is HouseholdType {
    return ['Landed', 'Condominium', 'HDB'].includes(householdType.toString());
}