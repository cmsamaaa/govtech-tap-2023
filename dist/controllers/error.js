"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("../constants/http_status");
exports.get404 = (req, res, next) => {
    res.status(http_status_1.HTTP_STATUS.NOT_FOUND).json({
        statusCode: http_status_1.HTTP_STATUS.NOT_FOUND,
        result: null,
        message: 'Invalid API endpoint.',
    });
};
