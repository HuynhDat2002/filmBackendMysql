import { useAppDispatch, useAppSelector } from "../lib/hooks"
import React, { useEffect,useState } from "react"
import { getFilms,getPageTotalFilm } from "../lib/features/film.slice"
import axios from 'axios'
import FilmCard from './FilmCard'
import { FilmIcon, MonitorIcon } from "@iconicicons/react"
import Pagi from './Pagination'
export default function FilmList(tab: any) {

  const dispatch = useAppDispatch()
  const pageTotal: any = useAppSelector((state) => state.filmReducer.filmLength.metadata)

  const films: any = useAppSelector((state) => state.filmReducer.films.metadata.films)
  const user: any = useAppSelector((state) => state.userReducer)
  // const [pageTotal,setPageTotal] = useState<number>(0)
console.log('film list')
  useEffect(() => {
    // Gọi hành động getfilms khi component được mount
    dispatch(getFilms(1));
    dispatch(getPageTotalFilm())
  }, [user]);

  const renderCategoryIcon = (category: string) => {
    if (category === 'movie') {
      return <FilmIcon className="pl-1 text-base" />
    } else {
      return <MonitorIcon className="pl-1 text-base" />
    }
  }

  const renderCategoryText = (category: string) => {
    if (category === 'movie') {
      return 'Movie'
    } else {
      return 'Series'
    }
  }
  // useEffect(() => {
  //     setPageTotal(filmState.filmLength.metadata)
  //   // if(filmState.isSuccess && filmState.isGetPageTotal) {
  //   // }
  // },[])

  const handleChange = (page: number) => {
     dispatch(getFilms(page));
  }
  console.log('films',pageTotal)
  return (
      <div className="flex flex-col gap-5 min-h-screen">

        <div className=" grid grid-cols-2 gap-7 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-start">

          {films.map((film: any) => (

            <div
              key={film.id}
            >
              <FilmCard data={film} />
            </div>
          ))
        }
        </div>
          <Pagi total={pageTotal} onPageChange={handleChange}/>

      </div>

  )
}
