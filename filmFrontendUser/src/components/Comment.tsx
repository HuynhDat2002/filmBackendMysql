
'use client'

import React, { useEffect, useState, useMemo, useRef } from "react"
import Image from "next/image"
import { getToken } from "../utils/axiosConfig"
import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { getCommentByParentId, getCommentByFilm } from "../lib/features/comment.slice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as fassFaHeart } from '@fortawesome/free-regular-svg-icons'
import { FaHeart, FaReply, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'
import CommentForm from "./CommentForm"
import CommentReply from "./CommentReply"
import { useParams } from 'next/navigation'
import { editComment,deleteComment } from "../lib/features/comment.slice"
import { CommentProps } from "../types"
const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "long" })
export default function Comment({ comment, childs, setChilds }: { comment: CommentProps, childs: any[], setChilds: any }) {
    const dispatch = useAppDispatch()
    const [comments, setComments] = useState([])
    const [isReplying, setIsReplying] = useState(false)
    const movie: any = useAppSelector((state) => state.movieReducer.movie.metadata)
    const [areChildrenHidden, setAreChildrenHidden] = useState(false);
    const commentChild: any = useAppSelector((state) => state.commentReducer)
    const [isEdit, setIsEdit] = useState(false)
    const replyBoxRef = useRef<any>(null)
    const [editContent, setEditContent] = useState(comment.comment_content)
    const params = useParams<{ id: string }>()
    
    useEffect(() => {
        if (comment.comment_right - comment.comment_left > 1) {
            console.log('commentId', comment)
            dispatch(getCommentByParentId({ filmId: movie.id, parentCommentId: comment.id }))
        }
    }, [])
    console.log('comment',comment)
    useEffect(() => {
        if (commentChild.isSuccess && commentChild.isGetCommentByParentId) {
            // Lọc ra các phần tử có comment_parentId bằng với comment.id
            const b = commentChild.commentChilds?.metadata.filter((child: any) => {
                return child.comment_parentId === comment.id;
            });

            // Tạo một Set chứa các ID của các phần tử hiện có trong childs
            const existingChildIds = new Set(childs.map((child: any) => child.id));

            // Lọc các phần tử chưa có trong childs
            const elementsNotInChilds = b.filter((element: any) => !existingChildIds.has(element.id));

            setChilds((prevChilds: any) => {
                // Tạo một Set từ prevChilds để đảm bảo không có phần tử trùng lặp
                const updatedChilds = new Map(prevChilds.map((child: any) => [child.id, child]));

                // Thêm các phần tử mới không trùng lặp vào Set
                elementsNotInChilds.forEach((element: any) => {
                    if (!updatedChilds.has(element.id)) {
                        updatedChilds.set(element.id, element);
                    }
                });

                // Trả về mảng từ Set đã cập nhật
                return Array.from(updatedChilds.values());
            });
        }
    }, [commentChild])

    useEffect(() => {
        if (isReplying) {
            const handleClickOutside = (event: MouseEvent) => {
                if (replyBoxRef.current && !replyBoxRef.current.contains(event.target as Node)) {
                    setIsReplying(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isReplying]);

    useEffect(() => {
        if (commentChild.isSuccess && commentChild.isCreateComment) {
            setIsReplying(false)
        }
    }, [commentChild.isLoading]);
    useEffect(() => {
        if (commentChild.isSuccess && commentChild.isCommentReply)
            setChilds((prevChilds: any) => {
                // Tạo một Set từ prevChilds để đảm bảo không có phần tử trùng lặp
                const updatedChilds = new Map(prevChilds.map((child: any) => [child.id, child]));

                // Thêm các phần tử mới không trùng lặp vào Set

                if (!updatedChilds.has(commentChild.comment.metadata.id)) {
                    updatedChilds.set(commentChild.comment.metadata.id, commentChild.comment.metadata);
                }


                // Trả về mảng từ Set đã cập nhật
                return Array.from(updatedChilds.values());
            });
    }, [commentChild.isLoading])

    console.log('commentChild', childs)
    const user = getToken()
    console.log('userInComment',user)
    const handleCancelEdit = () => {
        setIsEdit(false);
        setEditContent(comment.comment_content);
    };

    const handleSaveEdit = () => {
        dispatch(editComment({commentId: comment.id, filmId: comment.comment_movieId ? comment.comment_movieId : comment.comment_tvId, content: editContent }))
    };

    const handleDeleteComment= ()=>{
        dispatch(deleteComment({commentId: comment.id, filmId:comment.comment_movieId ? comment.comment_movieId : comment.comment_tvId}))
    }
    useEffect(()=>{
        if(commentChild.isSuccess && commentChild.isEditComment){
        dispatch(getCommentByFilm({ filmId: params?.id as string }));

          setIsEdit(false);

        }
        if(commentChild.isSuccess && commentChild.isDeleteComment){
            dispatch(getCommentByFilm({ filmId: params?.id as string }));    
            }
    },[commentChild.isLoading])
    return (


        <>
            {comment && (


                <div key={comment.id} id="comment" className="flex flex-col my-3 mx-5 p-2 ring-1 ring-ctBlue-logo rounded-lg shadow-lg">
                    <div id="header" className="flex flex-row justify-between">
                        <div className="text-lg font-bold">
                            {comment.comment_user?.name}
                        </div>

                        <div className="flex text-ctBlue-header">
                            {(() => {
                                const createDate = new Date(comment.createdAt);
                                return !isNaN(createDate.getTime())
                                    ? dateFormatter.format(createDate)
                                    : 'Ngày không hợp lệ';
                            })()}
                        </div>
                    </div>

                    <div>

                        {isEdit ? (
                            <div className="my-2">
                                <input
                                    autoFocus={true}
                                    value={editContent}
                                    onChange={e => setEditContent(e.target.value)}
                                    className="border-1 rounded-sm w-full py-2 px-5"
                                />
                            </div>
                        ) : (
                            <div>

                                <div className="my-5">{comment.comment_content} </div>
                            </div>
                        )}

                    </div>
                    <div className="flex flex-row gap-3">
                        <div >
                            <FaHeart
                                aria-label="Like"
                                style={{
                                    color: "gray",
                                }}

                            />
                        </div>
                        <button onClick={() => setIsReplying(true)}>
                            <FaReply
                                aria-label="Reply"
                                style={{
                                    color: "#11A3A3",
                                }}

                            />
                        </button>
                        {user && user.user.id === comment.comment_user?.userId &&
                            <>
                                {/* <button onClick={()=>setIsEdit(true)}>
                                    <FaEdit
                                        aria-label="Edit"
                                        style={{
                                            color: "#11A3A3",
                                        }}

                                    />
                                </button>

                                <div >
                                    <FaTrash
                                        aria-label="Delete"
                                        style={{
                                            color: "red",
                                        }}

                                    />
                                </div> */}

                                {isEdit ? (
                                    <>
                                        <button onClick={handleSaveEdit}>
                                            <FaSave
                                                aria-label="Save"
                                                style={{
                                                    color: "#11A3A3",
                                                }}
                                            />
                                        </button>
                                        <button onClick={handleCancelEdit}>
                                            <FaTimes
                                                aria-label="Cancel"
                                                style={{
                                                    color: "red",
                                                }}
                                            />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div onClick={() => setIsEdit(true)}>
                                            <FaEdit
                                                aria-label="Edit"
                                                style={{
                                                    color: "#11A3A3",
                                                }}
                                            />
                                        </div>
                                        <button onClick={handleDeleteComment}>
                                            <FaTrash
                                                aria-label="Delete"
                                                style={{
                                                    color: "red",
                                                }}
                                            />
                                        </button>
                                    </>
                                )}
                            </>


                        }
                    </div>
                </div>
            )}

            {isReplying && (
                <div className="mt-1 ml-6" ref={replyBoxRef}>
                    <CommentReply place={`Đang trả lời bình luận của ${comment.comment_user?.name}`} username={comment.comment_user?.name} commentId={comment.id} />
                </div>
            )}
            {childs.length > 0 && (
                <div className="ml-5  border-l-2 border-gray-300 pl-4">
                    {childs.map((commentChild: CommentProps) => (
                        <>
                            {commentChild.comment_parentId === comment.id &&

                                <Comment key={commentChild.id} comment={commentChild} childs={childs} setChilds={setChilds} />
                            }
                        </>
                    ))}
                </div>
            )}
        </>


    )
}