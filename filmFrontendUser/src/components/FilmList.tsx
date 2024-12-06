import { useAppDispatch, useAppSelector } from "../lib/hooks"
import React, { useEffect } from "react"
import { getMovies } from "../lib/features/movie.slice"
import axios from 'axios'
import FilmCard from './FilmCard'
import Image from 'next/image'
import { FilmIcon, MonitorIcon } from "@iconicicons/react"
import { getAllTV } from "../lib/features/tv.slice"
import { resetState as resetMovie } from "../lib/features/movie.slice"
import { resetState as resetTV } from "../lib/features/tv.slice"
import Page from './Pagination'
export default function FilmList(tab: any) {

  const dispatch = useAppDispatch()
  const movies: any = useAppSelector((state) => state.movieReducer.movies.metadata)
  const tvs: any = useAppSelector((state) => state.tvReducer.tvs.metadata)
  const user: any = useAppSelector((state) => state.userReducer)

console.log('film list')
  useEffect(() => {
    // Gọi hành động getMovies khi component được mount
    dispatch(getMovies(1));
    dispatch(getAllTV(1));

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
      return 'TV Shows'
    }
  }
  return (
      <div className="flex flex-col gap-5 min-h-screen">

        <div className=" grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-start">

          {tab.tab === "Movies" && movies.map((movie: any) => (
            <div
              key={movie.id}
            >
              <FilmCard data={movie} />
            </div>
          ))}
          {tab.tab === "TV Shows" && tvs.map((tv: any) => (
            <div
              key={tv.id}
            >
              <FilmCard data={tv} />
            </div>
          ))}
        </div>
          <Page type={tab.tab}/>

      </div>

  )
}
