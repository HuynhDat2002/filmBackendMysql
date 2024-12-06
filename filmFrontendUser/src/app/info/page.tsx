'use client'
import { useAppDispatch, useAppSelector } from "../../lib/hooks"
import React, { useEffect, useState } from "react"

import { FilmIcon, MonitorIcon } from "@iconicicons/react"

import * as yup from 'yup'
import { editUser } from '../../lib/features/user.slice'
import { useFormik } from "formik"
import { Button, Input, Checkbox, Link, Spinner } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {useRouter} from 'next/navigation'
import { faRightToBracket, faEnvelope, faUser, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
export default function FilmList(tab: any) {
const router = useRouter()
  const dispatch = useAppDispatch()
  const movies: any = useAppSelector((state) => state.movieReducer.movies.metadata)
  const tvs: any = useAppSelector((state) => state.tvReducer.tvs.metadata)
  const user: any = useAppSelector((state) => state.userReducer) 
  const userinfo: { user: { id: string, email: string, name: string } } = typeof window !== "undefined" ? (JSON.parse(  localStorage.getItem('userinfo') as string) ? JSON.parse(localStorage.getItem('userinfo') as string) :  { user: { id: "", email: "", name: "" } } ) : { user: { id: "", email: "", name: "" } }
  useEffect(()=>{
  },user.isLoading)

  let schema = yup.object().shape({
    email: yup
      .string()
      .email("Chưa đúng định dạng email")
      .required("Không được bỏ trống"),
    name: yup.string().required("Không được bỏ trống"),
  });


  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
    },
    validationSchema: schema,
    onSubmit: async (value) => {
      dispatch(editUser({name:value.name}))
    },
  });
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
  console.log(`emailll`, userinfo)

  return (
    <div className="mt-5">
      <div className=" mx-auto w-[100%] mb-5">
        <form onSubmit={formik.handleSubmit} >
          <div className="flex justify-center gap-1 font-bold my-5">Thông tin cá nhân</div>
          <div className='relative flex flex-col gap-3 font-bold '>

            <Input
              endContent={
                <FontAwesomeIcon icon={faEnvelope} className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                // <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              defaultValue={userinfo.user?.email}
              isReadOnly
              className="text-gray-600"

            />

            <Input
              endContent={
                <FontAwesomeIcon icon={faUser} className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                // <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Name"
              placeholder="Enter your name"
              variant="bordered"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              defaultValue={userinfo.user?.name}

            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            ) : null}
          



          </div>
          <div className="flex justify-center mt-5">

            <Button className="bg-ctBlue-header text-white basis-1/4" type="submit">
              Cập nhật
            </Button>


          </div>
        </form>
      </div>
    </div>
  )
}
