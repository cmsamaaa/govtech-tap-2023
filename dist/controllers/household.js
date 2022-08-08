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
const Household = require('../models/household.schema');
const FamilyMember = require('../models/familyMember.schema');
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
})(StatusCode || (StatusCode = {}));
// Creates a household record
exports.createHousehold = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    if (!(0, household_model_1.isValidHouseholdType)(req.body.householdType))
        errMsg += "housing type, ";
    if (!req.body.street)
        errMsg += "street, ";
    if (!(0, household_model_1.isValidUnit)(req.body.unit))
        errMsg += "unit, ";
    if (!(0, household_model_1.isValidPostal)(req.body.postal))
        errMsg += "postal, ";
    if (errMsg !== "Invalid field(s): ") {
        res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: `${errMsg.slice(0, errMsg.length - 2)}.`
        });
        return;
    }
    const householdObj = {
        householdType: req.body.householdType,
        street: req.body.street,
        unit: req.body.unit,
        postal: req.body.postal
    };
    const household = new Household(householdObj);
    try {
        const result = yield household.save();
        res.status(StatusCode.CREATED).json({
            statusCode: StatusCode.CREATED,
            message: 'Household added successfully',
            _id: result._id
        });
    }
    catch (e) {
        res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
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
        res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: 'Request body empty. Ensure request is submitted in JSON format.'
        });
        return;
    }
    let errMsg = "Invalid field(s): ";
    if (!(0, familyMember_model_1.isValidGender)(req.body.gender))
        errMsg += "gender, ";
    if (!(0, familyMember_model_1.isValidMaritalStatus)(req.body.maritalStatus))
        errMsg += "marital status, ";
    if (!(0, familyMember_model_1.isValidOccupationType)(req.body.occupationType))
        errMsg += "occupation type, ";
    if (!(0, familyMember_model_1.isValidDecimal)(req.body.annualIncome))
        errMsg += "annual income, ";
    if (!(0, familyMember_model_1.isValidDOB)(req.body.DOB_day, req.body.DOB_month, req.body.DOB_year))
        errMsg += "DOB, ";
    if (errMsg !== "Invalid field(s): ") {
        res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
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
        res.status(StatusCode.NOT_FOUND).json({
            statusCode: StatusCode.NOT_FOUND,
            message: 'An error has occurred when retrieving household record, please check your request again.'
        });
    }
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
        try {
            const result = yield household.updateOne(household);
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
        }
        catch (e) {
            res.status(StatusCode.BAD_REQUEST).json({
                statusCode: StatusCode.BAD_REQUEST,
                message: 'An error has occurred when updating record, please check your request again.'
            });
        }
    }
    else {
        res.status(StatusCode.NOT_FOUND).json({
            statusCode: StatusCode.NOT_FOUND,
            message: 'Household record cannot be found!'
        });
    }
});
// List all households
exports.getAllHouseholds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const households = yield Household.find()
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
        });
        res.status(StatusCode.OK).json({
            statusCode: StatusCode.OK,
            result: households
        });
    }
    catch (e) {
        res.status(StatusCode.NOT_FOUND).json({
            statusCode: StatusCode.NOT_FOUND,
            message: 'An error has occurred, please check your request again.'
        });
    }
});
// Search for a specific household
exports.findHousehold = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const household = yield Household.findById(ObjectId(req.params.id))
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
            res.status(StatusCode.OK).json({
                statusCode: StatusCode.OK,
                result: household
            });
        else
            res.status(StatusCode.NOT_FOUND).json({
                statusCode: StatusCode.NOT_FOUND,
                message: 'Household not found!'
            });
    }
    catch (e) {
        res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
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
    }
    catch (e) {
        res.status(StatusCode.BAD_REQUEST).json({
            statusCode: StatusCode.BAD_REQUEST,
            message: 'An error has occurred, please check your request again.'
        });
    }
});
