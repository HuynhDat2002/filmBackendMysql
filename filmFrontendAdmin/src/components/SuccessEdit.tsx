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

export default function SuccessEdit({ isOpen, onClose }: {isOpen:boolean,onClose:()=>void}) {
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
                           

                                <ModalHeader className="flex flex-col gap-1">Success</ModalHeader>
                                <ModalBody className="flex flex-col justify-center items-center">
                                    <p className="text-gray-700 font-bold text-xl">Thành công</p>
                                    <div>

                                    <FontAwesomeIcon icon={faCheckCircle} className="pr-2 fa-4x my-4 text-ctBlue-logo_hover" />
                                    </div>
                                  



                                </ModalBody>
                                <ModalFooter className="flex flex-row justify-center">
                                    {/* <Button className="text-gray-500 hover:text-ctBlue-logo flex basis-1/2 px-1" type="button" onClick={openLogin}>

                                        <FontAwesomeIcon icon={faRightToBracket} className="pr-2" />
                                        <span className="text-center">Login Now</span>

                                    </Button> */}
                                    <Button color="danger" variant="flat" onPress={onClose} type="button" className="basis1/4">
                                        Close
                                    </Button>


                                </ModalFooter>

                        </>
                    )}
                </ModalContent>
            </Modal>
           
        </>
    );
}