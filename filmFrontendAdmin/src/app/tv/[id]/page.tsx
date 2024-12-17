'use client'

import React, { useState, useEffect } from "react"
import Image from 'next/image'

import { useAppDispatch, useAppSelector } from "../../../lib/hooks"
import { useParams } from 'next/navigation'
import ReactPlayer from 'react-player'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Rating as ReactRating } from '@smastrom/react-rating'
import { ratingTV, getRatings, getA } from "../../../lib/features/tv.slice"
import CommentList from "../../../components/CommentList"
import { getCommentByFilm } from "../../../lib/features/comment.slice"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link, Spinner } from "@nextui-org/react";
import { getToken } from "../../../utils/axiosConfig"
import ErrorModal from "../../../components/ErrorModal"
import VideoPlayer from '../../../components/Player'
export default function MovieDetail() {
    const dispatch = useAppDispatch()
    const [src, setSrc] = useState("")
    const [poster, setPoster] = useState("")
    const [playing, setPlaying] = useState(false);
    const [rating, setRating] = useState(0)
    const [ratingAverage, setRatingAverage] = useState(0)
    const [type, setType] = useState("")
    const [country, setCountry] = useState("Đang cập nhật")
    const [category, setCategory] = useState("Đang cập nhật")
    const [director, setDirector] = useState("Đang cập nhật")
    const [actor, setActor] = useState("Đang cập nhật")
    const tv: any = useAppSelector((state) => state.tvReducer)
    const userState = useAppSelector((state) => state.userReducer)
    const user = getToken()
    const params = useParams<{ id: string }>()
    const comment: any = useAppSelector((state) => state.commentReducer)
    const [comments, setComments] = useState([])
    const [episodeCurrent, setEpisodeCurrent] = useState("")
    const [episodeTotal, setEpisodeTotal] = useState([])
    const [quality, setQuality] = useState("")
    const [messageError, setMessageError] = useState("")
    const [isError, setIsError] = useState(false)
    const [view, setView] = useState(0)
    
    useEffect(() => {
        if (tv.tv.metadata.id)
            dispatch(getCommentByFilm({ filmId: params?.id as string }))
    }, [tv.isLoading, params])

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
        if (tv.isSuccess && tv.isGetA) {
            setSrc(tv.tv.metadata.video);
            setPoster(tv.tv.metadata.poster_url)

            const countryString = tv.tv.metadata.country.map((item: any) => item.name)
            if (countryString.join(", ") !== "") setCountry(countryString.join(", "))
            const directorString = tv.tv.metadata.director.map((item: any) => item)
            if (directorString.join(", ") !== "") setDirector(directorString.join(", "))
            const actorString = tv.tv.metadata.actor.map((item: any) => item)
            if (actorString.join(", ") !== "") setActor(actorString.join(", "))
            const categoryString = tv.tv.metadata.category.map((item: any) => item.name)
            if (categoryString.join(", ") !== "") setCategory(categoryString.join(", "))

            setType(tv.tv.metadata.type[0].toUpperCase() + tv.tv.metadata.type.slice(1))
            setEpisodeTotal(tv.tv.metadata.episodes)
            setEpisodeCurrent(tv.tv.metadata?.episodes[0].video)
            setEpisodeTotal(prev=>{
                const newData = [...prev]
                return newData.sort((a:any,b:any)=> a.slug.localeCompare(b.slug))
            })
            setQuality(tv.tv.metadata.quality)
            setView(tv.tv.metadata.view)
            setPoster(tv.tv.metadata.poster_url)

        }
        if (tv.isSuccess && tv.isGetRatings) { setRatingAverage(tv.ratings.metadata.ratingAverage) }
        if (tv.isError && tv.isRating) {
            setIsError(true)
            setMessageError(tv.message.message)
        }
    }, [tv])


    useEffect(() => {
        if (tv.ratings.metadata) {
            const userFound = tv.ratings.metadata.ratings.filter((r: any) => r.userId.toString() === user.user.id.toString())
            if (userFound.length > 0) {
                console.log('userFoundddddd', userFound[0].rating)
                setRating(userFound[0].rating as number)
            }
        }
    }, [tv.ratings])

    const handlePlay = (e: any) => {
        e.preventDefault()
        setPlaying(true);
    };

    const handleRating = (newRating: number) => {
        dispatch(ratingTV({ filmId: params?.id as string, rating: newRating }))
        setRating(newRating)
    }

    return (
        <div className="w-[95%]">
            <div className=" flex flex-col  mx-auto mt-10 shadow-lg">

            {
                    !playing &&

                    <div className="relative">
                        <img
                            src={tv.tv.metadata?.poster_url}
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

                    <VideoPlayer src={episodeCurrent} />


                }
            </div>

            <div className="flex flex-row flex-wrap gap-3 my-3 mt-5">
                {
                    episodeTotal && episodeTotal.map((episode: any) => (
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

            <div id="infotv" className="mt-5  flex flex-row border-1 shadow-lg  rounded-lg shadow-lg">
                <div className="flex flex-col mx-5">

                    <p className="flex justify-start text-start py-5 font-bold dark:text-white text-xl">{tv.tv.metadata.name}</p>
                    <div className="flex flex-row gap-2 mb-2">
                        <div className="text-ctBlue-logo">
                            <p className="ring-1 ring-ctBlue-logo p-1">{quality}</p>
                        </div>
                        <div className="flex items-center text-red-600">
                            {tv.tv.metadata.time}
                        </div>
                        <div className="flex flex-row gap-2 justify-center items-center content-center">
                            <ReactRating style={{ maxWidth: 100 }} value={rating} onChange={handleRating} />
                            <div>
                                {tv.ratings.metadata?.ratingAverage}/5
                            </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                            ({view} lượt xem)
                        </div>
                    </div>
                    <div className="text-gray-600">
                        {tv.tv.metadata.content}
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
                                TV Show
                            </div>
                            <div>
                                {

                                    tv.tv.metadata?.country.map((item: any) => item.country.name).join(", ") !== "" && tv.tv.metadata?.country.map((item: any) => item.country.name).join(", ") !== ", " ?
                                        tv.tv.metadata?.country.map((item: any) => item.country.name).join(", ") : "Đang cập nhật"
                                }
                            </div>
                            <div>
                                {

                                    tv.tv.metadata?.category.map((item: any) => item.category.name).join(", ") !== "" && tv.tv.metadata?.category.map((item: any) => item.category.name).join(", ") !== ", " ?
                                        tv.tv.metadata?.category.map((item: any) => item.category.name).join(", ") : "Đang cập nhật"
                                }
                            </div>
                            <div>
                                {tv.tv.metadata?.year ? tv.tv.metadata.year : 2024}
                            </div>
                            <div>
                                {

                                    tv.tv.metadata?.director.map((item: any) => item.director.name).join(", ") !== "" && tv.tv.metadata?.director.map((item: any) => item.director.name).join(", ") !== ", " ?
                                        tv.tv.metadata?.director.map((item: any) => item.director.name).join(", ") : "Đang cập nhật"
                                }
                            </div>
                            <div>
                                {

                                    tv.tv.metadata?.actor.map((item: any) => item.actor.name).join(", ") !== "" && tv.tv.metadata?.actor.map((item: any) => item.actor.name).join(", ") !== ", " ?
                                        tv.tv.metadata?.actor.map((item: any) => item.actor.name).join(", ") : "Đang cập nhật"
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end w-[calc(12/9*100vh)] object-cover">
                    <Image
                        src={tv.tv.metadata.thumb_url}
                        alt={tv.tv.metadata.name}
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