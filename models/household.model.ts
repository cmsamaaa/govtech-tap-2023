import {Schema} from "mongoose";

export type HousingType = 'Landed' | 'Condominium' | 'HDB';

export interface IHousehold {
    _id?: Schema.Types.ObjectId;
    housingType: HousingType;
    address: String;
    unit: String;
    postal: String;
    familyMembers?: [];
}

export function isValidHousingType(housingType: String): housingType is HousingType {
    return ['Landed', 'Condominium', 'HDB'].includes(housingType.toString());
}

export function isValidUnit(unit: String): boolean {
    const regex = new RegExp('^[0-9]{2}-[0-9]{2,4}$');
    return regex.test(unit.toString());
}

export function isValidPostal(postal: String): boolean {
    const regex = new RegExp('^[0-9]{6}$');
    return regex.test(postal.toString());
}