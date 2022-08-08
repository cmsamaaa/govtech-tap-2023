import {NextFunction, Request, Response} from "express";
import {IHousehold, isValidHouseholdType, isValidPostal, isValidUnit} from "../models/household.model";
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

enum StatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    NOT_FOUND = 404
}

// Creates a household record
exports.createHousehold = async (req: Request, res: Response, next: NextFunction) => {
    /* This is a check to ensure that the request body is not empty.
    If it is empty, it will return a 400 error. */
    if (Object.keys(req.body).length === 0) {
        res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: 'Request body empty. Ensure request is submitted in JSON format.'
        });
        return;
    }

    let errMsg = "Invalid field(s): ";
    if (!isValidHouseholdType(req.body.householdType))
        errMsg += "housing type, ";
    if (!req.body.address)
        errMsg += "address, ";
    if (!isValidUnit(req.body.unit))
        errMsg += "unit, ";
    if (!isValidPostal(req.body.postal))
        errMsg += "postal, ";
    if (errMsg !== "Invalid field(s): ") {
        res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: `${errMsg.slice(0, errMsg.length - 2)}.`
        });
        return;
    }

    const householdObj: IHousehold = {
        householdType: req.body.householdType,
        address: req.body.address,
        unit: req.body.unit,
        postal: req.body.postal
    };

    const household = new Household(householdObj);

    try {
        const result = await household.save();
        res.status(StatusCode.CREATED).json({
            statusCode: StatusCode.CREATED,
            message: 'Household added successfully',
            _id: result._id
        });
    } catch (e) {
        res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: 'Fail to create household record, please check your request again.'
        });
    }
};

// Add a family member to household
exports.addFamilyMember = async (req: Request, res: Response, next: NextFunction) => {
    /* This is a check to ensure that the request body is not empty.
    If it is empty, it will return a 400 error. */
    if (Object.keys(req.body).length === 0) {
        res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: 'Request body empty. Ensure request is submitted in JSON format.'
        });
        return;
    }

    let errMsg = "Invalid field(s): ";
    if (!isValidGender(req.body.gender))
        errMsg += "gender, ";
    if (!isValidMaritalStatus(req.body.maritalStatus))
        errMsg += "marital status, ";
    if (req.body.maritalStatus === "Married" && req.body.maritalStatus && !req.body.spouse)
        errMsg += "spouse, ";
    if (!isValidOccupationType(req.body.occupationType))
        errMsg += "occupation type, ";
    if (!isValidDecimal(req.body.annualIncome))
        errMsg += "annual income, ";
    if (!isValidDOB(req.body.DOB_day, req.body.DOB_month, req.body.DOB_year))
        errMsg += "DOB, ";
    if (errMsg !== "Invalid field(s): ") {
        res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: `${errMsg.slice(0, errMsg.length - 2)}.`
        });
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

    let householdJSON;
    try {
        householdJSON = await Household.findById(ObjectId(req.params.id));
    } catch (e) {
        res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: 'An error has occurred when retrieving household record, please check your request again.'
        });
    }

    if (householdJSON) {
        const familyMembers = householdJSON.get('familyMembers');

        if (new ObjectId(req.body.spouse) == req.body.spouse) {
            let isFound = false;
            for (let i = 0; i < familyMembers.length; i++) {
                if (familyMembers[i]._id == familyMemberObj.spouse && familyMembers[i].spouse === familyMemberObj.name) {
                    isFound = true;
                    break;
                }
            }

            if (!isFound) {
                res.status(StatusCode.BAD_REQUEST).json({
                    statusCode: StatusCode.BAD_REQUEST,
                    message: 'An error has occurred. This is due to an invalid spouse id or a different spouse name being provided from the original record.'
                });
                return;
            }
        }

        familyMembers.push(new FamilyMember(familyMemberObj));

        const household = new Household({
            _id: req.params.id,
            householdType: householdJSON.get('householdType'),
            address: householdJSON.get('address'),
            unit: householdJSON.get('unit'),
            postal: householdJSON.get('postal'),
            familyMembers: familyMembers
        });

        try {
            const result = await household.updateOne(household);

            if (result.modifiedCount > 0)
                res.status(StatusCode.OK).json({
                    statusCode: StatusCode.OK,
                    message: `${req.body.name} has been added to the household!`
                });
            else
                res.status(StatusCode.BAD_REQUEST).json({
                    statusCode: StatusCode.BAD_REQUEST,
                    message: "Family member is not recorded."
                });
        } catch (e) {
            res.status(StatusCode.BAD_REQUEST).json({
                statusCode: StatusCode.BAD_REQUEST,
                message: 'An error has occurred when updating record, please check your request again.'
            });
        }
    } else {
        res.status(StatusCode.NOT_FOUND).json({
            statusCode: StatusCode.NOT_FOUND,
            message: 'Household record cannot be found!'
        });
    }
};

// List all households
exports.getAllHouseholds = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const households = await Household.find().select({
            _id: 1,
            householdType: 1,
            address: 1,
            unit: 1,
            postal: 1,
            familyMembers: {
                _id: 1,
                name: 1,
                gender: 1,
                maritalStatus: 1,
                spouse: 1,
                occupationType: 1,
                annualIncome: 1,
                DOB: 1
            }
        });

        res.status(StatusCode.OK).json({
            statusCode: StatusCode.OK,
            result: households
        });
    } catch (e) {
        res.status(StatusCode.NOT_FOUND).json({
            statusCode: StatusCode.NOT_FOUND,
            message: 'An error has occurred, please check your request again.'
        });
    }
};

// Search for a specific household
exports.findHousehold = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const household = await Household.findById(ObjectId(req.params.id)).select({
            _id: 1,
            householdType: 1,
            address: 1,
            unit: 1,
            postal: 1,
            familyMembers: {
                _id: 1,
                name: 1,
                gender: 1,
                maritalStatus: 1,
                spouse: 1,
                occupationType: 1,
                annualIncome: 1,
                DOB: 1
            }
        });

        if (household)
            res.status(StatusCode.OK).json({
                statusCode: StatusCode.OK,
                result: household
            });
        else
            res.status(StatusCode.NOT_FOUND).json({
                statusCode: StatusCode.NOT_FOUND,
                message: 'Household not found!'
            });
    } catch (e) {
        res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: 'An error has occurred, please check your request again.'
        });
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
                res.status(StatusCode.NOT_FOUND).json({
                    statusCode: StatusCode.NOT_FOUND,
                    message: 'Invalid argument.'
                });
                break;
        }

        res.status(StatusCode.OK).json({
            statusCode: StatusCode.OK,
            result: data
        });
    } catch (e) {
        res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: 'An error has occurred, please check your request again.'
        });
    }
}