import {NextFunction, Request, Response} from "express";
import {HydratedDocument} from "mongoose";
import {IHousehold, isValidHouseholdType} from "../models/household.model";
import {
    IFamilyMember,
    isValidDecimal,
    isValidDOB,
    isValidGender,
    isValidMaritalStatus,
    isValidOccupationType
} from "../models/familyMember.model";

const ObjectId = require('mongoose').Types.ObjectId;

const Household = require('../models/household.schema');
const FamilyMember = require('../models/familyMember.schema');

// Student Encouragement Bonus
const studentEncouragementBonus = async (): Promise<[HydratedDocument<IHousehold>]> => {
    return Household.aggregate(
        [
            {
                $group:
                    {
                        _id: '$_id',
                        householdType: {$first: '$householdType'},
                        householdIncome: {$sum: {$sum: '$familyMembers.annualIncome'}},
                        familyMembers: {$first: '$familyMembers'}
                    }
            },
            {
                $addFields:
                    {
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
                $match:
                    {
                        $and: [
                            { 'familyMembers.age': { $lt: 16 } },
                            { 'familyMembers.occupationType': { $eq: 'Student' } },
                            { 'householdIncome': { $lt: 200000 } }
                        ]
                    }
            },
            {
                $addFields:
                    {
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
        ]
    );
};

// Multigeneration Scheme
const multiGenerationScheme = async (): Promise<[HydratedDocument<IHousehold>]> => {
    return Household.aggregate(
        [
            {
                $group:
                    {
                        _id: '$_id',
                        householdType: {$first: '$householdType'},
                        householdIncome: {$sum: {$sum: '$familyMembers.annualIncome'}},
                        familyMembers: {$first: '$familyMembers'}
                    }
            },
            {
                $addFields:
                    {
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
                $match:
                    {
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
        ]
    );
};

// Elder Bonus
const elderBonus = async (): Promise<[HydratedDocument<IHousehold>]> => {
    return Household.aggregate(
        [
            {
                $project:
                    {
                        _id: '$_id',
                        householdType: '$householdType',
                        familyMembers: '$familyMembers'
                    }
            },
            {
                $addFields:
                    {
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
                $match:
                    {
                        $and: [
                            { 'householdType': { $eq: 'HDB' } },
                            { 'familyMembers.age': { $gte: 55 } }
                        ]
                    }
            },
            {
                $addFields:
                    {
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
        ]
    );
};

// Baby Sunshine Grant
const babySunshineGrant = async (): Promise<[HydratedDocument<IHousehold>]> => {
    return Household.aggregate(
        [
            {
                $project:
                    {
                        _id: '$_id',
                        householdType: '$householdType',
                        familyMembers: '$familyMembers'
                    }
            },
            {
                $addFields:
                    {
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
                $addFields:
                    {
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
        ]
    );
};

// YOLO GST Grant
const yoloGstGrant = async (): Promise<[HydratedDocument<IHousehold>]> => {
    return Household.aggregate(
        [
            {
                $group:
                    {
                        _id: '$_id',
                        householdType: {$first: '$householdType'},
                        householdIncome: {$sum: {$sum: '$familyMembers.annualIncome'}},
                        familyMembers: {$first: '$familyMembers'}
                    }
            },
            {
                $match:
                    {
                        $and: [
                            { 'householdType': { $eq: 'HDB' } },
                            { 'householdIncome': { $lt: 100000 } }
                        ]
                    }
            }
        ]
    );
};

// List the households and qualifying members of grant disbursement
exports.findQualifyingHouseholds = async (req: Request, res: Response, next: NextFunction) => {
    let data: [HydratedDocument<IHousehold>] | undefined;
    switch (req.params.grantOption) {
        case "0":
            data = await studentEncouragementBonus();
            break;
        case "1":
            data = await multiGenerationScheme();
            break;
        case "2":
            data = await elderBonus();
            break;
        case "3":
            data = await babySunshineGrant();
            break;
        case "4":
            data = await yoloGstGrant();
            break;
        default:
            res.status(404).json({message: 'Invalid argument.'});
            break;
    }
    res.status(200).json(data);
}

// Retrieves all household records
exports.getAllHouseholds = (req: Request, res: Response, next: NextFunction) => {
    Household.find()
        .select({
                _id: 1,
                householdType: 1,
                familyMembers: {
                    name: 1,
                    gender: 1,
                    maritalStatus: 1,
                    spouse: 1,
                    occupationType: 1,
                    annualIncome: 1,
                    DOB: 1
                }
            }
        )
        .then((households: [HydratedDocument<IHousehold>]) => {
            if (households)
                res.status(200).json(households);
            else
                res.status(404).json({message: 'Household not found!'});
        })
        .catch((err: any) => {
            res.json({message: err});
        });
};

// Retrieves a household records by ID
exports.findHousehold = (req: Request, res: Response, next: NextFunction) => {
    Household.findById(ObjectId(req.params.id))
        .select({
            _id: 1,
            householdType: 1,
            familyMembers: {
                name: 1,
                gender: 1,
                maritalStatus: 1,
                occupationType: 1,
                annualIncome: 1,
                DOB: 1
            }
        })
        .then((household: HydratedDocument<IHousehold>) => {
            if (household)
                res.status(200).json(household);
            else
                res.status(404).json({ message: 'Household not found!' });
        })
        .catch((err: any) => {
            res.json({ message: err });
        });
};

// Creates a household record
exports.createHousehold = (req: Request, res: Response, next: NextFunction) => {
    /* This is a check to ensure that the request body is not empty.
    If it is empty, it will return a 400 error. */
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ message: 'Request body empty. Ensure data is submitted in JSON format.' });
        return;
    }

    if (!isValidHouseholdType(req.body.householdType)) {
        res.status(400).json({ message: 'Invalid household type.' });
        return;
    }

    const householdObj: IHousehold = {
        householdType: req.body.householdType,
        street: req.body.street,
        unit: req.body.unit,
        postal: req.body.postal
    };

    const household: HydratedDocument<IHousehold> = new Household(householdObj);
    household.save()
        .then((result: any) => {
            res.status(201).json({
                message: 'Household added successfully',
                householdId: result._id
            });
        })
        .catch((err: any) => {
            res.status(400).json({ message: err });
        });
};

// Add a family member into household record
exports.addFamilyMember = (req: Request, res: Response, next: NextFunction) => {
    /* This is a check to ensure that the request body is not empty.
    If it is empty, it will return a 400 error. */
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({
            message: 'Request body empty. Ensure data is submitted in JSON format.'
        });
        return;
    }

    let errMsg = "Invalid field(s): ";
    if (!isValidGender(req.body.gender))
        errMsg += "gender, ";
    if (!isValidMaritalStatus(req.body.maritalStatus))
        errMsg += "marital status, ";
    if (!isValidOccupationType(req.body.occupationType))
        errMsg += "occupation type, ";
    if (!isValidDecimal(req.body.annualIncome))
        errMsg += "annual income, ";
    if (!isValidDOB(req.body.DOB_day, req.body.DOB_month, req.body.DOB_year))
        errMsg += "DOB, ";
    if (errMsg !== "Invalid field(s): ") {
        res.status(400).json({ message: `${errMsg.slice(0, errMsg.length - 2)}.` });
        return;
    }

    const familyMemberObj: IFamilyMember = {
        name: req.body.name,
        gender: req.body.gender,
        maritalStatus: req.body.maritalStatus,
        spouse: req.body?.spouse,
        occupationType: req.body.occupationType,
        annualIncome: req.body.annualIncome,
        DOB: new Date(`${req.body.DOB_year}-${req.body.DOB_month}-${req.body.DOB_day}`)
    };

    Household.findById(ObjectId(req.params.id)).then((households: HydratedDocument<IFamilyMember>) => {
        if (households) {
            let familyMembers: [HydratedDocument<IFamilyMember>] = households.get('familyMembers');
            familyMembers.push(new FamilyMember(familyMemberObj));

            const household: HydratedDocument<IHousehold> = new Household({
                _id: req.params.id,
                householdType: households.get('householdType'),
                street: households.get('street'),
                unit: households.get('unit'),
                postal: households.get('postal'),
                familyMembers: familyMembers
            });

            household.updateOne(household)
                .then((result: any) => {
                    if (result.modifiedCount > 0)
                        res.status(200).json({ message: `${req.body.name} has been added to the household!` });
                    else
                        res.status(400).json({ message: "Family member is not recorded." });
                })
                .catch((err: any) => {
                    res.status(404).json({ message: err });
                });
        }
        else {
            res.status(404).json({ message: 'Household not found!' });
        }
    });
};