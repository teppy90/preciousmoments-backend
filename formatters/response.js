const { response } = require("express")
const { StatusCodes } = require("http-status-codes")
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes

function isValidationError(err) {
    return err.constructor.name === "ValidationError"
}
module.exports = { 
   formatErrorResponse(res,err, customMessage){
        const status= isValidationError(err) ? BAD_REQUEST : INTERNAL_SERVER_ERROR  
        res.status(status)
            .json({
                status, 
                message : customMessage || err.message
            })
   }
}