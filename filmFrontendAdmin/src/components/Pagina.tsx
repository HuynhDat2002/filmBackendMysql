// 'use client'
// import React, { useState, useEffect } from "react";
// import { Pagination } from "@nextui-org/react";
// import { useAppDispatch, useAppSelector } from "../lib/hooks";
// import { getPageTotalMovie } from "../lib/features/movie.slice";
// import { getPageTotal } from "../lib/features/tv.slice";
// import { getMovies } from "../lib/features/movie.slice";
// import { getAllTV } from "../lib/features/tv.slice";
// export default function Page({ type }: { type: string }) {
//     const dispatch = useAppDispatch()
//     const movie = useAppSelector((state) => state.movieReducer)
//     const tv = useAppSelector((state) => state.tvReducer)
//     const [currentPage, setCurrentPage] = useState(1)
//     const [pageTotal, setPageTotal] = useState(0)
//     useEffect(() => {
//         dispatch(getPageTotalMovie())
//         dispatch(getPageTotal())

//     }, [])
//     useEffect(() => {
//         if (movie.isSuccess && movie.isGetPageTotal && type === "Movies") {
//             console.log('aa')
//             setPageTotal(Math.ceil(movie.movieLength.metadata.movieLength / 20))

//         }
//         if (tv.isSuccess && tv.isGetPageTotal && type === "TV Shows") {

//             setPageTotal(Math.ceil(tv.tvLength.metadata.tvLength / 20))

//         }
//     }, [movie, tv, type])

//     console.log('types', type)
//     console.log('lengthss', movie.movieLength.metadata.movieLength)
//     console.log('pagetotal', pageTotal)


//     const handleChangePage = (page: any) => {
//         setCurrentPage(page)
//         if (type === "Movies") {
//             dispatch(getMovies(page))

//         }
//         if (type === "TV Shows") {
//             dispatch(getAllTV(page))

//         }
//     }
//     return (
//         <div className="flex justify-center">
//             <Pagination isCompact showControls onChange={handleChangePage} total={pageTotal} initialPage={1}  />
//         </div>
//     );
// }   
