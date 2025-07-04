import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { createComment } from "../lib/features/comment.slice";
import { getCommentByFilm } from "../lib/features/comment.slice";
import { useParams } from 'next/navigation'
import { FaArrowCircleRight } from 'react-icons/fa'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faEnvelope, faLock, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

export default function CommentForm() {
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("")
  const dispatch = useAppDispatch()
  const params = useParams<{ id: string }>()
  const commentState = useAppSelector((state) => state.commentReducer)
  const [isError, setError] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (message !== "") {

      await dispatch(createComment({ filmId: params?.id as string, content: message }))
      setMessage("")

    }

  }

  useEffect(() => {
    if (commentState.isSuccess && commentState.isCreateComment)
      dispatch(getCommentByFilm({ filmId: params?.id as string }))
  }, [commentState.isLoading])

  useEffect(() => {
    if (commentState.isCreateComment) {
      if (commentState.isError && Object.keys(commentState.message).length === 0) { setError(true); setMessageError("Server Error") }
      if (commentState.isError && Object.keys(commentState.message).length > 0) { setError(true); setMessageError(`${commentState.message?.message}`) }
    }
  }, [commentState.isLoading])

  console.log('message:', message)
  const handleError = () => {
    setError(false),
      setMessageError("")
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-5 flex flex-row gap-5 mb-5">
        <input
          autoFocus={false}
          value={message}
          placeholder={`Hãy viết bình luận của bạn tại đây`}
          onChange={e => setMessage(e.target.value)}
          className="border-1 rounded-sm w-full py-2 px-5"
        />
        <button className="btn hover:cursor-pointer hover:text-ctBlue-logo" disabled={false} type="submit">
          {/* {false ? "..." : "POST"} */}
          <FaArrowCircleRight aria-label="posttt" className="text-3xl" />
        </button>
      </div>
      {isError &&
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mt-3 mx-5 mb-5" role="alert">
          <p>{messageError}</p>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" >
            <FontAwesomeIcon icon={faTimesCircle} className="cursor-pointer" onClick={handleError} />
          </span>
        </div>
      }

    </form>
  );
}