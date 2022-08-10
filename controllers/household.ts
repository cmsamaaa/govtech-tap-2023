import {NextFunction, Request, Response} from "express";
import {IHousehold, isValidHousingType, isValidPostal, isValidUnit} from "../models/household.model";
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
            _id: null,
            message: 'Request body empty. Ensure request is submitted in JSON format.'
        });
        return;
    }

    if (!req.body.housingType || !req.body.address || !req.body.unit || !req.body.postal) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            _id: null,
            message: 'Invalid body.'
        });
        return;
    }

    let errMsg = "Invalid field(s): ";
    if (!isValidHousingType(req.body.housingType))
        errMsg += "housing type, ";
    if (!isValidUnit(req.body.unit))
        errMsg += "unit, ";
    if (!isValidPostal(req.body.postal))
        errMsg += "postal, ";
    if (errMsg !== "Invalid field(s): ") {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            _id: null,
            message: `${errMsg.slice(0, errMsg.length - 2)}.`
        });
        return;
    }

    if (req.body.housingType === "Landed" && req.body.unit !== "01-01") {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            _id: null,
            message: 'Invalid unit number for \'Landed\' housingType. Refer to API documentations for more details.'
        });
        return;
    }

    const householdObj: IHousehold = {
        housingType: req.body.housingType,
        address: req.body.address,
        unit: req.body.unit,
        postal: req.body.postal
    };

    const household = new Household(householdObj);

    try {
        const result = await household.save();
        res.status(HTTP_STATUS.CREATED).json({
            statusCode: HTTP_STATUS.CREATED,
            _id: result._id,
            message: 'Household added successfully.'
        });
    } catch (e) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            _id: null,
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

    if (!req.body.name || !req.body.gender || !req.body.maritalStatus || !req.body.occupationType ||
        (!req.body.annualIncome && req.body.annualIncome !== 0) || !req.body.DOB_day || !req.body.DOB_month || !req.body.DOB_year) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            _id: null,
            message: 'Invalid body.'
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
            _id: null,
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
        return;
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
            housingType: householdJSON.get('housingType'),
            address: householdJSON.get('address'),
            unit: householdJSON.get('unit'),
            postal: householdJSON.get('postal'),
            familyMembers: familyMembers
        });

        try {
            const result = await household.updateOne(household);

            if (result.modifiedCount > 0)
                res.status(HTTP_STATUS.OK).json({
                    statusCode: HTTP_STATUS.OK,
                    message: "Family member was added to household."
                });
            else {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    statusCode: HTTP_STATUS.BAD_REQUEST,
                    message: "Family member was not added to household."
                });
            }

        } catch (e) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: 'An error has occurred when updating record, please check your request again.'
            });
            return;
        }
    } else {
        res.status(HTTP_STATUS.NOT_FOUND).json({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: 'Household record cannot be found.'
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
            result: null,
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
                result: null,
                message: 'Household not found.'
            });
    } catch (e) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            result: null,
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
                    result: null,
                    message: 'Invalid option or argument.'
                });
                return;
        }

        res.status(HTTP_STATUS.OK).json({
            statusCode: HTTP_STATUS.OK,
            result: data
        });
    } catch (e) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            result: null,
            message: 'An error has occurred, please check your request again.'
        });
    }
}