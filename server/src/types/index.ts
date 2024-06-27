import { SuccessResonse } from './../cores/success.response';
//-----------------------CONFIGS-------------------

export interface ConfigDB{
    dev:ConfigEnvironment,
    [key:string]:ConfigEnvironment
}

export interface ConfigEnvironment{
    app:{port:number},
    db:{host:string,name:string}
  
}

export interface SuccessResonseProps{
    message?:string,
    metadata?:any,
    statusCode?:number,
    responseStatusCode?:string,
}