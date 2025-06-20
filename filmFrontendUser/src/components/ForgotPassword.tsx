'use client'
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link } from "@nextui-org/react";
import { useDisclosure } from '@nextui-org/use-disclosure'
import { forgotPassword } from "../lib/features/user.slice";
import { ForgotProps } from '../types/index'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { logIn } from "../lib/features/user.slice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faEnvelope, faLock, faUser, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { resetState } from "../lib/features/user.slice";
import Login from "./Login";
import Spin from './Spinner'
export default function ForgotPassword({ isOpen, onClose, openLogin, openVerify }: ForgotProps) {
    const [isOpenLogin, setIsOpenLogin] = useState(false)
    const user: any = useAppSelector((state) => state.userReducer)
    const dispatch = useAppDispatch()
    const logDisclosure = useDisclosure()
    const [isError, setError] = useState(false)
    const [isSpin, setIsSpin] = useState(false)

    const [messageError, setMessageError] = useState("")
    let schema = yup.object().shape({

        email: yup
            .string()
            .email("Không được bỏ trống")
            .required("Không được bỏ trống"),

    });

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: schema,
        onSubmit: async (value) => {
            console.log('value', value)
            await dispatch(forgotPassword(value))
        },
    });

    useEffect(() => {
        if (user.isForgot && user.isSuccess) openVerify()
        if (user.isForgot && user.isError) {
            if (Object.keys(user.message).length === 0) { setError(true); setMessageError("Server Error") }
            if (Object.keys(user.message).length > 0) { setError(true); setMessageError(`${user.message.message}`) }
        }
    }, [user.isLoading])

    useEffect(()=>{
        if(user.isLoading) setIsSpin(true)
        else setIsSpin(false)
    },[user.isLoading])
    const handleError = async (e: any) => {
        e.preventDefault();
        setError(false)
        setMessageError("")
    }

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

                                <ModalHeader className="flex flex-col gap-1">Quên mật khẩu</ModalHeader>
                                <ModalBody>
                                    <p className="text-gray-700">Hãy nhập địa chỉ email của bạn để lấy lại mật khẩu</p>
                                    {isError &&
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mt-3" role="alert">
                                            <p>{messageError}</p>
                                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" >
                                                <FontAwesomeIcon icon={faTimesCircle} className="cursor-pointer" onClick={handleError} />
                                            </span>
                                        </div>
                                    }
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

                                     {isSpin &&
                                        <Spin />
                                        
                                     }       


                                </ModalBody>
                                <ModalFooter className="flex flex-row">
                                    <Button className="text-gray-500 hover:text-ctBlue-logo flex basis-1/2 px-1" type="button" onClick={openLogin}>

                                        <FontAwesomeIcon icon={faRightToBracket} className="pr-2" />
                                        <span className="text-center">Login Now</span>

                                    </Button>
                                    <Button color="danger" variant="flat" onPress={onClose} type="button" className="basis1/4">
                                        Đóng
                                    </Button>
                                    <Button className="bg-ctBlue-header text-white basis-1/4" type="submit">
                                        Gửi
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