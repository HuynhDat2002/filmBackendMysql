'use client'

import React, { useState, useEffect, useRef } from "react"
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from "../../../lib/hooks"
import { getA, movie } from "../../../lib/features/movie.slice"
import { useParams } from 'next/navigation'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Rating as ReactRating } from '@smastrom/react-rating'
import { ratingMovie, getRatings } from "../../../lib/features/movie.slice"
import CommentList from "../../../components/CommentList"
import { getCommentByFilm } from "../../../lib/features/comment.slice"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link, Spinner } from "@nextui-org/react";
import { getToken } from "../../../utils/axiosConfig"
import ErrorModal from "../../../components/ErrorModal"
import VideoPlayer from "../../../components/Player"

export default function MovieDetail() {
    const dispatch = useAppDispatch()
    const [src, setSrc] = useState("")
    const [poster, setPoster] = useState("")
    const [playing, setPlaying] = useState(false);
    const [rating, setRating] = useState(0)
    const [ratingAverage, setRatingAverage] = useState(0)
    const [country, setCountry] = useState("Đang cập nhật")
    const [type, setType] = useState("Đang cập nhật")
    const [category, setCategory] = useState("Đang cập nhật")
    const [actor, setActor] = useState("Đang cập nhật")
    const [director, setDirector] = useState("Đang cập nhật")
    const movieState: any = useAppSelector((state) => state.movieReducer)
    const userState = useAppSelector((state) => state.userReducer)
    const user = getToken()
    const params = useParams<{ id: string }>()
    const comment: any = useAppSelector((state) => state.commentReducer)
    const [comments, setComments] = useState([])
    const [quality, setQuality] = useState("")
    const [messageError, setMessageError] = useState("")
    const [isError, setIsError] = useState(false)
    const [name, setName] = useState("")
    const [time, setTime] = useState("")
    const [view, setView] = useState(0)
    const [content, setContent] = useState("")
    const [year, setYear] = useState(0)
    const [thumb, setThumb] = useState("")

    useEffect(() => {
        if (movieState.movie?.metadata?.id)
            dispatch(getCommentByFilm({ filmId: params?.id as string }))
    }, [movieState, params])

    useEffect(() => {
        if (comment.isSuccess && comment.isGetCommentByFilm)
            setComments(comment.comments.metadata.filter((comment: any) => {
                return !comment.comment_parentId
            }));


    }, [comment.isLoading])

    console.log('comments', comments)

    useEffect(() => {
        // if (params.id!==undefined) {
        dispatch(getA({ id: params?.id as string }))
        dispatch(getRatings({ filmId: params?.id as string }))
        // }
    }, [params])

    console.log('params', params)



    useEffect(() => {
        // if (movieState.isSuccess && movieState.isGetA) {
        //     // if(movieState.movie.metadata.video)  setSrc(movieState.movie.metadata.video);

        //     // setName(movieState.movie.metadata.name)
        //     // setQuality(movieState.movie.metadata.quality)
        //     // setTime(movieState.movie.metadata.time)
        //     // setView(movieState.movie.metadata.view)
        //     // setContent(movieState.movie.metadata.content)
        //     // setYear(movieState.movie.metadata.year)
        //     // setThumb(movieState.movie.metadata.thumb_url)


        //     setType(movieState.movie.metadata.type[0].toUpperCase() + movieState.movie.metadata.type.slice(1))
        // }
        // if (movieState.isSuccess && movieState.isGetRatings) { setRatingAverage(movieState.ratings.metadata.ratingAverage) }
        if (movieState.isError && movieState.isRating) {
            setIsError(true)
            setMessageError(movieState.message.message)
        }
    }, [movieState.isLoading])

    // useEffect(() => {
    //     if (movieState.isSuccess && movieState.isGetRatings) {
    //         const userFound = movieState.ratings.metadata.ratings.filter((r: any) => r.userId.toString() === user.user.id.toString())
    //         if (userFound.length > 0) {
    //             console.log('userFoundddddd', userFound[0].rating)
    //             setRating(userFound[0].rating as number)
    //         }
    //     }
    // }, [movieState.isLoading])
    const handlePlay = (e: any) => {
        e.preventDefault()
        setPlaying(true);
    };



    const handleRating = (newRating: number) => {
        dispatch(ratingMovie({ filmId: params?.id as string, rating: newRating }))
        setRating(newRating)
        dispatch(getRatings({ filmId: params?.id as string }))

    }





    console.log('video', movieState.movie.metadata?.video)

    return (
        <div className="w-[95%]">

            <div className=" flex flex-col  mx-auto mt-10 shadow-lg">
                {
                    !playing &&

                    <div className="relative">
                        <img
                            src={movieState.movie.metadata?.poster_url !== "" ? movieState.movie.metadata?.poster_url : "/public/black.jpg"}
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

                    <VideoPlayer src={movieState.movie.metadata?.video} />


                }

            </div>
            <div id="infomovie" className="mt-5  flex flex-row border-1 shadow-lg  rounded-lg shadow-lg">
                <div className="flex flex-col mx-5">
                    <p className="flex justify-start text-start py-5 font-bold dark:text-white text-xl">{movieState.movie.metadata?.name ? movieState.movie.metadata.name : ""}</p>
                    <div className="flex flex-row gap-2 mb-2">
                        <div className="text-ctBlue-logo">
                            <p className="ring-1 ring-ctBlue-logo p-1">{movieState.movie.metadata?.quality ? movieState.movie.metadata.quality : ""}</p>
                        </div>
                        <div className="flex items-center text-red-600">
                            {movieState.movie.metadata?.time}
                        </div>
                        <div className="flex flex-row gap-2 justify-center items-center content-center">
                            <ReactRating style={{ maxWidth: 100 }} value={rating} onChange={handleRating} />
                            <div>
                                {movieState.ratings.metadata?.ratingAverage}/5
                            </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                            ({movieState.movie.metadata?.view ? movieState.movie.metadata.view : 0} lượt xem)
                        </div>
                    </div>
                    <div className="text-gray-600">
                        {movieState.movie.metadata?.content ? movieState.movie.metadata.content : ""}
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

                                    movieState.movie.metadata?.country.map((item: any) => item.country.name).join(", ") !== "" && movieState.movie.metadata?.country.map((item: any) => item.country.name).join(", ") !== ", " ?
                                        movieState.movie.metadata?.country.map((item: any) => item.country.name).join(", ") : "Đang cập nhật"
                                }
                                {/* {

                                    movieState.movie.metadata?.country !== "" ? movieState.movie.metadata?.country : "Đang cập nhật"
                                } */}
                            </div>
                            <div>
                                {

                                    movieState.movie.metadata?.category.map((item: any) => item.category.name).join(", ") !== "" && movieState.movie.metadata?.category.map((item: any) => item.category.name).join(", ") !== ", " ?
                                        movieState.movie.metadata?.category.map((item: any) => item.category.name).join(", ") : "Đang cập nhật"
                                }
                                {/* {

                                    movieState.movie.metadata?.category !== "" ? movieState.movie.metadata?.category : "Đang cập nhật"
                                } */}
                            </div>
                            <div>
                                {movieState.movie.metadata?.year ? movieState.movie.metadata.year : 2024}
                            </div>
                            <div>
                                {

                                    movieState.movie.metadata?.director.map((item: any) => item.director.name).join(", ") !== "" && movieState.movie.metadata?.director.map((item: any) => item.director.name).join(", ") !== ", " ?
                                        movieState.movie.metadata?.director.map((item: any) => item.director.name).join(", ") : "Đang cập nhật"
                                }
                                {/* {

                                    movieState.movie.metadata?.director !== "" ? movieState.movie.metadata?.director : "Đang cập nhật"
                                } */}
                            </div>
                            <div>
                                {

                                    movieState.movie.metadata?.actor.map((item: any) => item.actor.name).join(", ") !== "" && movieState.movie.metadata?.actor.map((item: any) => item.actor.name).join(", ") !== ", " ?
                                        movieState.movie.metadata?.actor.map((item: any) => item.actor.name).join(", ") : "Đang cập nhật"
                                }
                                {/* {

                                    movieState.movie.metadata?.actor !== "" ? movieState.movie.metadata?.actor : "Đang cập nhật"
                                } */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end w-[calc(12/9*100vh)] object-cover">
                    <Image
                        src={movieState.movie.metadata.thumb_url ? movieState.movie.metadata.thumb_url : ""}
                        alt={movieState.movie.metadata?.name ? movieState.movie.metadata.name : ""}
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