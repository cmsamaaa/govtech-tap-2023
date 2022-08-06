import { Schema } from "mongoose";

export interface IHousehold {
    _id?: Schema.Types.ObjectId;
    householdType: 'Landed' | 'Condominium' | 'HDB';
    street: String;
    unit: String;
    postal: Number;
    familyMembers?: [];
}