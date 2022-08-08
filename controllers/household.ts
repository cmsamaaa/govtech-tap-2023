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

import {HTTP_STATUS} from "../constants/http_status";
const Household = require('../models/household.schema');
const FamilyMember = require('../models/familyMember.schema');

// Creates a household record
exports.createHousehold = async (req: Request, res: Response, next: NextFunction) => {
    /* This is a check to ensure that the request body is not empty.
    If it is empty, it will return a 400 error. */
    if (Object.keys(req.body).length === 0) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
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
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: `${errMsg.slice(0, errMsg.length - 2)}.`
        });
        return;
    }

    if (req.body.householdType === "Landed" && req.body.unit !== "01-01") {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: 'Invalid unit number for \'Landed\' householdType. Refer to API documentations for more details.'
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
        res.status(HTTP_STATUS.CREATED).json({
            statusCode: HTTP_STATUS.CREATED,
            message: 'Household added successfully',
            _id: result._id
        });
    } catch (e) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: 'Fail to create household record, please check your request again.'
        });
    }
};

// Add a family member to household
exports.addFamilyMember = async (req: Request, res: Response, next: NextFunction) => {
    /* This is a check to ensure that the request body is not empty.
    If it is empty, it will return a 400 error. */
    if (Object.keys(req.body).length === 0) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
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
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
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
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: 'An error has occurred when retrieving household record, please check your request again.'
        });
    }

    if (householdJSON) {
        const familyMembers = householdJSON.get('familyMembers');

        if (ObjectId.isValid(req.body.spouse)) {
            if (new ObjectId(req.body.spouse) == req.body.spouse) {
                let isFound = false;
                for (let i = 0; i < familyMembers.length; i++) {
                    if (familyMembers[i]._id == familyMemberObj.spouse && familyMembers[i].spouse === familyMemberObj.name) {
                        isFound = true;
                        break;
                    }
                }

                if (!isFound) {
                    res.status(HTTP_STATUS.BAD_REQUEST).json({
                        statusCode: HTTP_STATUS.BAD_REQUEST,
                        message: 'An error has occurred. This is due to an invalid spouse id or a different spouse name being provided from the original record.'
                    });
                    return;
                }
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
                res.status(HTTP_STATUS.OK).json({
                    statusCode: HTTP_STATUS.OK
                });
            else
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    statusCode: HTTP_STATUS.BAD_REQUEST,
                    message: "Family member is not recorded."
                });
        } catch (e) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: 'An error has occurred when updating record, please check your request again.'
            });
        }
    } else {
        res.status(HTTP_STATUS.NOT_FOUND).json({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: 'Household record cannot be found!'
        });
    }
};

// List all households
exports.getAllHouseholds = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const households = await Household.find();

        res.status(HTTP_STATUS.OK).json({
            statusCode: HTTP_STATUS.OK,
            result: households
        });
    } catch (e) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: 'An error has occurred, please check your request again.'
        });
    }
};

// Search for a specific household
exports.findHousehold = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const household = await Household.findById(ObjectId(req.params.id));

        if (household)
            res.status(HTTP_STATUS.OK).json({
                statusCode: HTTP_STATUS.OK,
                result: household
            });
        else
            res.status(HTTP_STATUS.NOT_FOUND).json({
                statusCode: HTTP_STATUS.NOT_FOUND,
                message: 'Household not found!'
            });
    } catch (e) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
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
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    statusCode: HTTP_STATUS.NOT_FOUND,
                    message: 'Invalid argument.'
                });
                break;
        }

        res.status(HTTP_STATUS.OK).json({
            statusCode: HTTP_STATUS.OK,
            result: data
        });
    } catch (e) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: 'An error has occurred, please check your request again.'
        });
    }
}