'use strict'

/*
1. add comment [user/shop]
2. get a list of comments [user/shop]
3. delete a comment [user/shop/admin]
*/

import { CreateCommentProps } from '@/types'
import { commentModel } from '@/models/comments.model'
import * as errorResponse from '@/cores/error.response'
import * as regex from '@/middlewares/regex'
import { movieModel } from '@/models/movie.model'
import { tvModel } from '@/models/tv.model'
import DOMPurify from 'isomorphic-dompurify';
export const createComment = async ({ filmId, user, content, parentCommentId }: CreateCommentProps) => {

    //check input
    const isValidId = await user._id.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.BadRequestError('User Id không hợp lệ')
    const isValidId2 = await filmId.match(regex.idRegex)
    if (isValidId2 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')
    if (parentCommentId) {

        const isValidId3 = await parentCommentId.match(regex.idRegex)
        if (isValidId3 === null) throw new errorResponse.BadRequestError('Parent comment Id không hợp lệ')
    }

    const cleanContent = DOMPurify.sanitize(content);

    console.log('cleanContenttt', cleanContent)
    // create new comment
    const comment = new commentModel({
        comment_filmId: filmId,
        comment_user: {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        comment_content: cleanContent,
        comment_parentId: parentCommentId
    })
    if (!comment) throw new errorResponse.BadRequestError("Cannot create a new comment. Please check your informatin again!")


    let rightValue = 1
    if (parentCommentId) {

        //reply comment
        const parentComment: any = await commentModel.findOne({ _id: parentCommentId })
        if (!parentComment) throw new errorResponse.NotFound('Comment parent not found')

        rightValue = parentComment.comment_right
        const leftValue = parentComment.comment_left
        await commentModel.updateMany({
            comment_filmId: filmId,
            comment_left: { $gt: rightValue }
        }, {
            $inc: {
                comment_left: 2
            }
        })

        await commentModel.updateMany({
            comment_filmId: filmId,
            comment_right: { $gte: rightValue },
        }, {
            $inc: {
                comment_right: 2
            }
        })
    }
    else {
        const maxRightValue: any = await commentModel.findOne({
            comment_filmId: filmId
        }, 'comment_right', { sort: { comment_right: -1 } })
        if (maxRightValue) {
            rightValue = maxRightValue.comment_right + 1
        }
    }
    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1
    await comment.save();
    return comment;
}

export const getCommentByParentId = async ({ filmId = "", parentCommentId = null, limit = 50, offset = 0 }) => {
    // if(parentCommentId){
    const parent: any = await commentModel.findById(parentCommentId)
    if (!parent) throw new errorResponse.NotFound("Comment parent not found")

    const comments = await commentModel.find({
        comment_filmId: filmId,
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lt: parent.comment_right }
    })
        .select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1,
            comment_user: 1,
            comment_filmId: 1,
            _id: 1,
            createdAt: 1,
            updatedAt: 1

        })
        .sort({
            comment_left: 1
        })

    return comments
}

export const deleteComment = async ({
    userId = "", commentId = "", filmId = ""
}) => {

    //check input
    const isValidId = await userId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.BadRequestError('User Id không hợp lệ')
        const isValidId3 = await commentId.match(regex.idRegex)
    if (isValidId3 === null) throw new errorResponse.BadRequestError('Comment Id không hợp lệ')
    const isValidId2 = await filmId.match(regex.idRegex)
    if (isValidId2 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')


    let foundFilm = await movieModel.findById(filmId)
    if (!foundFilm) {
        foundFilm = await tvModel.findById(filmId)
        if (!foundFilm) throw new errorResponse.BadRequestError('Id film không đúng')
    }

    //1.xac dinh gia tri left va right
    const comment: any = await commentModel.findById(commentId)
    if (!comment) throw new errorResponse.NotFound("Comment not exists")

    if (comment.comment_user._id !== userId) throw new errorResponse.AuthFailureError("Bạn không có quyền xóa comment này")

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right

    const width = rightValue - leftValue + 1
    const parentCommentId = comment.comment_parentId || null

    //2. xoa comment can xoa va cac comment con.
    const deleteCommentChild = await commentModel.deleteMany({
        comment_filmId: filmId,
        comment_left: { $gte: leftValue, $lte: rightValue },
    })

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

    await commentModel.updateMany({
        comment_filmId: filmId,
        comment_right: { $gt: rightValue }
    }, {
        $inc: {
            comment_right: -width
        }
    })

    await commentModel.updateMany({
        comment_filmId: filmId,
        comment_left: { $gt: rightValue }
    }, {
        $inc: {
            comment_left: -width
        }
    })

    return deleteCommentChild
}

export const getAllCommentByFilm = async ({ filmId }: { filmId: string }) => {
    //check input
    const isValidId = await filmId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')

    const comments = await commentModel.find({ comment_filmId: filmId })
    return comments;
}


export const editComment = async ({
    userId = "", commentId = "", filmId = "",content=""
}) => {
   //check input
   const isValidId = await userId.match(regex.idRegex)
   if (isValidId === null) throw new errorResponse.BadRequestError('User Id không hợp lệ')
       const isValidId3 = await commentId.match(regex.idRegex)
   if (isValidId3 === null) throw new errorResponse.BadRequestError('Comment Id không hợp lệ')
   const isValidId2 = await filmId.match(regex.idRegex)
   if (isValidId2 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')

    const cleanContent = DOMPurify.sanitize(content);

    let foundFilm = await movieModel.findById(filmId)
    if (!foundFilm) {
        foundFilm = await tvModel.findById(filmId)
        if (!foundFilm) throw new errorResponse.BadRequestError('Id film không đúng')
    }
    const comment: any = await commentModel.findById(commentId)
    if (comment.comment_user._id !== userId) throw new errorResponse.AuthFailureError("Bạn không có quyền chỉnh sửa comment này")

        
    const commentUpdate = await commentModel.findOneAndUpdate({_id:commentId},{comment_content:content},{new:true})


    return commentUpdate
}


