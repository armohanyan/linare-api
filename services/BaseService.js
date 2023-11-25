const {validationResult} = require("express-validator");
module.exports = class BaseService {
    response({
                 status = true,
                 statusCode = 200,
                 data = {},
                 message = "",
                 validationError = {}
             }) {
        return {
            status,
            statusCode,
            data,
            message,
            validationError
        }
    }

    handleErrors(request) {
        const { errors } = validationResult(request);

        return {
            hasErrors: errors && errors.length,
            ...(errors && errors.length ? {
                body: {
                    success: false,
                    statusCode: 400,
                    validationError: {
                        property: errors[0].path,
                        message: errors[0].msg,
                    }
                }
            } : {})
        }
    }

    serverErrorResponse(error) {
        return {
            status: false,
            statusCode: 500,
            data: error,
            message: "Server Error",
            validationError: {}
        }
    }
};