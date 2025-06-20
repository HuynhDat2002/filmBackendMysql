'use client'

import React, { useState, useEffect } from "react"
import Image from 'next/image'

import { useAppDispatch, useAppSelector } from "../../../lib/hooks"
import { useParams } from 'next/navigation'
import ReactPlayer from 'react-player'
import { ratingFilm, getRatings } from "../../../lib/features/film.slice"
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Rating as ReactRating } from '@smastrom/react-rating'
import { getA } from '../../../lib/features/film.slice'
import CommentList from "../../../components/CommentList"
import { getCommentByFilm } from "../../../lib/features/comment.slice"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link, Spinner } from "@nextui-org/react";
import { getToken } from "../../../utils/axiosConfig"
import ErrorModal from "../../../components/ErrorModal"
import VideoPlayer from '../../../components/Player'
export default function SeriesDetail() {
    const dispatch = useAppDispatch()
    const [playing, setPlaying] = useState(false);
    const [rating, setRating] = useState(0)
    const user = getToken()
    const params = useParams<{ id: string }>()
    const comment: any = useAppSelector((state) => state.commentReducer)
    const [comments, setComments] = useState([])
    const [episodeCurrent, setEpisodeCurrent] = useState("")
    const [messageError, setMessageError] = useState("")
    const [isError, setIsError] = useState(false)
    const film: any = useAppSelector((state) => state.filmReducer)

    useEffect(() => {
        if (film.isSuccess && film.isGetA) dispatch(getCommentByFilm({ filmId: params?.id as string }))
    }, [film.isLoading, params])

    useEffect(() => {
        if (comment.isSuccess && comment.isGetCommentByFilm)
            setComments(comment.comments?.metadata.filter((comment: any) => {
                return !comment.comment_parentId
            }));
    }, [comment.isLoading])

    console.log('comments', comments)

    useEffect(() => {
        if (params?.id !== undefined) {
            dispatch(getA({ id: params?.id as string }))
            dispatch(getRatings({ filmId: params?.id as string }))
        }
    }, [params])


    console.log('params', params)


    useEffect(() => {

        if (film.isError && film.isRating) {
            setIsError(true)
            setMessageError(film.message.message)
        }
    }, [film.isLoading])


    useEffect(() => {
        if (film.ratings.metadata) {
            const userFound = film.ratings.metadata.filter((r: any) => r.userId.toString() === user.user.id.toString())
            if (userFound.length > 0) {
                console.log('userFoundddddd', userFound[0].rating)
                setRating(userFound[0].rating as number)
            }
        }
    }, [film.ratings])

    const handlePlay = (e: any) => {
        e.preventDefault()
        setPlaying(true);
    };

    const handleRating = (newRating: number) => {
        dispatch(ratingFilm({ filmId: params?.id as string, rating: newRating }))
        setRating(newRating)
    }
console.log('quality',film.film.metadata.quality)
    return (
        <div className="w-[95%]">
            <div className=" flex flex-col  mx-auto mt-10 shadow-lg">

                {
                    !playing &&

                    <div className="relative">
                        <img
                            src={film.film.metadata?.poster_url || "/public/black.jpg"}
                            alt="Series poster"
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
                    <VideoPlayer src={episodeCurrent||""} />
                }
            </div>

            <div className="flex flex-row flex-wrap gap-3 my-3 mt-5 text-white  ">
                {
                    film.film.metadata.episodes.length>0 &&  film.film.metadata.episodes.map((episode: any) => (
                        <>

                            <button
                                className={`${episode.video === episodeCurrent ? 'border-ctBlue-logo text-ctBlue-logo' : "border-gray-500"} flex-wrap border-1 px-3  w-fit h-7 shadow-lg cursor-pointer hover:border-ctBlue-logo hover:text-ctBlue-logo whitespace-normal break-words`}
                                onClick={() => setEpisodeCurrent(episode.video)}
                            >
                                {episode.name}
                            </button>
                        </>
                    ))
                }

            </div>

            <div id="infoseries" className="mt-5  flex flex-row border-1 shadow-lg  gap-1 rounded-lg shadow-lg">
                <div className="flex flex-col text-justify mx-5 basis-4/5">

                    <p className="flex justify-start text-start py-5 font-bold text-white text-xl">{film.film.metadata.name||""}</p>
                    <div className="flex flex-row gap-2 mb-2 text-white">
                        <div className="text-ctBlue-logo">
                            <p className="ring-1 ring-ctBlue-logo text p-1">{film.film.metadata?.quality ? film.film.metadata.quality : ""}</p>
                        </div>
                        <div className="flex items-center text-red-600">
                            {film.film.metadata.time||""}
                        </div>
                        <div className="flex flex-row gap-2 justify-center items-center content-center">
                            <ReactRating style={{ maxWidth: 100 }} value={rating} onChange={handleRating} />
                            <div>
                                {film.ratings.metadata?.ratingAverage||0}/5
                            </div>
                        </div>
                        <div className="flex items-center text-gray-400">
                            ({film.film.metadata.view||0} lượt xem)
                        </div>
                    </div>
                    <div className="text-gray-600 text-white my-2">
                        {film.film.metadata.content||""}
                    </div>
                    <div className="flex flex-row text-white">
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
                                Series
                            </div>
                            <div>
                                {

                                    film.film.metadata?.country.map((item: any) => item.name).join(", ") !== "" && film.film.metadata?.country.map((item: any) => item.name).join(", ") !== ", " ?
                                        film.film.metadata?.country.map((item: any) => item.name).join(", ") : "Đang cập nhật"
                                }
                            </div>
                            <div>
                                {

                                    film.film.metadata?.category.map((item: any) => item.name).join(", ") !== "" && film.film.metadata?.category.map((item: any) => item.name).join(", ") !== ", " ?
                                        film.film.metadata?.category.map((item: any) => item.name).join(", ") : "Đang cập nhật"
                                }
                            </div>
                            <div>
                                {film.film.metadata?.year ? film.film.metadata.year : 2024}
                            </div>
                            <div>
                                {

                                    film.film.metadata?.director.map((item: any) => item.name).join(", ") !== "" && film.film.metadata?.director.map((item: any) => item.name).join(", ") !== ", " ?
                                        film.film.metadata?.director.map((item: any) => item.name).join(", ") : "Đang cập nhật"
                                }
                            </div>
                            <div>
                                {

                                    film.film.metadata?.actor.map((item: any) => item.name).join(", ") !== "" && film.film.metadata?.actor.map((item: any) => item.name).join(", ") !== ", " ?
                                        film.film.metadata?.actor.map((item: any) => item.name).join(", ") : "Đang cập nhật"
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end basis-1/5 object-cover">
                    <Image
                        src={film.film.metadata.thumb_url || "/hourglass.png"}
                        alt={film.film.metadata.name}
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