import { Request, Response, NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import { IHousehold } from "../models/household.model";
import { IFamilyMember } from "../models/familyMember.model";

const ObjectId = require('mongoose').Types.ObjectId;

const Household = require('../models/household.schema');
const FamilyMember = require('../models/familyMember.schema');

// Retrieves all household records
exports.getAllHouseholds = (req: Request, res: Response, next: NextFunction) => {
    Household.find().then((results: [HydratedDocument<IHousehold>]) => {
        const households: [IHousehold] = [new Household()];
        households.shift();
        for (let i = 0; i < results.length; i++) {
            const householdObj: IHousehold = {
                _id: results[i]._id,
                householdType: results[i].householdType,
                familyMembers: results[i].familyMembers
            };
            households.push(householdObj);
        }
        res.json(households);
    })
    .catch((err: any) => {
        console.log(err);
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
        .then((result: HydratedDocument<IHousehold>) => {
            const householdObj: IHousehold = {
                _id: result._id,
                householdType: result.householdType,
                familyMembers: result.familyMembers
            };
            res.json(householdObj);
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
        res.status(400).json({
            message: 'Request body empty. Ensure data is submitted in JSON format.'
        });
        return;
    }

    const householdObj: IHousehold = {
        householdType: req.body.householdType,
        street: req.body.street,
        unit: req.body.unit,
        postal: req.body.postal
    };

    const household: HydratedDocument<IHousehold> = new Household(householdObj);
    household.save().then((result: any) => {
        res.status(201).json({
            message: 'Household added successfully',
            householdId: result._id
        });
    })
    .catch((err: any) => {
        console.log(err);
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