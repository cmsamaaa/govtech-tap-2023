import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../constants/http_status";

exports.get404 = (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Invalid API endpoint.',
    });
};
