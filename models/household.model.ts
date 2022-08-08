import {Schema} from "mongoose";

export type HouseholdType = 'Landed' | 'Condominium' | 'HDB';

export interface IHousehold {
    _id?: Schema.Types.ObjectId;
    householdType: HouseholdType;
    street: String;
    unit: String;
    postal: String;
    familyMembers?: [];
}

export function isValidHouseholdType(householdType: String): householdType is HouseholdType {
    return ['Landed', 'Condominium', 'HDB'].includes(householdType.toString());
}

export function isValidUnit(unit: String): boolean {
    const regex = new RegExp('^[0-9]{2}-[0-9]{2}$');
    return regex.test(unit.toString());
}

export function isValidPostal(postal: String): boolean {
    const regex = new RegExp('^[0-9]{6}$');
    return regex.test(postal.toString());
}