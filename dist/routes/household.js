"use strict";
const express = require('express');
const householdController = require('../controllers/household');
const router = express.Router();
router.post('/create', householdController.createHousehold);
module.exports = router;
