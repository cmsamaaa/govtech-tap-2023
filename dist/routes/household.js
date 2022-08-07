"use strict";
const express = require('express');
const householdController = require('../controllers/household');
const router = express.Router();
router.get('/', householdController.getAllHouseholds);
router.get('/find/:id', householdController.findHousehold);
router.post('/create', householdController.createHousehold);
router.patch('/add-member/:id', householdController.addFamilyMember);
module.exports = router;
