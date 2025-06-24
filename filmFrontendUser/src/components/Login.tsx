// 6LfXO5QqAAAAADU5UPm71o7LmuIhN-K5_M3Ztez0
'use client'
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link, Spinner } from "@nextui-org/react";
import { useDisclosure } from '@nextui-org/use-disclosure'
import { LoginProps } from "../types";
import Recaptcha from "./Recaptcha";
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { logIn, checkDevice } from "../lib/features/user.slice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faEnvelope, faLock, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import SignUp from './SignUp'
import { useRouter } from "next/navigation";
import VerifyNewDevice from "./VerifyNewDevice";
import Spin from "./Spinner";
import ReCAPTCHA from "react-google-recaptcha";
export default function Login({ isOpen, onClose, openSignUp, openForgot, openVerifyDevice }: LoginProps) {
    const [tokenCaptcha, setTokenCaptcha] = useState("")
    const [isOpenSign, setIsOpenSign] = useState(false)
    const [isError, setError] = useState(false)
    const [messageError, setMessageError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useAppDispatch()
    const user: any = useAppSelector((state) => state.userReducer)
    const signUpDisclosure = useDisclosure()
    const router = useRouter()
    let schema = yup.object().shape({
        email: yup
            .string()
            .email("Chưa đúng định dạng email")
            .required("Không được bỏ trống"),
        password: yup.string().required("Không được bỏ trống").min(8),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: schema,
        onSubmit: async (value) => {
            await dispatch(checkDevice({ email: formik.values.email, password: formik.values.password, tokenCaptcha: tokenCaptcha }))
        },
    });
    useEffect(() => {
        if (user.isLogin) {
            if (user.isSuccess) { onClose(); window.location.reload() }
            if (user.isError && Object.keys(user.message).length === 0) { setError(true); setMessageError("Server Error") }
            if (user.isError && Object.keys(user.message).length > 0) { setError(true); setMessageError(`${user.message.message}`) }
        }
        if (user.isCheckDevice && user.isSuccess) {
            dispatch(logIn({ email: formik.values.email, password: formik.values.password, tokenCaptcha: tokenCaptcha }))
        }
        if (user.isCheckDevice && user.isError && user.message.message === "Ban dang dang nhap tren thiet bi moi, hay nhap ma OTP!") {
            openVerifyDevice()
        }
        if (user.isCheckDevice && user.isError && user.message.message !== "Ban dang dang nhap tren thiet bi moi, hay nhap ma OTP!") {
            setError(true); setMessageError(`${user.message.message}`)
        }
        if (user.isVerifyDevice && user.isSuccess) dispatch(logIn({ email: formik.values.email, password: formik.values.password, tokenCaptcha: tokenCaptcha }))
        if (user.isLoading) { setIsLoading(true) }
        if (!user.isLoading) setIsLoading(false)
        // if(!user.isCheck && !user.isLoading && user.isError &&  Object.keys(user.message).length === 0) {setError(true);setMessageError("Server Error")}
        // if(!user.isCheck  && !user.isLoading && user.isError && Object.keys(user.message).length >0)  {setError(true);setMessageError(`${user.message.message}`)}
    }, [user.isLoading, tokenCaptcha])
    console.log(`errorrrr`, isError)

    const handleError = () => {
        setError(false),
            setMessageError("")
    }

    const handleRecaptchaVerify = (token: string) => {
        // Send token to server for verification
    };
    const handleCaptchaChange = (value: any) => {
        console.log('reCAPTCHA Token:', value);
        setTokenCaptcha(value)

    }
    useEffect(() => {
        console.log('tokencaptcha', tokenCaptcha, "1")

    }, [tokenCaptcha])
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js?hl=vi";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }, []);
    const recaptchaRef: any = React.createRef();
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
                                <ModalHeader className="flex flex-col gap-1">Đăng nhập</ModalHeader>
                                <ModalBody className='relative'>
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
                                        placeholder="Nhập Email"
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
                                    <div className="flex py-2 px-1 justify-between">
                                        {/* <Checkbox
                                            classNames={{
                                                label: "text-small",
                                            }}
                                            color="primary"
                                        >
                                            Ghi nhớ
                                        </Checkbox> */}
                                        <Link className="text-gray-500 hover:text-ctBlue-logo cursor-pointer" onClick={openForgot} size="sm">
                                            Quên mật khẩu?
                                        </Link>
                                    </div>
                                    {/* <ReCAPTCHA
                                        sitekey="6LcTMZcqAAAAAAYpYV-BoPjawYsv7_uJutvjVSF0"
                                        onChange={handleCaptchaChange}
                                    /> */}
                                    {isLoading &&
                                        <Spin />

                                    }
                                </ModalBody>
                                <ModalFooter className="flex flex-row">
                                    <Button className="text-gray-500 hover:text-ctBlue-logo flex basis-1/2 px-1" type="button" onClick={openSignUp}>

                                        <FontAwesomeIcon icon={faRightToBracket} className="pr-2" />
                                        <span className="text-center">Đăng ký</span>

                                    </Button>
                                    <Button color="danger" variant="flat" onPress={onClose} className="basis1/4">
                                        Đóng
                                    </Button>
                                    <Button className="bg-ctBlue-header text-white basis-1/4" type="submit">
                                        Đăng nhập
                                    </Button>


                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>

        </>
    );
}