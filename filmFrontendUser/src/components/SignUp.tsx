'use client'
import React, { useState ,useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link } from "@nextui-org/react";
import { useDisclosure } from '@nextui-org/use-disclosure'
// import { MailIcon } from './MailIcon';
// import { LockIcon } from './LockIcon';
import { SignProps } from '../types/index'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { logIn } from "../lib/features/user.slice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faEnvelope, faLock,faUser,faTimesCircle } from '@fortawesome/free-solid-svg-icons'
// import {Button} from '@nextui-org/button'
import { sendOTP } from "../lib/features/user.slice";
import Login from "./Login";
import { signUp } from "../lib/features/user.slice";
import Spin from './Spinner'
export default function SignUp({ isOpen, onClose, openLogin,openVerifySign}: SignProps) {
    const [isOpenLogin, setIsOpenLogin] = useState(false)
    const user: any = useAppSelector((state) => state.userReducer)
    const dispatch = useAppDispatch()
    const logDisclosure = useDisclosure()
    const [isError, setError] = useState(false)
    const [messageError,setMessageError]=useState("")
    const [isSpin, setIsSpin] = useState(false)

    let schema = yup.object().shape({
        name: yup.string().required("Không được bỏ trống"),
        email: yup
            .string()
            .email("Không được bỏ trống")
            .required("Không được bỏ trống"),
        password: yup.string().required("Không được bỏ trống").min(8),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password')], 'Mật khẩu phải trùng khớp')
            .required('Nhập lại mật khẩu'),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: schema,
        onSubmit: async (value) => {
           await dispatch(sendOTP({
            name:value.name,
            email:value.email,
            password:value.password
           }))       
        },
    });

useEffect(()=>{
    if(user.isSendOTP && user.isSuccess) openVerifySign()
},[user.isLoading])

useEffect(()=>{
    if(user.isLoading) setIsSpin(true)
    else setIsSpin(false)
},[user.isLoading])
   
const handleError=()=>{
    setError(false),
    setMessageError("")
}
    console.log('isopennnn', isOpenLogin)

    return (
        <>
            {isOpen &&
                <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
            }
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                placement="center"
                isDismissable={false}

            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={formik.handleSubmit}>

                                <ModalHeader className="flex flex-col gap-1">Đăng ký</ModalHeader>
                                <ModalBody>
                                {isError &&
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mt-3" role="alert">
                                            <p>{messageError}</p>
                                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" >
                                                <FontAwesomeIcon icon={faTimesCircle} className="cursor-pointer" onClick={handleError}/>
                                            </span>
                                        </div>
                                    }
                                    <Input
                                        endContent={
                                            <FontAwesomeIcon icon={faUser} className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                            // <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                        }
                                        label="Tên"
                                        placeholder="Nhập tên"
                                        variant="bordered"
                                        name="name"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}

                                    />
                                    {formik.touched.name && formik.errors.name ? (
                                        <div className="text-red-500 text-sm">{formik.errors.name}</div>
                                    ) : null}
                                    <Input
                                        endContent={
                                            <FontAwesomeIcon icon={faEnvelope} className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                            // <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                        }
                                        label="Email"
                                        type="email"
                                        placeholder="Nhập email"
                                        variant="bordered"
                                        name="email"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}

                                    />
                                    {formik.touched.email && formik.errors.email ? (
                                        <div className="text-red-500 text-sm">{formik.errors.email}</div>
                                    ) : null}
                                    <Input
                                        endContent={
                                            <FontAwesomeIcon icon={faLock} className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />

                                        }
                                        label="Mật khẩu"
                                        placeholder="Nhập mật khẩu"
                                        type="password"
                                        variant="bordered"
                                        value={formik.values.password}
                                        name="password"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}

                                    />
                                    {formik.touched.password && formik.errors.password ? (
                                        <div className="text-red-500 text-sm">{formik.errors.password}</div>
                                    ) : null}
                                    <Input
                                        endContent={
                                            <FontAwesomeIcon icon={faLock} className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />

                                        }
                                        label="Xác minh mật khẩu"
                                        placeholder="Nhập lại mật khẩu"
                                        type="password"
                                        variant="bordered"
                                        value={formik.values.confirmPassword}
                                        name="confirmPassword"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}

                                    />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                        <div className="text-red-500 text-sm">{formik.errors.confirmPassword}</div>
                                    ) : null}
                                {isSpin &&
                                        <Spin />
                                        
                                     }   
                                </ModalBody>
                                <ModalFooter className="flex flex-row">

                                    <Button className="text-gray-500 hover:text-ctBlue-logo flex basis-1/2 px-1"  type="button" onClick={openLogin}>

                                        <FontAwesomeIcon icon={faRightToBracket} className="pr-2" />
                                        <span className="text-center">Đăng nhập</span>

                                    </Button>


                                    <Button color="danger" variant="flat" onPress={onClose} type="button" className="basis1/4">
                                        Đóng
                                    </Button>
                                    <Button className="bg-ctBlue-header text-white basis-1/4" type="submit">
                                        Đăng ký
                                    </Button>


                                </ModalFooter>
                            </form>

                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* {
                isOpenLogin &&
                <Login isOpenLogin={isOpenLogin} setIsOpenLogin={setIsOpenLogin} />
            } */}
        </>
    );
}