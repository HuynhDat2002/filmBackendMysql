"use client"

import React, { useState, useEffect } from 'react'
import {useRouter} from 'next/navigation'
export default function Menu() {
    const router = useRouter()

    return (
        <>
            <div className='flex flex-col w-[100%]  h-screen bg-ctBlue-header text-white mt-3 rounded-r-lg gap-5 shadow-lg font-bold transition duration-700 ease-in-out'>
                <button 
                    className='cursor-pointer mt-3 px-2 hover:bg-white hover:w-[100%] hover:shadow-xl py-3 hover:text-black'
                    onClick={()=>router.push('/')}      
                >
                    Home Page
                </button>
                <button 
                    className='cursor-pointer px-2 hover:bg-white hover:w-[100%] hover:shadow-xl py-3 hover:text-black'
                    onClick={()=>router.push('/create/movie')}    
                >
                    Create Movie
                </button>
                <button 
                    onClick={()=>router.push('/create/tv')}
                    className='cursor-pointer px-2 hover:bg-white hover:w-[100%] hover:shadow-xl py-3 hover:text-black'>
                    Create TV Shows
                </button>
            </div>
        </>
    )
}