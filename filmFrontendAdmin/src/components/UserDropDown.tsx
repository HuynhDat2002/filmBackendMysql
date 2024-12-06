import React,{useEffect} from "react";
import { useAppDispatch,useAppSelector } from "@/lib/hooks";
import { logout } from "@/lib/features/user.slice";
import {useRouter} from 'next/navigation'
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User} from "@nextui-org/react";
export default function UserDropDown({isChangePassword,setIsChangePassword}:{isChangePassword:boolean,setIsChangePassword:any}) {
  const user: any = useAppSelector((state) => state.userReducer)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const handleLogout = ()=>{
      dispatch(logout())
  }
  const handleChangePassword = ()=>{
    setIsChangePassword(true)
  }
  useEffect(()=>{
    if(user.isSuccess && user.isLogout) window.location.reload()
  },[user.isLoading])
  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger className="flex">
          <Avatar
            isBordered
            as="button"
            className="transition-transform ml-3 w-[30px] h-[30x]"
            src="https://res.cloudinary.com/dqefffvgt/image/upload/v1720285733/zl9bhilt3dpsmx8wfmyz.png"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="settings" onClick={()=>router.push('/info')}>
            Thông tin cá nhân
          </DropdownItem>
          <DropdownItem key="changepassword" onClick={handleChangePassword}>
            Đổi mật khẩu
          </DropdownItem>
       
          <DropdownItem key="logout" color="danger" onClick={handleLogout}>
            Đăng xuất
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

    </div>
  );
}