'use strict'

const StatusCode = {
    FORBIDDEN:403,
    CONFLICT:409,
    BADREQUEST:400,
    AUTHFAILURE:401,
    NOTFOUND:404
}

const ResponseStatus={
    FORBIDDEN:"Forbidden error",
    CONFLICT:"Conflict error",
    BADREQUEST:"Bad request error",
    AUTHFAILURE:"Authenticatoin error",
    NOTFOUND:"Not found"
}

export class ErrorResponse extends Error{
    private status;
    constructor(message:string,status:number) {
        super(message);
        this.status=status
    }
}

export  class ConflictError extends ErrorResponse{
    constructor(message=ResponseStatus.CONFLICT,status = StatusCode.CONFLICT) {
        super(message,status)
    }
}

export  class ForbiddenError extends ErrorResponse{
    constructor(message=ResponseStatus.FORBIDDEN,status = StatusCode.FORBIDDEN) {
        super(message,status)
    }
}

export  class BadRequestError extends ErrorResponse{
    constructor(message=ResponseStatus.BADREQUEST,status = StatusCode.BADREQUEST) {
        super(message,status)
    }
}

export  class AuthFailureError extends ErrorResponse{
    constructor(message=ResponseStatus.AUTHFAILURE,status = StatusCode.AUTHFAILURE) {
        super(message,status)
    }
}

export  class NotFound extends ErrorResponse{
    constructor(message=ResponseStatus.NOTFOUND,status = StatusCode.NOTFOUND) {
        super(message,status)
    }
}