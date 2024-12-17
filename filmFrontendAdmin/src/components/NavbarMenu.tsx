"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
export default function Menu() {
    const router = useRouter()

    return (
        <>
            <div className='flex flex-col fixed w-[9%]  h-[70%] z-50 bg-ctBlue-header text-white mt-3 rounded-r-lg gap-3 shadow-lg font-bold transition duration-700 ease-in-out'>
                <button
                    className='cursor-pointer mt-3 px-2 hover:bg-white hover:w-[100%] hover:shadow-xl py-3 hover:text-black'
                    onClick={() => router.push('/')}
                >
                    <div className="inline-block border-b-2 border-white">
                        Home Page
                    </div>
                </button>
                <button
                    className='cursor-pointer px-2 hover:bg-white hover:w-[100%] hover:shadow-xl py-3 hover:text-black'
                    onClick={() => router.push('/create/movie')}
                >
                    <div className="inline-block border-b-2 border-white">
                        Create Movie
                    </div>

                </button>
                <button
                    onClick={() => router.push('/create/tv')}
                    className='cursor-pointer px-2 hover:bg-white hover:w-[100%] hover:shadow-xl py-3 hover:text-black'>
                    <div className="inline-block border-b-2 border-white">
                    <p>Create TV Shows</p>
                    </div>

                </button>
                <button
                    onClick={() => router.push('/userlist')}
                    className='cursor-pointer px-2 hover:bg-white hover:w-[100%] hover:shadow-xl py-3 hover:text-black'>
                    <div className="inline-block border-b-2 border-white">
                        User List
                    </div>

                </button>
            </div>
        </>
    )
}