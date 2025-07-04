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

export default function Success({ isOpen, onClose }: SuccessProps) {

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