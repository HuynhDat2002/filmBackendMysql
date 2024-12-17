'use client'

import React, { useState, useEffect } from "react"
import Image from 'next/image'
import { userList, deleteUser } from "@/lib/features/user.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { FaHeart, FaReply, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'
import AskSure from "@/components/AskSure";
import Loading from "@/components/LoadingModal";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/table";
import AlertInfo from '@/components/Alert';


export default function UserList() {
  const dispatch = useAppDispatch()
  const selector = useAppSelector(state => state.userReducer)

  const [infoAlert, setInfoAlert] = useState("")
  const [colorAlert, setColorAlert] = useState("")
  const [ask, setAsk] = useState(false)
  const [idUser, setId] = useState("")
  const [isDelete, setIsDelete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAlert, setIsAlert] = useState(false)

  useEffect(() => {
    dispatch(userList())
  }, [])
  const listUser = selector.userList.metadata ? selector.userList.metadata : [{
    id: "",
    name: "",
    email: "",
    status: "",
    createdAt: "",
    updatedAt: "",
    failedLogin: 0,
    timeLock: ""
  }]

  console.log('userlist', listUser)

  const getKeyValue = (row: any, columnKey: any) => {
    console.log('column key', columnKey);
    return row[columnKey];
  }
  const handleDeleteComment = async (id: string) => {
    // dispatch(deleteUser({ userId: id }))
    setIsDelete(true)
    setId(id)

  }
  useEffect(() => {
    console.log('iduser', idUser)

  }, [isDelete])

  // useEffect(() => {
  //   if (selector.isSuccess && selector.isDeleteUser) { 
  //     setInfoAlert("Delete User Successfully"); 
  //     setColorAlert("success"); 
  //     dispatch(userList())
  //   }
  //   if (selector.isError && selector.isDeleteUser) { 
  //     setInfoAlert("Delete User Error"); 
  //     setColorAlert("danger"); 
  //   }

  // }, [selector.isDeleteUser])
  useEffect(() => {
    if (selector.isSuccess && selector.isDeleteUser) {
      setIsAlert(true)
      setInfoAlert("Delete User Successfully");
      setColorAlert("success");
      dispatch(userList())
    }
    if (selector.isError && selector.isDeleteUser) {
      setIsAlert(true)
      setInfoAlert("Delete User Error");
      setColorAlert("danger");
    }
   
      if(selector.isDeleteUser) {

        if (selector.isLoading) setIsLoading(true)
        if (!selector.isLoading) setIsLoading(false)
      }
  }, [selector.isDeleteUser])
  
  return (

    <>
    {/* <div className="w-[90%] z-0"> */}

      <Table aria-label="Example table with dynamic content" className="mx-2 px-2 my-10 h-screen">
        <TableHeader className="font-bold">
          <TableColumn key='id'>ID</TableColumn>
          <TableColumn key='name'>Name</TableColumn>
          <TableColumn key='email'>Email</TableColumn>
          <TableColumn key='createdAt'>Created Time</TableColumn>
          <TableColumn key='updatedAt'>Updated Time</TableColumn>
          <TableColumn key='status'>status</TableColumn>
          <TableColumn key='failedLogin'>failedLogin</TableColumn>
          <TableColumn key='timeLock'>timeLock</TableColumn>
          <TableColumn key=''> </TableColumn>

        </TableHeader>
        <TableBody items={listUser}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.createdAt}</TableCell>
              <TableCell>{item.updatedAt}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.failedLogin}</TableCell>
              <TableCell>{item.timeLock}</TableCell>
              <TableCell>
                <button onClick={() => handleDeleteComment(item.id)}>
                  <FaTrash
                    aria-label="Delete"
                    style={{
                      color: "red",
                    }}
                  />
                </button>
              </TableCell>

            </TableRow>
          )}
        </TableBody>
      </Table>
    {/* </div> */}

      {isDelete && (
        <div className="">

          {/* <AlertInfo info={infoAlert} color={colorAlert} close={() => setIsDelete(false)} /> */}
          <AskSure isOpen={isDelete} onClose={() => setIsDelete(false)} service="deleteUser" data={idUser} />
        </div>
      )}
      {
        isLoading &&
        <Loading isOpen={isLoading} onClose={() => setIsLoading(false)} />
      }
      { isAlert && 
        <div className="">

          <AlertInfo info={infoAlert} color={colorAlert} close={() => setIsAlert(false)} />
          {/* <AskSure isOpen={isDelete} onClose={() => setIsDelete(false)} service="deleteUser" data={idUser} /> */}
        </div>
      }
    </>
  )
}