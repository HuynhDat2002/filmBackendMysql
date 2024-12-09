'use strict'
import { Request, Response, NextFunction } from 'express'
// import rbac from './role.middleware'
import { roleList } from "@/services/rbac.service"
import { errorResponse } from '@/cores'
import { AccessControl } from "accesscontrol"

// const rbac = new AccessControl()
export const grantAccess = async (action: string, resource: string, role: string) => {

    try {
        const rl = [
            { role: 'ADMIN', resource: 'film', action: 'create:any', attributes: '*' },
            { role: 'ADMIN', resource: 'film', action: 'update:any', attributes: '*' },
            { role: 'ADMIN', resource: 'film', action: 'delete:any', attributes: '*' },
            { role: 'ADMIN', resource: 'film', action: 'read:any', attributes: '*' },
            { role: 'ADMIN', resource: 'user', action: 'delete:any', attributes: '*' },
            { role: 'ADMIN', resource: 'user', action: 'read:any', attributes: '*' },
            { role: 'ADMIN', resource: 'admin', action: 'read:own', attributes: '*' },
            { role: 'ADMIN', resource: 'admin', action: 'update:own', attributes: '*' },
            { role: 'ADMIN', resource: 'comment', action: 'create:any', attributes: '*' },
            { role: 'ADMIN', resource: 'comment', action: 'update:any', attributes: '*' },
            { role: 'ADMIN', resource: 'comment', action: 'delete:any', attributes: '*' },
            { role: 'ADMIN', resource: 'comment', action: 'read:any', attributes: '*' },
            { role: 'USER', resource: 'film', action: 'read:any', attributes: '*' },
            { role: 'USER', resource: 'user', action: 'read:own', attributes: '*' },
            { role: 'USER', resource: 'user', action: 'delete:own', attributes: '*' },
            { role: 'USER', resource: 'user', action: 'create:own', attributes: '*' },
            { role: 'USER', resource: 'user', action: 'update:own', attributes: '*' },
            { role: 'USER', resource: 'comment', action: 'delete:own', attributes: '*' },
            { role: 'USER', resource: 'comment', action: 'create:own', attributes: '*' },
            { role: 'USER', resource: 'comment', action: 'update:own', attributes: '*' },
            { role: 'USER', resource: 'comment', action: 'read:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'comment', action: 'create:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'comment', action: 'update:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'comment', action: 'delete:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'comment', action: 'read:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'film', action: 'create:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'film', action: 'update:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'film', action: 'delete:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'film', action: 'read:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'user', action: 'create:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'user', action: 'update:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'user', action: 'delete:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'user', action: 'read:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'admin', action: 'create:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'admin', action: 'update:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'admin', action: 'delete:any', attributes: '*' },
            { role: 'SUPERVISOR', resource: 'admin', action: 'read:any', attributes: '*' }
        ]
        // const rl = await roleList({})
        console.log('action', action)
        console.log('resource', resource)
        console.log('role', role)
        // console.log('rll', rl)
        const rbac = new AccessControl();
        rbac.setGrants(rl)
     
        // const rol_name = role
        const permission = (rbac.can(role) as any)[action](resource)
        console.log('permission', permission)
        if (!permission.granted) throw new errorResponse.AuthFailureError("You dont have permission to do this")
        return true
    }
    catch (error) {
        return false
    }

}

