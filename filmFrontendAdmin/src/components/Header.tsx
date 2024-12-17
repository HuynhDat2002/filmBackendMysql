'use client'

import Image from "next/image"
import { useState, useEffect } from 'react'
import Login from "./Login";
import { useDisclosure } from '@nextui-org/use-disclosure'
import UserDropDown from './UserDropDown'
import ModalManager from './ModalManager'
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { checkLogin } from "@/lib/features/user.slice";
import { resetState } from "@/lib/features/user.slice";
import ModalChangePassword from './ModalChangePassword'
import { getUser } from '@/lib/features/user.slice'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as yup from 'yup'
// import Menu from "./NavbarMenu";
export default function Header({isOpenMenu,setIsOpenMenu}:{isOpenMenu:boolean,setIsOpenMenu:any}) {
    const [isOpenLogin, setIsOpenLogin] = useState(false)
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [isLogged, setIsLogged] = useState(false)
    const [isModal, setIsModal] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [isChangePassword, setIsChangePassword] = useState(false)
    const [isOpenError,setIsOpenError] = useState(false)
    const router = useRouter()
    const dispatch = useAppDispatch()


    useEffect(() => {

        dispatch(checkLogin())
        
    }, [])
    const user: any = useAppSelector((state) => state.userReducer)
    useEffect(() => {

        if (user.isSuccess && user.isLogin) setIsLogged(true)
        if (user.isSuccess && user.isCheck) setIsLogged(true)
        if (user.isSuccess && user.isCheck) { setIsLogged(true); dispatch(getUser()) }
        if (user.isCheck && user.isError) {
            localStorage.clear()
            setIsLogged(false)
            setIsOpenLogin(true)
        }
        if (user.isLogout && user.isSuccess) setIsLogged(false)

    }, [user.isLoading])


    const handleSearch = (e: any) => {
        e.preventDefault();
        router.push(`/search?query=${searchValue}&page=1`)
    }
    const handleOpenMenu = ()=>{
        if(isOpenMenu) setIsOpenMenu(false)
        else setIsOpenMenu(true)
    }

    console.log('isLogin',isLogged)
    return (
        <>
            <header className="px-4 py-4 bg-ctBlue-header relative " >
                <div className="flex flex-row text-white">
                    <div className="flex-1 flex justify-start items-center gap-4">

                        <div className="flex items-center">
                            <button className=" rounded-lg p-1" onClick={handleOpenMenu}>
                                <Image
                                    src="/adminpage/menu.png"
                                    width={24}
                                    height={24}
                                    alt=""
                                />
                                {/* <img src="/adminpage/menu.png" alt="Menu" width="24" height="24" /> */}
                            </button>
                        </div>
                        <div className="flex flex-row gap-2 cursor-pointer" onClick={() => router.push("/")}>
                            <Image
                                src="/adminpage/logo-film.png"
                                width={24}
                                height={24}
                                alt=""
                            />
                            {/* <img src="/logo-film.png" alt="Logo Film" width="24" height="24" /> */}
                            <p className="font-bold text-xl text-center">Navy</p>
                        </div>
                    </div>

                    <div className="flex-1 justify-center items-center " >
                        <form className="max-w-md mx-auto" onSubmit={handleSearch}>
                            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative focus:outline-none">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    id="default-search"
                                    className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Search..."
                                    required
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="ct-button-search"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="flex-1 flex justify-end items-center">
                        {!isLogged &&
                            <button
                                type="button"
                                className='text-white font-bold bg-ctBlue-logo py-2 px-4 hover:bg-ctBlue-logo_hover rounded-lg'
                                onClick={() => setIsOpenLogin(true)}

                            >
                                Login
                            </button>
                        }
                        {isLogged &&

                            <UserDropDown isChangePassword={isChangePassword} setIsChangePassword={setIsChangePassword} />
                        }
                    </div>
                </div>

            </header>
            {isOpenLogin &&
                <ModalManager isOpen={isOpenLogin} setIsOpen={setIsOpenLogin} />
            }
            {isChangePassword &&
                <ModalChangePassword isOpen={isChangePassword} setIsOpen={setIsChangePassword} />
            }
    {/* {
        isOpenMenu &&
        <Menu />
    } */}
        </>
    )
}   