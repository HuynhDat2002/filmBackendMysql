'use client'
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link } from "@nextui-org/react";
import { useDisclosure } from '@nextui-org/use-disclosure'
import { verify } from "../lib/features/user.slice";
import { SuccessProps } from '../types/index'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { logIn } from "../lib/features/user.slice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { resetState } from "../lib/features/user.slice";
import Login from "./Login";
import { Spinner } from "@nextui-org/react";

export default function Loading({ isOpen, onClose }: {isOpen:boolean,onClose:any}) {
    // const [isOpenLogin, setIsOpenLogin] = useState(false)
    // const user: any = useAppSelector((state) => state.userReducer)
    // const dispatch = useAppDispatch()
    // const logDisclosure = useDisclosure()
    // const [isError, setError] = useState(false)
    // const [messageError, setMessageError] = useState("")
    // let schema = yup.object().shape({

    //   otp:yup.string().required('Hãy nhập otp')
    // });

    // const formik = useFormik({
    //     initialValues: {
    //         otp: "",
    //     },
    //     validationSchema: schema,
    //     onSubmit: async (value) => {
    //         console.log('value', value)
    //         await dispatch(verify(value))
    //     },
    // });

    // useEffect(() => {
    //     if (user. && user.isSuccess) openReset()
    //     if (user.isVerify && user.isError) {
    //         if (Object.keys(user.message).length === 0) { setError(true); setMessageError("Server Error") }
    //         if (Object.keys(user.message).length > 0) { setError(true); setMessageError(`${user.message.message}`) }
    //     }
    // }, [user.isLoading])

    // const handleError = async (e: any) => {
    //     e.preventDefault();
    //     setError(false)
    //     setMessageError("")
    // }

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


                            <ModalHeader className="flex flex-col gap-1">Loading</ModalHeader>
                            <ModalBody className="flex flex-col justify-center items-center text-center">
                              

                                <div className="flex gap-4 mb-10">
                                   
                                    <Spinner color="primary" />
                                    
                                </div>


                            </ModalBody>


                        </>
                    )}
                </ModalContent>
            </Modal>

        </>
    );
}