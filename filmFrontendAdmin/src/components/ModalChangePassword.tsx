'use client'
import React, { useEffect, useState } from "react";

import SuccessChangePassword from "./SuccessChangePassword";

import ChangePassword from "./ChangePassword";
export default function ModalChangePassword({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: any }) {
   
    const [isSuccess, setIsSuccess] = useState(false)
  
    const [isChangePassword, setIsChangePassword] = useState(true)

 
    // useEffect(() => { }, [isLoginOpen, isSignUpOpen])

    const openSuccess = () => {
        
        setIsChangePassword(false)
        setIsSuccess(true)
    }


    const close = ()=>{
      setIsChangePassword(false)
        setIsSuccess(false)
        setIsOpen(false)
    }
    return (
        <>
          
            {isOpen &&

                <SuccessChangePassword
                    isOpen={isSuccess}
                    onClose={close}
                />
            }
            {isOpen &&

                <ChangePassword
                    isOpen={isChangePassword}
                    onClose={close}
                    openSuccess={openSuccess}
                />
            }
        </>
    );
}