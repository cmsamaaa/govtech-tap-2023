"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FamilyMember = require('../models/familyMember.schema');
const householdSchema = new mongoose_1.Schema({
    householdType: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    postal: {
        type: String,
        required: true
    },
    familyMembers: [
        FamilyMember.schema
    ]
}, {
    timestamps: true,
    versionKey: false
});
// Student Encouragement Bonus
householdSchema.statics.studentEncouragementBonus = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.aggregate([
            {
                $group: {
                    _id: '$_id',
                    householdType: { $first: '$householdType' },
                    address: { $first: '$address' },
                    unit: { $first: '$unit' },
                    postal: { $first: '$postal' },
                    householdIncome: { $sum: { $sum: '$familyMembers.annualIncome' } },
                    familyMembers: { $first: '$familyMembers' }
                }
            },
            {
                $addFields: {
                    familyMembers: {
                        $map: {
                            input: '$familyMembers',
                            as: 'fm',
                            in: {
                                $mergeObjects: [
                                    '$$fm', {
                                        age: {
                                            $dateDiff: {
                                                startDate: '$$fm.DOB',
                                                endDate: new Date(),
                                                unit: 'year'
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    $and: [
                        { 'familyMembers.age': { $lt: 16 } },
                        { 'familyMembers.occupationType': { $eq: 'Student' } },
                        { 'householdIncome': { $lt: 200000 } }
                    ]
                }
            },
            {
                $addFields: {
                    familyMembers: {
                        $filter: {
                            input: '$familyMembers',
                            as: 'fm',
                            cond: {
                                $and: [
                                    { $lt: ['$$fm.age', 16] },
                                    { $eq: ['$$fm.occupationType', 'Student'] }
                                ]
                            }
                        }
                    }
                }
            }
        ]);
    });
};
// Multigeneration Scheme
householdSchema.statics.multiGenerationScheme = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.aggregate([
            {
                $group: {
                    _id: '$_id',
                    householdType: { $first: '$householdType' },
                    address: { $first: '$address' },
                    unit: { $first: '$unit' },
                    postal: { $first: '$postal' },
                    householdIncome: { $sum: { $sum: '$familyMembers.annualIncome' } },
                    familyMembers: { $first: '$familyMembers' }
                }
            },
            {
                $addFields: {
                    familyMembers: {
                        $map: {
                            input: '$familyMembers',
                            as: 'fm',
                            in: {
                                $mergeObjects: [
                                    '$$fm', {
                                        age: {
                                            $dateDiff: {
                                                startDate: '$$fm.DOB',
                                                endDate: new Date(),
                                                unit: 'year'
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                { 'familyMembers.age': { $lt: 18 } },
                                { 'familyMembers.age': { $gt: 55 } }
                            ]
                        },
                        { 'householdIncome': { $lt: 150000 } }
                    ]
                }
            }
        ]);
    });
};
// Elder Bonus
householdSchema.statics.elderBonus = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.aggregate([
            {
                $project: {
                    _id: '$_id',
                    householdType: '$householdType',
                    address: '$address',
                    unit: '$unit',
                    postal: '$postal',
                    familyMembers: '$familyMembers'
                }
            },
            {
                $addFields: {
                    familyMembers: {
                        $map: {
                            input: '$familyMembers',
                            as: 'fm',
                            in: {
                                $mergeObjects: [
                                    '$$fm', {
                                        age: {
                                            $dateDiff: {
                                                startDate: '$$fm.DOB',
                                                endDate: new Date(),
                                                unit: 'year'
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    $and: [
                        { 'householdType': { $eq: 'HDB' } },
                        { 'familyMembers.age': { $gte: 55 } }
                    ]
                }
            },
            {
                $addFields: {
                    familyMembers: {
                        $filter: {
                            input: '$familyMembers',
                            as: 'fm',
                            cond: {
                                $gte: ['$$fm.age', 55]
                            }
                        }
                    }
                }
            }
        ]);
    });
};
// Baby Sunshine Grant
householdSchema.statics.babySunshineGrant = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.aggregate([
            {
                $project: {
                    _id: '$_id',
                    householdType: '$householdType',
                    address: '$address',
                    unit: '$unit',
                    postal: '$postal',
                    familyMembers: '$familyMembers'
                }
            },
            {
                $addFields: {
                    familyMembers: {
                        $map: {
                            input: '$familyMembers',
                            as: 'fm',
                            in: {
                                $mergeObjects: [
                                    '$$fm', {
                                        age_month: {
                                            $dateDiff: {
                                                startDate: '$$fm.DOB',
                                                endDate: new Date(),
                                                unit: 'month'
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    'familyMembers.age_month': { $lt: 8 }
                }
            },
            {
                $addFields: {
                    familyMembers: {
                        $filter: {
                            input: '$familyMembers',
                            as: 'fm',
                            cond: {
                                $lt: ['$$fm.age_month', 8]
                            }
                        }
                    }
                }
            }
        ]);
    });
};
// YOLO GST Grant
householdSchema.statics.yoloGstGrant = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.aggregate([
            {
                $group: {
                    _id: '$_id',
                    householdType: { $first: '$householdType' },
                    address: { $first: '$address' },
                    unit: { $first: '$unit' },
                    postal: { $first: '$postal' },
                    householdIncome: { $sum: { $sum: '$familyMembers.annualIncome' } },
                    familyMembers: { $first: '$familyMembers' }
                }
            },
            {
                $match: {
                    $and: [
                        { 'householdType': { $eq: 'HDB' } },
                        { 'householdIncome': { $lt: 100000 } }
                    ]
                }
            }
        ]);
    });
};
module.exports = (0, mongoose_1.model)('Households', householdSchema);
