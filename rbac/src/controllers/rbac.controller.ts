'use strict'

import { successResponse } from "@/cores"
import { Request, Response, NextFunction } from "express";
import { rbacService } from "@/services";
export const newRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    new successResponse.Created({
        message: "create role",
        metadata: await rbacService.createRole(req.body)
    }).send(res)

}

export const newGrant = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    new successResponse.Created({
        message: "create grant",
        metadata: await rbacService.createGrant(req.body)
    }).send(res)

}

export const newResource = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    new successResponse.Created({
        message: "create resource",
        metadata: await rbacService.createResource(req.body)
    }).send(res)

}

export const listRoles = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    new successResponse.SuccessResonse({
        message: "get list role",
        metadata:await rbacService.roleList(req.query)
    }).send(res)

}

export const listResources = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    new successResponse.Created({
        message: "get list resource",
        metadata: await rbacService.resourceList(req.query)
    }).send(res)

}