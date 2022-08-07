import { Schema } from "mongoose";
import {HouseholdType} from "./household.model";

export type Gender = 'Male' | 'Female';
export type MaritalStatus = 'Single' | 'Married' | 'Divorced';
export type OccupationType = 'Unemployed' | 'Student' | 'Employed';

export interface IFamilyMember {
    _id?: Schema.Types.ObjectId;
    name: String;
    gender: Gender;
    maritalStatus: MaritalStatus;
    spouse?: String | Schema.Types.ObjectId;
    occupationType: OccupationType;
    annualIncome: Number;
    DOB: Date;
}

export function isValidGender(gender: String): gender is Gender {
    return ['Male', 'Female'].includes(gender.toString());
}

export function isValidMaritalStatus(maritalStatus: String): maritalStatus is MaritalStatus {
    return ['Single', 'Married', 'Divorced'].includes(maritalStatus.toString());
}

export function isValidOccupationType(occupationType: String): occupationType is OccupationType {
    return ['Unemployed', 'Student', 'Employed'].includes(occupationType.toString());
}

export function isValidDecimal(value: Number): value is Number {
    return !!Number(value) || value === 0;
}

export function isValidDOB(day: String, month: String, year: String): boolean {
    const regex = new RegExp('^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])$');
    return regex.test(`${year}-${month}-${day}`);
}