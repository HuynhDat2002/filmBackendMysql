'use client'
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faCheckCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { deleteUser } from "@/lib/features/user.slice";
export default function AskSure({ isOpen, onClose, service, data, setData }: { isOpen: boolean; onClose: () => void, service: string, data: string, setData?: void }) {
    // const [isOpenLogin, setIsOpenLogin] = useState(false)
    // const user: any = useAppSelector((state) => state.userReducer)
    const dispatch = useAppDispatch()
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

    const handleDelete = async () => {
        //   if(service==="deleteUser"){
        //     console.log('data delete',data)
        //     await dispatch(deleteUser({userId:data}))
        //   }

        console.log('service', service)
        console.log('handle delete', data)
        if (service === "deleteUser") {
            dispatch(deleteUser({ userId: data }))
            onClose()
        }
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


                            {/* <ModalHeader className="flex flex-col gap-1">Are you sure?</ModalHeader> */}
                            <ModalBody className="flex flex-col justify-center items-center mt-10">
                                <p className="text-gray-700 font-bold text-xl">Are you sure?</p>
                                <div>

                                    <FontAwesomeIcon icon={faQuestionCircle} className="pr-2 fa-4x my-4 text-amber-400" />
                                </div>




                            </ModalBody>
                            <ModalFooter className="flex flex-row justify-center">

                                <Button color="danger" variant="flat" onPress={onClose} type="button" className="basis1/4">
                                    No
                                </Button>
                                <Button className="bg-ctBlue-header text-white basis-1/4" onClick={handleDelete}>
                                    Yes
                                </Button>

                            </ModalFooter>

                        </>
                    )}
                </ModalContent>
            </Modal>

        </>
    );
}