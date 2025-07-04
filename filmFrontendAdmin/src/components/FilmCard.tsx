'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'; // Thêm dòng này
import { useRouter } from 'next/navigation'
import { FilmIcon, MonitorIcon } from '@iconicicons/react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { deleteFilm } from '@/lib/features/film.slice';
import AlertInfo from './Alert';
import { FaHeart, FaReply, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'
// import {}
export default function FilmCard(data: any) {
  const dispatch = useAppDispatch()
  const movieState = useAppSelector(state => state.filmReducer)
  const [isDelete, setIsDelete] = useState(false)
  const [infoAlert, setInfoAlert] = useState("")
  const [colorAlert, setColorAlert] = useState("")

  console.log('cardddddd', data.data)
  const router = useRouter()
  const handleClick = (e: any) => {
    e.preventDefault()
    if (data.data.type === 'movie') {
      // if(localStorage.getItem('movie')) localStorage.removeItem('movie')
      //   else localStorage.setItem('movie',JSON.stringify(data.data))
      router.push(`/movie/${data.data.id}`)
    } else if (data.data.type === 'tv') {
      router.push(`/tv/${data.data.id}`)
    }
  }
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
  const handleDeleteFilm = (e: any) => {
    e.stopPropagation()
    console.log('delete')
    dispatch(deleteFilm({ id: data.data.id }))
    setIsDelete(true)

  }
  useEffect(() => {
    if (movieState.isSuccess && movieState.isDelete) { 
      setInfoAlert("Delete Movie Successfully"); 
      setColorAlert("success"); 
    }
    if (movieState.isError && movieState.isDelete) { 
      setInfoAlert("Delete Movie Error"); 
      setColorAlert("danger"); 
    }

  }, [movieState.isDelete])
  return (

    <>
      <div
        key={data.data._id}
        onClick={handleClick}
        className='w-[183px] h-[349px] border-2  shadow-lg rounded-lg flex flex-col hover:cursor-pointer'
      >
        <div className="w-[180px] h-[237px]">

          <Image
            src={data.data.thumb_url}
            alt={data.data.name}
            width={154}
            height={231}
            className="w-full h-full rounded-md"
            unoptimized
          />
        </div>
        <p className="mt-1 text-center dark:text-zinc-400 text-zinc-600 basis-1/2  font-bold line-clamp-2">
          {data.data.name}
        </p>
        <p className="mt-1 text-center dark:text-zinc-400 text-zinc-600 basis-1/4">
          {data.data.year}
        </p>
        <p className="flex justify-center items-end mt-1 dark:text-zinc-400 text-zinc-600 basis-1/4">
          {renderCategoryIcon(data.data.type)}
          <div className="pl-[6px] pr-[6px] flex gap-3">
            <p>{renderCategoryText(data.data.type)}</p>
            <button onClick={handleDeleteFilm} className="transition-transform transform hover:scale-150">
              <FaTrash
                aria-label="Delete"
                style={{
                  color: "red",
                }}
              />
            </button>
          </div>
        </p>

      </div>
      {isDelete && (

          <AlertInfo info={infoAlert} color={colorAlert} close={() => setIsDelete(false)} />
      )}
    </>

  )
}

