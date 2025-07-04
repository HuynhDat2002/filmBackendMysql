
'use client'

import React, { useEffect, useState } from "react"
import { getToken } from "../utils/axiosConfig"
import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { getCommentByFilm } from "../lib/features/comment.slice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as fassFaHeart } from '@fortawesome/free-regular-svg-icons'
import { FaHeart, FaReply, FaEdit, FaTrash } from 'react-icons/fa'
import CommentForm from "./CommentForm"
import Comment from "./Comment"
import { CommentProps } from "../types"
export default function CommentList({ commentRoots }: { commentRoots: any }) {
    const dispatch = useAppDispatch()
    const [isReplying, setIsReplying] = useState(false)
    const [childs,setChilds] = useState([])

    return (
        <div className="mt-5  flex flex-col border-1 shadow-lg  rounded-lg shadow-lg">
            <span className="font-bold text-2xl mx-5 py-5 text-white">Bình luận</span>
            <CommentForm />
            {commentRoots?.length > 0 && commentRoots.map((root: CommentProps) => (
                
                    <div key={root.id} id="comment" >
                        <Comment comment={root} childs={childs} setChilds={setChilds}/>
                    </div>
                

            ))}
        </div>
    )
}