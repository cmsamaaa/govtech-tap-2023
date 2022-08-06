"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectId = require('mongoose').Types.ObjectId;
const Household = require('../models/household.schema');
const FamilyMember = require('../models/familyMember.schema');
// Retrieves all household records
exports.getAllHouseholds = (req, res, next) => {
    Household.find()
        .then((households) => {
        res.send(households);
    })
        .catch((err) => {
        console.log(err);
    });
};
// Creates a household record
exports.createHousehold = (req, res, next) => {
    /* This is a check to ensure that the request body is not empty.
    If it is empty, it will return a 400 error. */
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({
            message: 'Request body empty. Ensure data is submitted in JSON format.'
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
    household.save()
        .then((result) => {
        res.status(201).json({
            message: 'Household added successfully',
            householdId: result._id
        });
    })
        .catch((err) => {
        console.log(err);
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
