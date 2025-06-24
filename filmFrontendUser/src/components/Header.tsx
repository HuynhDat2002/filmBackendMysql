'use client'

import Image from "next/image"
import { useState, useEffect, useMemo } from 'react'
import { useDisclosure } from '@nextui-org/use-disclosure'
import UserDropDown from './UserDropDown'
import ModalManager from './ModalManager'
import { useAppSelector, useAppDispatch } from "../lib/hooks";
import { checkLogin } from "../lib/features/user.slice";
import ModalChangePassword from './ModalChangePassword'
import { getUser } from '../lib/features/user.slice'
import { useRouter } from 'next/navigation'
import { getFilms } from "../lib/features/film.slice"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { getListCategory, getListCountry } from "../lib/features/film.slice"
export default function Header() {
    const [isOpenLogin, setIsOpenLogin] = useState(false)
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [isLogged, setIsLogged] = useState(false)
    const [isModal, setIsModal] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [isChangePassword, setIsChangePassword] = useState(false)
    const [isOpenError, setIsOpenError] = useState(false)
    const router = useRouter()
    const user: any = useAppSelector((state) => state.userReducer)
    const category = useAppSelector((state) => state.filmReducer.category.metadata) || [{ id: "", name: "", slug: "" }]
    const country = useAppSelector((state) => state.filmReducer.country.metadata) || [{ id: "", name: "", slug: "" }]
    const dispatch = useAppDispatch()


    useEffect(() => {
        dispatch(getListCountry())
        dispatch(getListCategory())
        dispatch(checkLogin())

    }, [])
    useEffect(() => {

        if (user.isSuccess && user.isLogin) setIsLogged(true)
        if (user.isSuccess && user.isCheck) setIsLogged(true)
        if (user.isSuccess && user.isCheck) { setIsLogged(true); dispatch(getUser()) }
        if (user.isCheck && user.isError) {
            localStorage.clear()
        }
        if (user.isLogout && user.isSuccess) setIsLogged(false)

    }, [user.isLoading])


    const handleSearch = (e: any) => {
        e.preventDefault();
        router.push(`/search?query=${searchValue}&page=1`)
    }

    const handlePhimLe = (e: any) => {
        e.preventDefault();
        // dispatch(getfilms(1))
    }


    // category
    const [selectedKeys, setSelectedKeys] = useState(new Set([""]));

    const selectedValue = useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys],
    );


    console.log('isLogin', isLogged)
    console.log('category', category)
    return (
        <>
            <header className="px-4 py-4 bg-ctBlue-header relative" >
                <div className="flex flex-row text-white">
                    {/* Logo and Title */}
                    <div className="flex-1 flex justify-start items-center gap-4">

                        {/* <div className="flex items-center">
                            <button className=" rounded-lg p-1">
                                <Image
                                    src="/menu.png"
                                    width={24}
                                    height={24}
                                    alt=""
                                />
                            </button>
                        </div> */}
                        <div className="flex flex-row gap-2 cursor-pointer" onClick={() => router.push("/")}>
                            <Image
                                src={"/logo-film.png"}
                                width={24}
                                height={24}
                                alt=""
                            />
                            <p className="font-bold text-xl text-center">Navy</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 justify-center items-center " >
                        <form className="max-w-md mx-auto" onSubmit={handleSearch}>
                            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative focus:outline-none">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    id="default-search"
                                    className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Tìm kiếm..."
                                    required
                                    onChange={(e) => setSearchValue(e.target.value||"")}
                                />
                                <button
                                    type="submit"
                                    className="ct-button-search"
                                >
                                    Tìm kiếm
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* Filter */}
                    <div className="flex flex-row gap-5 items-center ml-5">
                        <p className="cursor-pointer" onClick={(e:any)=>{ e.preventDefault;router.push(`/filter?field=type&data=movie&page=1`)}}>Phim Lẻ</p>
                        <p className="cursor-pointer" onClick={(e:any)=>{ e.preventDefault;router.push(`/filter?field=type&data=series&page=1`)}}>Phim Bộ</p>
                        <div>
                            <Dropdown>
                                <DropdownTrigger className="cursor-pointer">
                                    <div className="flex flex-row">
                                        Thể loại
                                        <ChevronDownIcon className="size-6 text-white" />
                                    </div>

                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="selection example"
                                    closeOnSelect={false}
                                    selectedKeys={selectedKeys}
                                    selectionMode="single"
                                    variant="flat"
                                    className="overflow-y-auto max-h-60"
                                    // onSelectionChange={() => {
                                    //     router.push(`/filter?field=category&data=${selectedKeys}&page=1`)
                                    // }}
                                >
                                    {category.map((item: any) => (
                                        <DropdownItem key={item.slug} onClick={(e:any)=>{ e.preventDefault;router.push(`/filter?field=category&data=${item.slug}&page=1`)}}>{item.name}</DropdownItem>
                                    ))}

                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div>
                            <Dropdown>
                                <DropdownTrigger className="cursor-pointer">
                                    <div className="flex flex-row">
                                        Quốc gia
                                        <ChevronDownIcon className="size-6 text-white" />
                                    </div>

                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="selection example"
                                    closeOnSelect={false}
                                    selectedKeys={selectedKeys}
                                    selectionMode="single"
                                    variant="flat"
                                    className="overflow-y-auto max-h-60"
                                >
                                     {country.map((item: any) => (
                                        <DropdownItem key={item.slug} onClick={(e:any)=>{ e.preventDefault;router.push(`/filter?field=country&data=${item.slug}&page=1`)}}>{item.name}</DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                    </div>
                    {/* Login button*/}
                    <div className="flex-1 flex justify-end items-center">
                        {!isLogged &&
                            <button
                                type="button"
                                className='text-white font-bold bg-ctBlue-logo py-2 px-4 hover:bg-ctBlue-logo_hover rounded-lg'
                                onClick={() => setIsOpenLogin(true)}

                            >
                                Đăng nhập
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
        </>
    )
}   