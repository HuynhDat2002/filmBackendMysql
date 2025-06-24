'use client'

import { useSearchParams } from 'next/navigation'
import FilmList from '../../components/FilmList'
import FilmCard from '../../components/FilmCard'
import { useAppDispatch, useAppSelector } from '../../lib/hooks'
import React, { useState, useEffect } from 'react'
import { searchFilm } from '../../lib/features/film.slice'
import Pagi from '../../components/Pagination'
import ErrorModal from '../../components/ErrorModal'

export default function Search() {
    const searchParams = useSearchParams()
    const [searchList, setSearchList] = useState<Array<any>>([])
    const film = useAppSelector((state) => state.filmReducer)
    const pageTotal = useAppSelector((state) => state.filmReducer.films.metadata.pageTotal)
    const [query, setQuery] = useState("")
    const [page, setPage] = useState("1")

    const [isOpenError, setIsOpenError] = useState(false)
    const [messageError, setMessageError] = useState("")


    const dispatch = useAppDispatch()
    useEffect(() => {
         setQuery(searchParams?.get('query') as string || '')
        setPage(searchParams?.get('page') as string || '1')
        const query1 = searchParams?.get('query') as string || ''
        const page1 = searchParams?.get('page') as string || '1'
        dispatch(searchFilm({ query: query1, page: parseInt(page1) }))
        // dispatch(searchTV({ query, page }))

    }, [query, page])

    useEffect(() => {
        setQuery(searchParams?.get('query') as string || '')
        setPage(searchParams?.get('page') as string || '1')
    }, [searchParams])


    useEffect(() => {
        // let combinedList: Array<any> = []
        // if (film.isSearch && film.isSuccess) combinedList = [...film.films.metadata]
        // if (tv.isSearch && tv.isSuccess) combinedList = [...combinedList, ...tv.tvs.metadata]
        if (film.isSuccess && film.isSearch)
            setSearchList(film.films.metadata.films)
    }, [film.isLoading])

    useEffect(() => {
        if (film.isError && film.isSearch) {
            setMessageError(film.message?.message)
            setIsOpenError(true)
        }
    }, [film.isLoading])
    console.log('query1', query)

    const handlePageChange = (page: number) => {
         dispatch(searchFilm({ query: query, page: page }));
      }
    return (
        // <div className="w-[90%] xl:w-[80%] flex justify-center items-center  mx-auto mt-10">
        <>
            <div className="flex flex-col gap-5 mt-10 min-h-screen">

                <div className=" grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-start">

                    {searchList.map((film: any) => (
                        <div
                            key={film.id}
                        >
                            <FilmCard data={film} />
                        </div>
                    ))}
                </div>
                {
                    searchList.length > 0 &&
                    <Pagi total={pageTotal} onPageChange={handlePageChange} />
                }
                {
                    searchList.length === 0 &&
                    <div
                        className="flex justify-center items-center my-10 font-bold text-3xl text-white"

                    >
                        <div>Không tìm thấy kết quả mong muốn!</div>

                    </div>
                }
            </div>
            <ErrorModal isOpen={isOpenError} onClose={() => setIsOpenError(false)} message={messageError} />
        </>
        // </div>

    )
}