import {NextFunction, Request, Response} from "express";
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

// Creates a household record
exports.createHousehold = async (req: Request, res: Response, next: NextFunction) => {
    /* This is a check to ensure that the request body is not empty.
    If it is empty, it will return a 400 error. */
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({message: 'Request body empty. Ensure data is submitted in JSON format.'});
        return;
    }

    if (!isValidHouseholdType(req.body.householdType)) {
        res.status(400).json({message: 'Invalid household type.'});
        return;
    }

    const householdObj: IHousehold = {
        householdType: req.body.householdType,
        street: req.body.street,
        unit: req.body.unit,
        postal: req.body.postal
    };

    const household = new Household(householdObj);

    try {
        const result = await household.save();
        res.status(201).json({
            message: 'Household added successfully',
            householdId: result._id
        });
    } catch (e) {
        res.status(400).json({message: 'Fail to create household record, please check your request again.'});
    }
};

// Add a family member to household
exports.addFamilyMember = async (req: Request, res: Response, next: NextFunction) => {
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
        res.status(400).json({message: `${errMsg.slice(0, errMsg.length - 2)}.`});
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

    try {
        const householdJSON = await Household.findById(ObjectId(req.params.id));

        if (householdJSON) {
            const familyMembers = householdJSON.get('familyMembers');
            familyMembers.push(new FamilyMember(familyMemberObj));

            const household = new Household({
                _id: req.params.id,
                householdType: householdJSON.get('householdType'),
                street: householdJSON.get('street'),
                unit: householdJSON.get('unit'),
                postal: householdJSON.get('postal'),
                familyMembers: familyMembers
            });

            const result = await household.updateOne(household);

            if (result.modifiedCount > 0)
                res.status(200).json({message: `${req.body.name} has been added to the household!`});
            else
                res.status(400).json({message: "Family member is not recorded."});
        } else {
            res.status(404).json({message: 'Household record cannot be found!'});
        }
    } catch (e) {
        res.status(404).json({message: 'Household record cannot be found!'});
    }
};

// List all households
exports.getAllHouseholds = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const households = await Household.find()
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
            );

        res.status(200).json(households);
    } catch (e) {
        res.status(404).json({message: 'An error has occurred, please check your request again.'});
    }
};

// Search for a specific household
exports.findHousehold = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const household = await Household.findById(ObjectId(req.params.id))
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
            });

        if (household)
            res.status(200).json(household);
        else
            res.status(404).json({message: 'Household not found!'});
    } catch (e) {
        res.status(404).json({message: 'An error has occurred, please check your request again.'});
    }
};

// List the households and qualifying members of grant disbursement
exports.findQualifyingHouseholds = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let data;
        switch (req.params.option) {
            case "0":
                data = await Household.studentEncouragementBonus();
                break;
            case "1":
                data = await Household.multiGenerationScheme();
                break;
            case "2":
                data = await Household.elderBonus();
                break;
            case "3":
                data = await Household.babySunshineGrant();
                break;
            case "4":
                data = await Household.yoloGstGrant();
                break;
            default:
                res.status(404).json({message: 'Invalid argument.'});
                break;
        }

        res.status(200).json(data);
    } catch (e) {
        res.status(404).json({message: e});
    }
}