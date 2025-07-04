'use client'
import { useAppDispatch, useAppSelector } from "../../lib/hooks"
import React, { useEffect, useState } from "react"
import { initialState } from '../../lib/features/user.slice';
import { FilmIcon, MonitorIcon } from "@iconicicons/react"
import { checkLogin } from "../../lib/features/user.slice"
import * as yup from 'yup'
import { editUser } from '../../lib/features/user.slice'
import { useFormik } from "formik"
import SuccessEdit from "@/components/SuccessEdit"
import { Button, Input, Checkbox, Link, Spinner } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'
import { faRightToBracket, faEnvelope, faUser, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
export default function FilmList(tab: any) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  // const [userInfo, setUserInfo] = useState<{ user: { id: "", email: "", name: "" } }>({ user: { id: "", email: "", name: "" } })
  const user: typeof initialState = useAppSelector((state) => state.userReducer)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const [name,setName]=useState("")
  // const userInfo = JSON.parse(localStorage.getItem('user') as string) || { user: { id: "", email: "", name: "" } }
  useEffect(() => {

    dispatch(checkLogin())

  }, [])

  useEffect(() => {
    if (user.isSuccess && user.isEdit) setIsSuccess(true)
    if (user.isError && user.isCheck) router.push(`/`)
    if (user.isSuccess && user.isGetUser) {
      setEmail(user.user.metadata.email)
      setName(user.user.metadata.name)
    }
  }, [user])
  useEffect(()=>{
 setEmail(email)
 setName(name)
  },[email,name])

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
      dispatch(editUser({ name: value.name }))
    },
  });
  const handleSubmit = (e:any)=>{
    e.preventDefault()
    dispatch(editUser({ name: formik.values.name }))

  }
  console.log(`emailll`, email)

  return (
    <>
      <div className="mt-10">
        <div className=" mx-auto w-[100%] mb-5 h-screen text-white">
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
                onBlur={formik.handleBlur}
                defaultValue={email}
                value={email}
                isReadOnly
                className="text-white "

              />

              <Input
                endContent={
                  <FontAwesomeIcon icon={faUser} className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  // <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Tên"
                placeholder="Enter your name"
                variant="bordered"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                defaultValue={name}

              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              ) : null}




            </div>
            <div className="flex justify-center mt-5">

              <Button className="bg-ctBlue-header text-white basis-1/4" type="submit" onClick = {handleSubmit}>
                Cập nhật
              </Button>


            </div>
          </form>
        </div>
      </div>
      {isSuccess &&
        <SuccessEdit isOpen={isSuccess} onClose={() => setIsSuccess(false)} />
      }
    </>
  )
}
