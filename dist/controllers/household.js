"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const household_model_1 = require("../models/household.model");
const familyMember_model_1 = require("../models/familyMember.model");
const ObjectId = require('mongoose').Types.ObjectId;
const Household = require('../models/household.schema');
const FamilyMember = require('../models/familyMember.schema');
// Retrieves all household records
exports.getAllHouseholds = (req, res, next) => {
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
    })
        .then((households) => {
        if (households)
            res.status(200).json(households);
        else
            res.status(404).json({ message: 'Household not found!' });
    })
        .catch((err) => {
        res.json({ message: err });
    });
};
// Retrieves a household records by ID
exports.findHousehold = (req, res, next) => {
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
        .then((household) => {
        if (household)
            res.status(200).json(household);
        else
            res.status(404).json({ message: 'Household not found!' });
    })
        .catch((err) => {
        res.json({ message: err });
    });
};
// Creates a household record
exports.createHousehold = (req, res, next) => {
    /* This is a check to ensure that the request body is not empty.
    If it is empty, it will return a 400 error. */
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ message: 'Request body empty. Ensure data is submitted in JSON format.' });
        return;
    }
    if (!(0, household_model_1.isValidHouseholdType)(req.body.householdType)) {
        res.status(400).json({ message: 'Invalid household type.' });
        return;
    }
    const householdObj = {
        householdType: req.body.householdType,
        street: req.body.street,
        unit: req.body.unit,
        postal: req.body.postal
    };
    const household = new Household(householdObj);
    household.save()
        .then((result) => {
        res.status(201).json({
            message: 'Household added successfully',
            householdId: result._id
        });
    })
        .catch((err) => {
        res.status(400).json({ message: err });
    });
};
// Add a family member into household record
exports.addFamilyMember = (req, res, next) => {
    var _a;
    /* This is a check to ensure that the request body is not empty.
    If it is empty, it will return a 400 error. */
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({
            message: 'Request body empty. Ensure data is submitted in JSON format.'
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
        res.status(400).json({ message: `${errMsg.slice(0, errMsg.length - 2)}.` });
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
    Household.findById(ObjectId(req.params.id)).then((households) => {
        if (households) {
            let familyMembers = households.get('familyMembers');
            familyMembers.push(new FamilyMember(familyMemberObj));
            const household = new Household({
                _id: req.params.id,
                householdType: households.get('householdType'),
                street: households.get('street'),
                unit: households.get('unit'),
                postal: households.get('postal'),
                familyMembers: familyMembers
            });
            household.updateOne(household)
                .then((result) => {
                if (result.modifiedCount > 0)
                    res.status(200).json({ message: `${req.body.name} has been added to the household!` });
                else
                    res.status(400).json({ message: "Family member is not recorded." });
            })
                .catch((err) => {
                res.status(404).json({ message: err });
            });
        }
        else {
            res.status(404).json({ message: 'Household not found!' });
        }
    });
};
