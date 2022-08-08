import {Schema, model} from 'mongoose';
import {IFamilyMember} from "./familyMember.model";

const familyMemberSchema: Schema<IFamilyMember> = new Schema<IFamilyMember>({
        name: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        maritalStatus: {
            type: String,
            required: true
        },
        spouse: {
            type: String
        },
        occupationType: {
            type: String,
            required: true
        },
        annualIncome: {
            type: Number,
            required: true
        },
        DOB: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: false,
        versionKey: false
    });

module.exports = model<IFamilyMember>('FamilyMembers', familyMemberSchema);