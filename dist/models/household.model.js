"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidHouseholdType = void 0;
function isValidHouseholdType(householdType) {
    return ['Landed', 'Condominium', 'HDB'].includes(householdType.toString());
}
exports.isValidHouseholdType = isValidHouseholdType;
