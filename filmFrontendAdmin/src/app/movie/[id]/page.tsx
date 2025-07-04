'use client'

import React, { useState, useEffect, useRef } from "react"
import Image from 'next/image'
import { initialState as filmInit } from "@/lib/features/film.slice"
import { useAppDispatch, useAppSelector } from "../../../lib/hooks"
import { getA, film } from "../../../lib/features/film.slice"
import { useParams } from 'next/navigation'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Rating as ReactRating } from '@smastrom/react-rating'
import { ratingFilm, getRating } from "../../../lib/features/film.slice"
import CommentList from "../../../components/CommentList"
import { getCommentByFilm } from "../../../lib/features/comment.slice"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link, Spinner } from "@nextui-org/react";
import { getToken } from "../../../utils/axiosConfig"
import ErrorModal from "../../../components/ErrorModal"
import VideoPlayer from "../../../components/Player"

export default function MovieDetail() {
    const dispatch = useAppDispatch()
    const [playing, setPlaying] = useState(false);
    const [rating, setRating] = useState(0)
    const filmState: any = useAppSelector((state) => state.filmReducer)
    const params = useParams<{ id: string }>()
    const comment: any = useAppSelector((state) => state.commentReducer)
    const [comments, setComments] = useState([])
    const [messageError, setMessageError] = useState("")
    const [isError, setIsError] = useState(false)
    const user = getToken()
    
    useEffect(() => {
        if (filmState.film?.metadata?.id)
            dispatch(getCommentByFilm({ filmId: params?.id as string }))
    }, [filmState, params])

    useEffect(() => {
        if (comment.isSuccess && comment.isGetCommentByFilm)
            setComments(comment.comments.metadata.filter((comment: any) => {
                return !comment.comment_parentId
            }));


    }, [comment.isLoading])

    useEffect(() => {
        // if (params.id!==undefined) {
        dispatch(getA({ id: params.id as string }))
        dispatch(getRating({ filmId: params?.id as string }))
        // }
    }, [params])

    console.log('filmhihihi', filmState.film.metadata)
    console.log('comments', comments)
    console.log('params', params)



    useEffect(() => {
        if (filmState.isError && filmState.isRating) {
            setIsError(true)
            setMessageError(filmState.message.message)
        }
    }, [filmState.isLoading])

      useEffect(() => {
            if (filmState.isSuccess && filmState.isGetRating) {
                const userFound = filmState.rating.metadata.ratings.filter((r: any) => r.userRating.userId.toString() === user.user.id.toString())
                if (userFound.length>0) {
                    console.log('userFoundddddd', userFound)
                    setRating(userFound[0].ratingNumber as number)
                }
            }
            if(filmState.isSuccess && filmState.isRating){
                dispatch(getRating({ filmId: params?.id as string }))
            }
        }, [filmState.isLoading])

    const handlePlay = (e: any) => {
        e.preventDefault()
        setPlaying(true);
    };



    const handleRating = (newRating: number) => {
        dispatch(ratingFilm({ filmId: params?.id as string, rating: newRating }))

    }





    console.log('video', filmState.film.metadata?.video)

    return (
        <div className="w-[95%] mt-10">

            <div className=" flex flex-col  mx-auto shadow-lg">
                {
                    !playing &&

                    <div className="relative">
                        <img
                            src={filmState.film.metadata?.poster_url !== "" ? filmState.film.metadata?.poster_url : "/public/black.jpg"}
                            alt="Movie poster"
                            className=""
                            width={`100%`}
                        />
                        <button
                            onClick={handlePlay}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-ctBlue-logo bg-opacity-50 ring-2 ring-ctBlue-logo"
                        >
                            <FontAwesomeIcon icon={faPlay} className="rounded-full" />
                        </button>
                    </div>
                }
                {playing &&
                    <VideoPlayer src={filmState.film.metadata?.video} />
                }

            </div>
            <div id="infomovie" className="mt-5  flex flex-row border-1 shadow-lg  rounded-lg shadow-lg gap-1 text-white">
                <div className="flex flex-col ml-5  text-justify basis-4/5">
                    <p className="flex justify-start text-start py-5 font-bold dark:text-white text-xl">{filmState.film.metadata?.name ? filmState.film.metadata.name : ""}</p>
                    <div className="flex flex-row gap-2 mb-2">
                        <div className="text-ctBlue-logo">
                            <p className="ring-1 ring-ctBlue-logo p-1">{filmState.film.metadata?.quality ? filmState.film.metadata.quality : ""}</p>
                        </div>
                        <div className="flex items-center text-red-600">
                            {filmState.film.metadata?.time}
                        </div>
                        <div className="flex flex-row gap-2 justify-center items-center content-center">
                            <ReactRating style={{ maxWidth: 100 }} value={rating} onChange={handleRating} />
                            <div>
                                {filmState.rating.metadata?.ratingAverage}/5
                            </div>
                        </div>
                        <div className="flex items-center text-gray-400">
                            ({filmState.film.metadata?.view ? filmState.film.metadata.view : 0} lượt xem)
                        </div>
                    </div>
                    <div className="text-gray-600 text-white my-2">
                        {filmState.film.metadata?.content ? filmState.film.metadata.content : ""}
                    </div>
                    <div className="flex flex-row">
                        <div className="flex flex-col w-1/6">


                            <p className="pr-5">Loại:</p>
                            <p className="pr-5">Quốc gia:</p>
                            <p className="pr-5">Thể  loại:</p>
                            <p className="pr-5">Năm:</p>
                            <p className="pr-5">Đạo diễn:</p>
                            <p className="pr-5">Diễn viên:</p>
                        </div>
                        <div className="flex flex-col w-5/6">

                            <div>
                                Movie
                            </div>
                            <div>
                                {
                                    filmState.film.metadata?.country.map((item: { id: "", name: "", slug: "" }) => item.name).join(", ") !== "" && filmState.film.metadata?.country.map((item: { id: "", name: "", slug: "" }) => item.name).join(", ") !== ", " ?
                                        filmState.film.metadata?.country.map((item: any) => item.name).join(", ") : "Đang cập nhật"
                                }
                            </div>
                            <div>
                                {
                                    filmState.film.metadata?.category.map((item: any) => item.name).join(", ") !== "" && filmState.film.metadata?.category.map((item: any) => item.name).join(", ") !== ", " ?
                                    filmState.film.metadata?.category.map((item: any) => item.name).join(", ") : "Đang cập nhật"
                                }

                            </div>
                            <div>
                                {filmState.film.metadata?.year ? filmState.film.metadata.year : "Đang cập nhật"}
                            </div>
                            <div>
                                {

                                    filmState.film.metadata?.director.map((item: any) => item.name).join(", ") !== "" && filmState.film.metadata?.director.map((item: any) => item.name).join(", ") !== ", " ?
                                        filmState.film.metadata?.director.map((item: any) => item.name).join(", ") : "Đang cập nhật"
                                }
                                
                            </div>
                            <div>
                                {

                                    filmState.film.metadata?.actor.map((item: any) => item.name).join(", ") !== "" && filmState.film.metadata?.actor.map((item: any) => item.name).join(", ") !== ", " ?
                                        filmState.film.metadata?.actor.map((item: any) => item.name).join(", ") : "Đang cập nhật"
                                }
                               
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inline-flex justify-end  basis-1/5">
                    <Image
                        src={filmState.film.metadata.thumb_url ? filmState.film.metadata.thumb_url : "/hourglass.png"}
                        alt={filmState.film.metadata?.name ? filmState.film.metadata.name : "image"}
                        width={231}
                        height={231}
                        className="object-cover rounded-md h-full"
                        unoptimized
                    />
                </div>
            </div>
            <div className="mb-5">

                <CommentList commentRoots={comments} />
            </div>
            <div>
                {isError &&
                    <ErrorModal isOpen={isError} onClose={() => setIsError(false)} message={messageError} />
                }
            </div>

        </div>
    )
}