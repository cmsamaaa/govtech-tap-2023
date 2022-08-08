const express = require('express');

const householdController = require('../controllers/household');

const router = express.Router();

router.get('/all', householdController.getAllHouseholds);
router.get('/find/:id', householdController.findHousehold);
router.get('/find-qualifying/:option', householdController.findQualifyingHouseholds);
router.post('/create', householdController.createHousehold);
router.put('/add-member/:id', householdController.addFamilyMember);

module.exports = router;