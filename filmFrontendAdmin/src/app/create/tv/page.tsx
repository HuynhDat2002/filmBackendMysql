"use client"
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link, Spinner } from "@nextui-org/react";
import { FaArrowCircleRight } from 'react-icons/fa'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faEnvelope, faLock, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { createTV } from '@/lib/features/tv.slice';
import Success from '@/components/Success';
import ErrorModal from '@/components/ErrorModal';
import Loading from '@/components/LoadingModal';
export default function CreateMovie() {
    const [urlEmbed, setUrlEmbed] = useState("")
    const [isError,setError] = useState(false)
    const [messageError,setMessageError] = useState("")
    const [isOpenSuccess,setIsOpenSuccess] = useState(false)
    const [isLoading,setIsLoading]=useState(false)

    const dispatch = useAppDispatch()

    const movieState = useAppSelector((state)=>state.tvReducer)

const handleSubmit = (event:any)=>{
    event.preventDefault()
    dispatch(createTV({urlEmbed:urlEmbed}))
}
const handleError = () => {
    setError(false),
      setMessageError("")
  }

  useEffect(()=>{
    if(movieState.isSuccess && movieState.isCreateTV) setIsOpenSuccess(true)
    if(movieState.isError && movieState.isCreateTV){
        setError(true)
        setMessageError(movieState.message.message)
    }
    if(movieState.isLoading) setIsLoading(true)
    if(!movieState.isLoading) setIsLoading(false)

  },[movieState.isLoading])
  console.log('urlEmbed',urlEmbed)
    return (
        <>
            <div className='h-screen mt-10'>
                <form onSubmit={handleSubmit}>
                    <div className="mx-5 flex flex-row gap-5 mb-5">
                <label className='font-semibold text-center bg-ctBlue-header text-white rounded-lg p-1 px-2'>Create new tv show</label>

                        <input
                            autoFocus={false}
                            value={urlEmbed}
                            placeholder={`Hãy nhập url tại đây`}
                            onChange={e => setUrlEmbed(e.target.value)}
                            className="border-1 rounded-sm w-full py-2 px-5"
                        />
                        <button className="btn hover:cursor-pointer hover:text-ctBlue-logo" disabled={false} type="submit">
                            {/* {false ? "..." : "POST"} */}
                            <FaArrowCircleRight aria-label="posttt" className="text-3xl" />
                        </button>
                    </div>
                    {/* {isError &&
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mt-3 mx-5 mb-5" role="alert">
                            <p>{messageError}</p>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" >
                                <FontAwesomeIcon icon={faTimesCircle} className="cursor-pointer" onClick={handleError} />
                            </span>
                        </div>
                    } */}

                </form>
            </div>
            {
                isOpenSuccess &&
                <Success isOpen={isOpenSuccess} onClose={()=>setIsOpenSuccess(false)}/>
            }
            {
                isError &&
                <ErrorModal isOpen={isError} onClose={()=>setError(false)} message={messageError}/>
            }

{
                isLoading &&
                <Loading isOpen={isLoading} onClose={()=>setIsLoading(false)} />
            }
        </>
    )
}