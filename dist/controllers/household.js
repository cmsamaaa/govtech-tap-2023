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
const household_model_1 = require("../models/household.model");
const familyMember_model_1 = require("../models/familyMember.model");
const ObjectId = require('mongoose').Types.ObjectId;
const http_status_1 = require("../constants/http_status");
const Household = require('../models/household.schema');
const FamilyMember = require('../models/familyMember.schema');
// Creates a household record
exports.createHousehold = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /* This is a check to ensure that the request body is not empty.
    If it is empty, it will return a 400 error. */
    if (Object.keys(req.body).length === 0) {
        res.status(http_status_1.HTTP_STATUS.BAD_REQUEST).json({
            statusCode: http_status_1.HTTP_STATUS.BAD_REQUEST,
            message: 'Request body empty. Ensure request is submitted in JSON format.'
        });
        return;
    }
    if (!req.body.housingType || !req.body.address || !req.body.unit || !req.body.postal) {
        res.status(http_status_1.HTTP_STATUS.BAD_REQUEST).json({
            statusCode: http_status_1.HTTP_STATUS.BAD_REQUEST,
            _id: null,
            message: 'Invalid body.'
        });
        return;
    }
    let errMsg = "Invalid field(s): ";
    if (!(0, household_model_1.isValidHousingType)(req.body.housingType))
        errMsg += "housing type, ";
    if (!req.body.address)
        errMsg += "address, ";
    if (!(0, household_model_1.isValidUnit)(req.body.unit))
        errMsg += "unit, ";
    if (!(0, household_model_1.isValidPostal)(req.body.postal))
        errMsg += "postal, ";
    if (errMsg !== "Invalid field(s): ") {
        res.status(http_status_1.HTTP_STATUS.BAD_REQUEST).json({
            statusCode: http_status_1.HTTP_STATUS.BAD_REQUEST,
            _id: null,
            message: `${errMsg.slice(0, errMsg.length - 2)}.`
        });
        return;
    }
    if (req.body.housingType === "Landed" && req.body.unit !== "01-01") {
        res.status(http_status_1.HTTP_STATUS.BAD_REQUEST).json({
            statusCode: http_status_1.HTTP_STATUS.BAD_REQUEST,
            message: 'Invalid unit number for \'Landed\' householdType. Refer to API documentations for more details.'
            message: 'Invalid unit number for \'Landed\' housingType. Refer to API documentations for more details.'
        });
        return;
    }
    const householdObj = {
        housingType: req.body.housingType,
        address: req.body.address,
        unit: req.body.unit,
        postal: req.body.postal
    };
    const household = new Household(householdObj);
    try {
        const result = yield household.save();
        res.status(http_status_1.HTTP_STATUS.CREATED).json({
            statusCode: http_status_1.HTTP_STATUS.CREATED,
            _id: result._id,
            message: 'Household added successfully.'
        });
    }
    catch (e) {
        res.status(http_status_1.HTTP_STATUS.BAD_REQUEST).json({
            statusCode: http_status_1.HTTP_STATUS.BAD_REQUEST,
            _id: null,
            message: 'Fail to create household record, please check your request again.'
        });
    }
});
// Add a family member to household
exports.addFamilyMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    /* This is a check to ensure that the request body is not empty.
    If it is empty, it will return a 400 error. */
    if (Object.keys(req.body).length === 0) {
        res.status(http_status_1.HTTP_STATUS.BAD_REQUEST).json({
            statusCode: http_status_1.HTTP_STATUS.BAD_REQUEST,
            message: 'Request body empty. Ensure request is submitted in JSON format.'
        });
        return;
    }
    if (!req.body.name || !req.body.gender || !req.body.maritalStatus || !req.body.occupationType ||
        (!req.body.annualIncome && req.body.annualIncome !== 0) || !req.body.DOB_day || !req.body.DOB_month || !req.body.DOB_year) {
        res.status(http_status_1.HTTP_STATUS.BAD_REQUEST).json({
            statusCode: http_status_1.HTTP_STATUS.BAD_REQUEST,
            _id: null,
            message: 'Invalid body.'
        });
        return;
    }
    let errMsg = "Invalid field(s): ";
    if (!(0, familyMember_model_1.isValidGender)(req.body.gender))
        errMsg += "gender, ";
    if (!(0, familyMember_model_1.isValidMaritalStatus)(req.body.maritalStatus))
        errMsg += "marital status, ";
    if (req.body.maritalStatus === "Married" && req.body.maritalStatus && !req.body.spouse)
        errMsg += "spouse, ";
    if (!(0, familyMember_model_1.isValidOccupationType)(req.body.occupationType))
        errMsg += "occupation type, ";
    if (!(0, familyMember_model_1.isValidDecimal)(req.body.annualIncome))
        errMsg += "annual income, ";
    if (!(0, familyMember_model_1.isValidDOB)(req.body.DOB_day, req.body.DOB_month, req.body.DOB_year))
        errMsg += "DOB, ";
    if (errMsg !== "Invalid field(s): ") {
        res.status(http_status_1.HTTP_STATUS.BAD_REQUEST).json({
            statusCode: http_status_1.HTTP_STATUS.BAD_REQUEST,
            _id: null,
            message: `${errMsg.slice(0, errMsg.length - 2)}.`
        });
        return;
    }
    const familyMemberObj = {
        name: req.body.name,
        gender: req.body.gender,
        maritalStatus: req.body.maritalStatus,
        spouse: (_a = req.body) === null || _a === void 0 ? void 0 : _a.spouse,
        occupationType: req.body.occupationType,
        annualIncome: req.body.annualIncome,
        DOB: new Date(`${req.body.DOB_year}-${req.body.DOB_month}-${req.body.DOB_day}`)
    };
    let householdJSON;
    try {
        householdJSON = yield Household.findById(ObjectId(req.params.id));
    }
    catch (e) {
        res.status(http_status_1.HTTP_STATUS.BAD_REQUEST).json({
            statusCode: http_status_1.HTTP_STATUS.BAD_REQUEST,
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
                    res.status(http_status_1.HTTP_STATUS.BAD_REQUEST).json({
                        statusCode: http_status_1.HTTP_STATUS.BAD_REQUEST,
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
            const result = yield household.updateOne(household);
            if (result.modifiedCount > 0)
                res.status(http_status_1.HTTP_STATUS.OK).json({
                    statusCode: http_status_1.HTTP_STATUS.OK,
                    message: "Family member was added to household."
                });
            else {
                res.status(http_status_1.HTTP_STATUS.BAD_REQUEST).json({
                    statusCode: http_status_1.HTTP_STATUS.BAD_REQUEST,
                    message: "Family member was not added to household."
                });
            }
        }
        catch (e) {
            res.status(http_status_1.HTTP_STATUS.BAD_REQUEST).json({
                statusCode: http_status_1.HTTP_STATUS.BAD_REQUEST,
                message: 'An error has occurred when updating record, please check your request again.'
            });
            return;
        }
    }
    else {
        res.status(http_status_1.HTTP_STATUS.NOT_FOUND).json({
            statusCode: http_status_1.HTTP_STATUS.NOT_FOUND,
            message: 'Household record cannot be found.'
        });
    }
});
// List all households
exports.getAllHouseholds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const households = yield Household.find();
        res.status(http_status_1.HTTP_STATUS.OK).json({
            statusCode: http_status_1.HTTP_STATUS.OK,
            result: households
        });
    }
    catch (e) {
        res.status(http_status_1.HTTP_STATUS.NOT_FOUND).json({
            statusCode: http_status_1.HTTP_STATUS.NOT_FOUND,
            result: null,
            message: 'An error has occurred, please check your request again.'
        });
    }
});
// Search for a specific household
exports.findHousehold = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const household = yield Household.findById(ObjectId(req.params.id));
        if (household)
            res.status(http_status_1.HTTP_STATUS.OK).json({
                statusCode: http_status_1.HTTP_STATUS.OK,
                result: household
            });
        else
            res.status(http_status_1.HTTP_STATUS.NOT_FOUND).json({
                statusCode: http_status_1.HTTP_STATUS.NOT_FOUND,
                result: null,
                message: 'Household not found.'
            });
    }
    catch (e) {
        res.status(http_status_1.HTTP_STATUS.BAD_REQUEST).json({
            statusCode: http_status_1.HTTP_STATUS.BAD_REQUEST,
            result: null,
            message: 'An error has occurred, please check your request again.'
        });
    }
});
// List the households and qualifying members of grant disbursement
exports.findQualifyingHouseholds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data;
        switch (req.params.option) {
            case "0":
                data = yield Household.studentEncouragementBonus();
                break;
            case "1":
                data = yield Household.multiGenerationScheme();
                break;
            case "2":
                data = yield Household.elderBonus();
                break;
            case "3":
                data = yield Household.babySunshineGrant();
                break;
            case "4":
                data = yield Household.yoloGstGrant();
                break;
            default:
                res.status(http_status_1.HTTP_STATUS.NOT_FOUND).json({
                    statusCode: http_status_1.HTTP_STATUS.NOT_FOUND,
                    result: null,
                    message: 'Invalid option or argument.'
                });
                return;
        }
        res.status(http_status_1.HTTP_STATUS.OK).json({
            statusCode: http_status_1.HTTP_STATUS.OK,
            result: data
        });
    }
    catch (e) {
        res.status(http_status_1.HTTP_STATUS.BAD_REQUEST).json({
            statusCode: http_status_1.HTTP_STATUS.BAD_REQUEST,
            result: null,
            message: 'An error has occurred, please check your request again.'
        });
    }
});
