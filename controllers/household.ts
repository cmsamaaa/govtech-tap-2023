import {Request, Response, NextFunction} from "express";
import {IHousehold} from "../models/household.model";

const Household = require('../models/household.schema');

exports.getAllHouseholds = (req: Request, res: Response, next: NextFunction) => {
    Household.find()
        .then((households: any) => {
            res.send(households);
        })
        .catch((err: any) => {
            console.log(err);
        });
};

exports.createHousehold = (req: Request, res: Response, next: NextFunction) => {
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

    const household = new Household(householdObj);
    household.save()
        .then((result: any) => {
            res.status(201).json({
                message: 'Household added successfully',
                householdId: result._id
            });
        })
        .catch((err: any) => {
            console.log(err);
        });
};