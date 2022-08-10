"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPostal = exports.isValidUnit = exports.isValidHousingType = void 0;
function isValidHousingType(housingType) {
    return ['Landed', 'Condominium', 'HDB'].includes(housingType.toString());
}
exports.isValidHousingType = isValidHousingType;
function isValidUnit(unit) {
    const regex = new RegExp('^[0-9]{2}-[0-9]{2,4}$');
    return regex.test(unit.toString());
}
exports.isValidUnit = isValidUnit;
function isValidPostal(postal) {
    const regex = new RegExp('^[0-9]{6}$');
    return regex.test(postal.toString());
}
exports.isValidPostal = isValidPostal;
