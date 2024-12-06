'use client'
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link } from "@nextui-org/react";

import { ChangePasswordProps } from '../types/index'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { changePassword } from "../lib/features/user.slice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faEnvelope, faLock, faUser, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import Spin from "./Spinner";

export default function ChangePassword({ isOpen, onClose, openSuccess }: ChangePasswordProps) {
    const user: any = useAppSelector((state) => state.userReducer)
    const dispatch = useAppDispatch()
    const [isError, setError] = useState(false)
    const [messageError, setMessageError] = useState("")
    const [isSpin, setIsSpin] = useState(false)
    let schema = yup.object().shape({

        password: yup.string().required("Không được bỏ trống").min(8),
        newPassword: yup.string().required("Không được bỏ trống").min(8),

        confirmPassword: yup.string()
            .oneOf([yup.ref('newPassword')], 'Mật khẩu phải trùng khớp')
            .required('Nhập lại mật khẩu'),
    });

    const formik = useFormik({
        initialValues: {

            password: "",
            newPassword: "",
            confirmPassword: ""
        },
        validationSchema: schema,
        onSubmit: async (value) => {
            dispatch(changePassword({ password: value.password, newPassword: value.newPassword }))
        },
    });

    useEffect(() => {
        if (user.isChangePassword && user.isSuccess) openSuccess()
        if (user.isChangePassword && user.isError) {
            if (Object.keys(user.message).length === 0) { setError(true); setMessageError("Server Error") }
            if (Object.keys(user.message).length > 0) { setError(true); setMessageError(`${user.message.message}`) }
        }

    }, [user.isLoading])


    const handleError = async (e: any) => {
        e.preventDefault();
        setError(false)
        setMessageError("")
    }
    useEffect(() => {
        if (user.isLoading) setIsSpin(true)
        else setIsSpin(false)
    }, [user.isLoading])
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

                                <ModalHeader className="flex flex-col gap-1">Reset Password</ModalHeader>
                                <ModalBody>
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
                                            <FontAwesomeIcon icon={faLock} className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />

                                        }
                                        label="Password"
                                        placeholder="Enter your password"
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
                                        label="New Password"
                                        placeholder="Enter your password"
                                        type="password"
                                        variant="bordered"
                                        value={formik.values.newPassword}
                                        name="newPassword"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}

                                    />
                                    {formik.touched.newPassword && formik.errors.newPassword ? (
                                        <div className="text-red-500 text-sm">{formik.errors.newPassword}</div>
                                    ) : null}
                                    <Input
                                        endContent={
                                            <FontAwesomeIcon icon={faLock} className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />

                                        }
                                        label="ConfirmPassword"
                                        placeholder="Enter your confirm password"
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

                                    <Button color="danger" variant="flat" onPress={onClose} type="button" className="basis1/4">
                                        Close
                                    </Button>
                                    <Button className="bg-ctBlue-header text-white basis-1/4" type="submit">
                                        Submit
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