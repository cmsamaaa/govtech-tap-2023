import { Schema } from "mongoose";

export interface IFamilyMember {
    _id?: Schema.Types.ObjectId;
    name: String;
    gender: 'Male' | 'Female';
    maritalStatus: 'Single' | 'Married' | 'Divorced';
    spouse?: String | Schema.Types.ObjectId;
    occupationType: 'Unemployed' | 'Student' | 'Employed';
    annualIncome: Number;
    DOB: Date;
}