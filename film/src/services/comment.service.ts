"use strict";

/*
1. add comment [user/shop]
2. get a list of comments [user/shop]
3. delete a comment [user/shop/admin]
*/

import { CreateCommentProps } from "@/types";
import * as errorResponse from "@/cores/error.response";
import * as regex from "@/middlewares/regex";
import DOMPurify from "isomorphic-dompurify";
import { prisma } from "@/db/prisma.init";
import { CommentService } from "@/types";
export const createComment = async ({
    filmId,
    user,
    content,
    parentCommentId,
}: CreateCommentProps) => {
    //check input
    const isValidId = await user.id.match(regex.idRegex);
    if (isValidId === null)
        throw new errorResponse.BadRequestError("User Id không hợp lệ");
    const isValidId2 = await filmId.match(regex.idRegex);
    if (isValidId2 === null)
        throw new errorResponse.BadRequestError("Film Id không hợp lệ");
    if (parentCommentId) {
        const isValidId3 = await parentCommentId.match(regex.idRegex);
        if (isValidId3 === null)
            throw new errorResponse.BadRequestError("Parent comment Id không hợp lệ");

        const parentComment = await prisma.comment.findUnique({
            where: { id: parentCommentId },
        });

        if (!parentComment)
            throw new errorResponse.NotFound("Comment parent not found");
    }

    // clean comment' content
    const cleanContent = DOMPurify.sanitize(content);

    console.log("cleanContenttt", cleanContent);
    // create new comment
    // const comment = new commentModel({
    //     comment_filmId: filmId,
    //     comment_user: {
    //         id: user.id,
    //         name: user.name,
    //         email: user.email
    //     },
    //     comment_content: cleanContent,
    //     comment_parentId: parentCommentId
    // })

    // check film exist
    const film = await prisma.film.findUnique({ where: { id: filmId } });

    // create comment
    const comment = await prisma.comment.create({
        data: {

            comment_film: {
                connect: {
                    id: filmId,
                },
            },

            comment_user: {
                create: {
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
            },
            comment_content: cleanContent,
        },
    });

    if (!comment)
        throw new errorResponse.BadRequestError(
            "Cannot create a new comment. Please check your informatin again!"
        );

    let rightValue = 1;
    if (parentCommentId) {
        //reply comment
        const parentComment = await prisma.comment.findUnique({
            where: { id: parentCommentId },
        });

        if (!parentComment)
            throw new errorResponse.NotFound("Comment parent not found");

        rightValue = parentComment.comment_right;
        const leftValue = parentComment.comment_left;
        await prisma.comment.updateMany({
            where: {
                comment_filmId: filmId ,
                comment_left: { gt: rightValue },
            },
            data: {
                comment_left: {
                    increment: 2
                }
            }

        })
        await prisma.comment.updateMany({
            where: {
                comment_filmId: filmId ,
                comment_right: { gte: rightValue },
            },
            data: {
                comment_right: {
                    increment: 2
                }
            }
        })

        await prisma.comment.update({
            where: {
                id: comment.id
            },
            data: {
                comment_parentId: parentCommentId as string
            },
            include: {
                comment_user: true
            }
        })
    } else {

        const maxRightValue = await prisma.comment.findFirst({
            where: {
               comment_filmId: filmId ,
            },
            select: {
                comment_right: true
            },
            orderBy: {
                comment_right: "desc"
            }
        })
        if (maxRightValue) {
            rightValue = maxRightValue.comment_right + 1;
        }

    }
    await prisma.comment.update({
        where: {
            id: comment.id
        },
        data: {
            comment_left: rightValue,
            comment_right: rightValue + 1
        },
        include: {
            comment_user: true
        }
    })

    return await prisma.comment.findUnique({ where: { id: comment.id } });
};

export const getCommentByParentId = async ({ filmId = "", parentCommentId = "", limit = 50, offset = 0 }) => {
    // if(parentCommentId){
    const parent = await prisma.comment.findUnique({ where: { id: parentCommentId } })
    if (!parent) throw new errorResponse.NotFound("Comment parent not found")
    const film = await prisma.film.findUnique({ where: { id: filmId } });
    if (!film) {
       throw new errorResponse.BadRequestError("Không thể tìm thấy phim này")
    }
    console.log('parent', parent)
    const comments = await prisma.comment.findMany({
        where: {
            comment_filmId: filmId ,
            comment_left: {
                gt: parent.comment_left
            },
            comment_right: {
                lt: parent.comment_right
            }
        },
        select: {
            comment_left: true,
            comment_right: true,
            comment_content: true,
            comment_parentId: true,
            comment_user: true,
            id: true,
            createdAt: true,
            updatedAt: true,
            comment_filmId: true,
        },
        orderBy: {
            comment_left: "asc"
        }

    })
    console.log('comments', comments)
    return comments
}

export const deleteComment = async ({
    userId, commentId, filmId, user
}: { userId: string, commentId: string, filmId: string, user: any }) => {

    //check input
    const isValidId = await userId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.BadRequestError('User Id không hợp lệ')
    const isValidId3 = await commentId.match(regex.idRegex)
    if (isValidId3 === null) throw new errorResponse.BadRequestError('Comment Id không hợp lệ')
    const isValidId2 = await filmId.match(regex.idRegex)
    if (isValidId2 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')

    let film = await prisma.film.findUnique({ where: { id: filmId } })
    if (!film) {
       throw new errorResponse.BadRequestError("Không thể tìm thấy phim này")
    }

    //1.xac dinh gia tri left va right
    const comment = await prisma.comment.findUnique({ where: { id: commentId }, include: { comment_user: true } })
    if (!comment) throw new errorResponse.NotFound("Comment not exists")

    // kiem tra xem day co phai la admin khong
    if (user.role === "ADMIN") {
        if (comment.comment_user.role === "SUPERVISOR") throw new errorResponse.AuthFailureError("Bạn không có quyền xóa comment này")
        if (comment.comment_user.role === "ADMIN" && comment.comment_user?.userId !== userId) throw new errorResponse.AuthFailureError("Bạn không có quyền xóa comment này")
    }
    if (user.role === "USER") {
        if (comment.comment_user?.userId !== userId) throw new errorResponse.AuthFailureError("Bạn không có quyền xóa comment này")
    }

    const leftValue = comment.comment_left
    const rightValue = comment.comment_right

    const width = rightValue - leftValue + 1
    const parentCommentId = comment.comment_parentId || null
    //2. xoa comment can xoa va cac comment con.
    const commentChild = await prisma.comment.findMany({
        where: {
            comment_left: { gte: leftValue, lte: rightValue },
            comment_filmId: filmId,

        }
    })

    const commentChildMap = await commentChild.map((comment:CommentService) => comment.comment_user_id)
    const deleteComment = await prisma.commentUser.deleteMany({
        where: {
            id: {
                in: commentChildMap
            }
        }
    })
    // const deleteCommentChild = await prisma.comment.deleteMany({
    //     where: {
    //         ...(movie ? { comment_movieId: filmId } : { comment_tvId: filmId }),
    //         comment_left: { gte: leftValue, lte: rightValue },

    //     }
    // })
    // if(deleteCommentChild){

    //     await prisma.commentUser.deleteMany({
    //         where:{
    //             comment:{
    //                 none:{}
    //             }
    //         }
    //     })
    // }

    //  //3. update left, right cua cac comment con lai
    // const parentComment:any = await commentModel.findById(parentCommentId)
    // if(!parentComment) throw new errorResponse.NotFound("Paren comment not exists")

    // // tim cac comment con lai co chung parentcomment voi comment vua xoa de cap nhat
    // const commentsUpdate=await commentModel.updateMany({
    //     comment_productId:productId,
    //     comment_parentId:parentCommentId,
    //     comment_left:{$gte:leftValue}
    // },{
    //     $inc:{
    //         comment_left:-width,
    //         comment_right:-width
    //     }
    // })

    // const commentsParentUpdate=await commentModel.updateMany({
    //     comment_productId:productId,
    //     comment_right:{$gte:parentComment.comment_right}
    // },{
    //     $inc:{
    //         comment_right:-width
    //     }
    // })

    await prisma.comment.updateMany({
        where: {
            comment_filmId: filmId,
            comment_right: { gt: rightValue }
        },
        data: {
            comment_right: {
                increment: -width
            }
        }
    })

    await prisma.comment.updateMany({
        where: {
           comment_filmId: filmId ,
            comment_left: { gt: rightValue }
        },
        data: {
            comment_left: {
                increment: -width
            }
        }
    })

    return deleteComment
}

export const getAllCommentByFilm = async ({ filmId }: { filmId: string }) => {
    //check input
    const isValidId = await filmId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')
    let film = await prisma.film.findUnique({ where: { id: filmId } })
    
    const comments = await prisma.comment.findMany({ where: { comment_filmId: filmId }})
    return comments;
}

export const editComment = async ({
    userId = "", commentId = "", filmId = "", content = ""
}) => {
    //check input
    const isValidId = await userId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.BadRequestError('User Id không hợp lệ')
    const isValidId3 = await commentId.match(regex.idRegex)
    if (isValidId3 === null) throw new errorResponse.BadRequestError('Comment Id không hợp lệ')
    const isValidId2 = await filmId.match(regex.idRegex)
    if (isValidId2 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')

    const cleanContent = DOMPurify.sanitize(content);

    let film = await prisma.film.findUnique({ where: { id: filmId } })
    const comment = await prisma.comment.findUnique({ where: { id: commentId }, include: { comment_user: true } })
    if (!comment) throw new errorResponse.NotFound("Comment not exists")
    if (comment.comment_user?.userId !== userId) throw new errorResponse.AuthFailureError("Bạn không có quyền chỉnh sửa comment này")

    const commentUpdate = await prisma.comment.update({ where: { id: commentId }, data: { comment_content: content }, include: { comment_user: true } })
    return commentUpdate
}
