'use client'
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link } from "@nextui-org/react";
import { useDisclosure } from '@nextui-org/use-disclosure'
import { verifyDevice } from "../lib/features/user.slice";
import { VerifyProps } from '../types/index'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { logIn } from "../lib/features/user.slice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faEnvelope, faLock, faUser,faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { resetState } from "../lib/features/user.slice";
import Login from "./Login";

export default function VerifyNewDevice({ isOpen, onClose }:{isOpen:boolean,onClose:any}) {
    const user: any = useAppSelector((state) => state.userReducer)
    const dispatch = useAppDispatch()
    const [isError, setError] = useState(false)
    const [messageError, setMessageError] = useState("")
    let schema = yup.object().shape({
      otp:yup.string().required('Hãy nhập otp')
    });

    const formik = useFormik({
        initialValues: {
            otp: "",
        },
        validationSchema: schema,
        onSubmit: async (value) => {
            console.log('value', value)
            await dispatch(verifyDevice(value))
        },
    });

    useEffect(() => {
        if (user.isVerifyDevice && user.isError) {
            if (Object.keys(user.message).length === 0) { setError(true); setMessageError("Server Error") }
            if (Object.keys(user.message).length > 0) { setError(true); setMessageError(`${user.message.message}`) }
        }
    }, [user.isLoading])

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

                                <ModalHeader className="flex flex-col gap-1">Verify OTP</ModalHeader>
                                <ModalBody>
                                    <p className="text-gray-700">Bạn đang đăng nhập trên 1 thiết bị mới, hãy nhập mã OTP để xác minh</p>
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
                                        label="OTP"
                                        placeholder="Enter your email"
                                        variant="bordered"
                                        name="otp"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}

                                    />
                                    {formik.touched.otp && formik.errors.otp ? (
                                        <div className="text-red-500 text-sm">{formik.errors.otp}</div>
                                    ) : null}




                                </ModalBody>
                                <ModalFooter className="flex flex-row">
                                   
                                    <Button color="danger" variant="flat" onPress={onClose} type="button" className="basis1/4">
                                        Close
                                    </Button>
                                    <Button className="bg-ctBlue-header text-white basis-1/4" type="submit">
                                        Send
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