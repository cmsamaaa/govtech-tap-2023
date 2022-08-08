"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPostal = exports.isValidUnit = exports.isValidHouseholdType = void 0;
function isValidHouseholdType(householdType) {
    return ['Landed', 'Condominium', 'HDB'].includes(householdType.toString());
}
exports.isValidHouseholdType = isValidHouseholdType;
function isValidUnit(unit) {
    const regex = new RegExp('^[0-9]{2}-[0-9]{2}$');
    return regex.test(unit.toString());
}
exports.isValidUnit = isValidUnit;
function isValidPostal(postal) {
    const regex = new RegExp('^[0-9]{6}$');
    return regex.test(postal.toString());
}
exports.isValidPostal = isValidPostal;
