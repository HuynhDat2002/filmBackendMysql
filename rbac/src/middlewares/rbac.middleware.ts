'use strict'
import {Request,Response,NextFunction} from 'express'
// import rbac from './role.middleware'
import {roleList} from "@/services/rbac.service"
import { errorResponse } from '@/cores'
import { AccessControl } from "accesscontrol"

const rbac = new AccessControl()
export const grantAccess =async (action:string,resource:string,role:string)=>{
    
        try{
            const rl = await roleList({})
            console.log('rll',rl)
            rbac.setGrants(rl)
            const rol_name = role
            const permission = (rbac.can(rol_name) as any)[action](resource)
            if(!permission.granted) throw new errorResponse.AuthFailureError("You dont have permission to do this")
            return true
        }
        catch (error){
            return false
        }
    
}

