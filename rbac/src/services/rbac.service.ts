'use strict'
import 'dotenv/config'
import { prisma } from '@/db/prisma.init'
import { errorResponse } from "@/cores"

/**
 * new resource
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 */

export const createResource = async ({
    name = 'profile',
    slug = 'p01',
    description = ''
}) => {

    //1. check if name or slug exists
    const resourceFound = await prisma.resource.findUnique({where:{src_name:name}})
    if(resourceFound) throw new errorResponse.ForbiddenError('This resource have already existed')
    //2. if not, create new resource
    const resource = await prisma.resource.create({
        data: {
            src_name: name,
            src_slug: slug,
            src_description: description
        }
    }
    )
    return resource

}

export const resourceList = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = ''
}) => {
    //1. check admin ?

    // 2. get list of resource
    const resource = await prisma.resource.findMany()
    const resources = resource.map(r => ({
        name: r.src_name,
        slug: r.src_slug,
        description: r.src_description,
        resourceId: r.id,
        createdAt: r.createdAt
    }))
    // const resources = await resourceModel.aggregate([{
    //     $project: {
    //         _id: 0,
    //         name: '$src_name',
    //         slug: '$src_slug',
    //         description: '$src_description',
    //         resourceId: '$_id',
    //         createdAd: 1

    //     }
    // }])
    if (!resource) throw new errorResponse.NotFound('Cannot find any resource')
    console.log('resources', resources)
    return resources
}
export const createRole = async ({
    name = 'shop',
    slug = 's01',
    description = '',
    
}) => {
    try {
        //1. check role exits
        const roleFound = await prisma.roleRBAC.findUnique({where:{rol_name:name}})
        if(roleFound) throw new errorResponse.ForbiddenError('This role have already existed')
        //2. create new role
        const role = await prisma.roleRBAC.create({
            data: {
                rol_name: name,
                rol_slug: slug,
                rol_description: description,
            },
            select: {
                id: true,
                rol_name: true,
                rol_slug: true,
                rol_status: true,
                rol_description: true,
                rol_grants: {
                    select: {
                        id: true,
                        resource: true,
                        actions: true,
                        attributes: true
                    }
                }
            }
        },
        )
        // const grant = await prisma.grant.create({

        // })
        if (!role) throw new errorResponse.BadRequestError('Cannot create new role')

        return role
    }
    catch (error) {
        throw error
    }
}

export const createGrant = async ({
        roleId="id",
        resourceId= "id",
        actions= [""],
        attributes= ""
}) => {
    try {
        //1. check role exitss
        const grantFound = await prisma.grant.findFirst({where:
            {
                roleId:roleId,
                resourceId:resourceId,
            }})
            console.log('grantfound',grantFound)
        if(grantFound!==null){
          await prisma.grant.delete({where:{id:grantFound.id}})
        }
        //2. create new role
        const grant = await prisma.grant.create({
            data: {  
                resource:{
                    connect:{
                        id:resourceId
                    }
                },  
                actions:{
                    create:actions.map(ac=>({
                        action: {
                            connectOrCreate:{
                                where:{
                                    action:ac
                                },
                                create:{
                                    action:ac
                                }
                            }
                        }
                    }))
                },           
                attributes:attributes,
                role:{
                    connect:{
                        id:roleId
                    }
                }   
            },
            select:{
                id:true,
                resourceId:true,
                actions:{
                    select:{
                        action:{
                            select:{
                                action:true
                            }
                        },
                        grantId:true
                    }
                },
                attributes:true,
                roleId:true
            }
            
        })
        // const grant = await prisma.grant.create({

        // })
        if (!grant) throw new errorResponse.BadRequestError('Cannot create new role')

        return grant
    }
    catch (error) {
        throw error
    }
}

export const roleList = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = ''
}) => {
    //1. user Id

    //2. list role
    // const roleList = await roleModel.aggregate([
    //     {
    //         $unwind: '$rol_grants'
    //     },
    //     {
    //         $lookup: {
    //             from: 'resources',
    //             localField: 'rol_grants.resource',
    //             foreignField: '_id',
    //             as: "resource"
    //         }
    //     },
    //     {
    //         $unwind: '$resource'
    //     },
    //     {
    //         $project: {
    //             role: "$rol_name",
    //             resource: "$resource.src_name",
    //             action: "$rol_grants.actions",
    //             attributes: "$rol_grants.attributes"
    //         }
    //     },
    //     {
    //         $unwind: '$action'

    //     }, {
    //         $project: {

    //             role: 1,
    //             resource: 1,
    //             action: 1,
    //             attributes: 1,
    //             _id: 0
    //         }
    //     }
    // ])
    const roleList = await prisma.roleRBAC.findMany({
        select: {
            rol_name: true,
            rol_slug: true,
            rol_status: true,
            rol_description: true,
            rol_grants: {
                select: {
                    id: true,
                    resource: true,
                    actions: {
                        select:{
                            action:true
                        }
                    },
                    attributes: true
                }
            }
        }
    })
    console.log('rolelist',roleList)
    const roleList2 = roleList.flatMap(r => {
        return r.rol_grants.flatMap(grant => {
            return grant.actions.flatMap(a => ({
                role: r.rol_name,
                resource: grant.resource.src_name,
                action: a.action.action,
                attributes: grant.attributes
            }))
        })
    })
    return roleList2
}