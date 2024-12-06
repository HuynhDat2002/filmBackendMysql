'use client'
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link } from "@nextui-org/react";
import { useDisclosure } from '@nextui-org/use-disclosure'
import { verify } from "../lib/features/user.slice";
import { ErrorProps } from '../types/index'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { logIn } from "../lib/features/user.slice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faWarning } from '@fortawesome/free-solid-svg-icons'
import { resetState } from "../lib/features/user.slice";
import Login from "./Login";

export default function ErrorModal({ isOpen, onClose, message = "" }: ErrorProps) {


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


                            <ModalBody className="flex flex-col justify-center items-center align-middle mt-5">
                                <p className="text-gray-700 font-bold text-xl text-center">Lỗi</p>
                                <FontAwesomeIcon icon={faWarning} className="pr-2 fa-4x my-4 text-yellow-300 text-center" />
                                <div>{message}</div>

                            </ModalBody>
                            <ModalFooter className="flex flex-row justify-center">

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