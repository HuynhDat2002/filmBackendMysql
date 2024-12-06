'use strict'
import { SuccessResonseProps } from "@/types"
import { Response } from "express"
const StatusCode={
    OK:200,
    CREATED:201
}

const ResponseStatusCode ={
    OK:"Success",
    CREATED:"Created"
}
export class SuccessResonse{
    private message
    private status
    private metadata
    constructor({message,metadata={},statusCode=StatusCode.OK,responseStatusCode=ResponseStatusCode.OK}:SuccessResonseProps){
        this.message = message ? message : responseStatusCode
        this.status = statusCode
        this.metadata=metadata
    }
    send(res:Response,headers:Object={}){
        return res.status(this.status).json(this)
    }
}


export class Created extends SuccessResonse{
    constructor({message,metadata={},statusCode=StatusCode.CREATED,responseStatusCode=ResponseStatusCode.CREATED}:SuccessResonseProps){
        super({message,metadata,statusCode,responseStatusCode})
    }
}