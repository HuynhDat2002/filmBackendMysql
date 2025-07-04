'use client'

import { useSearchParams } from 'next/navigation'
import FilmList from '../../components/FilmList'
import FilmCard from '../../components/FilmCard'
import { useAppDispatch, useAppSelector } from '../../lib/hooks'
import React, { useState, useEffect } from 'react'
import { filter } from '../../lib/features/film.slice'
import Pagi from '../../components/Pagination'
import ErrorModal from '../../components/ErrorModal'

export default function Filter() {
    const searchParams = useSearchParams()
    const [filterList, setFilterList] = useState<Array<any>>([])
    const film = useAppSelector((state) => state.filmReducer)
    const pageTotal = useAppSelector((state) => state.filmReducer.films.metadata.pageTotal)
    const [field, setField] = useState("")
    const [data, setData] = useState("")
    const [page, setPage] = useState("1")

    const [isOpenError, setIsOpenError] = useState(false)
    const [messageError, setMessageError] = useState("")


    const dispatch = useAppDispatch()

    useEffect(() => {
        setField(searchParams?.get('field') as string || '')
        setData(searchParams?.get('data') as string || '')
        setPage(searchParams?.get('page') as string || '1')
    }, [searchParams])

    useEffect(() => {
        const field1 = searchParams?.get('field') as string || ''
        const data1 = searchParams?.get('data') as string || ''
        const page1 = searchParams?.get('page') as string || '1'
        dispatch(filter({ field: field1, data: data1, page: parseInt(page1) }))
    }, [field, data, page])

    useEffect(() => {
        if (film.isSuccess && film.isFilter)
            setFilterList(film.films.metadata.films)
    }, [film.isLoading])

    useEffect(() => {
        if (film.isError && film.isSearch) {
            setMessageError(film.message?.message)
            setIsOpenError(true)
        }
    }, [film.isLoading])
    console.log('field', field)
    console.log('data', data)
    console.log('page', page)
    console.log('filterList', filterList)
    const handlePageChange = (page: number) => {
        const field1 = searchParams?.get('field') as string || ''
        const data1 = searchParams?.get('data') as string || ''
        dispatch(filter({ field: field1, data: data1, page: page }))
    }
    return (
        // <div className="w-[90%] xl:w-[80%] flex justify-center items-center  mx-auto mt-10">
        <>
            <div className="flex flex-col gap-5 min-h-screen mt-10 text-white">

                <div className=" grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-start">

                    {filterList.map((film: any) => (
                        <div
                            key={film.id}
                        >
                            <FilmCard data={film} />
                        </div>
                    ))}
                </div>
                {
                    filterList.length > 0 &&
                    <Pagi total={pageTotal} onPageChange={handlePageChange}/>
                }
                {
                    filterList.length === 0 &&
                    <div
                        className="flex justify-center items-center my-10 font-bold text-3xl"

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