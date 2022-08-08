"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDOB = exports.isValidDecimal = exports.isValidOccupationType = exports.isValidMaritalStatus = exports.isValidGender = void 0;
function isValidGender(gender) {
    return ['Male', 'Female', 'Non-binary'].includes(gender.toString());
}
exports.isValidGender = isValidGender;
function isValidMaritalStatus(maritalStatus) {
    return ['Single', 'Married', 'Divorced'].includes(maritalStatus.toString());
}
exports.isValidMaritalStatus = isValidMaritalStatus;
function isValidOccupationType(occupationType) {
    return ['Unemployed', 'Student', 'Employed'].includes(occupationType.toString());
}
exports.isValidOccupationType = isValidOccupationType;
function isValidDecimal(value) {
    return !!Number(value) || value === 0;
}
exports.isValidDecimal = isValidDecimal;
function isValidDOB(day, month, year) {
    const regex = new RegExp('^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])$');
    return regex.test(`${year}-${month}-${day}`);
}
exports.isValidDOB = isValidDOB;
