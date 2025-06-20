export interface LoginProps{
   isOpen:boolean,
   onClose:any,
   openSignUp:()=>void,
   openForgot:()=>void,
   openVerifyDevice:()=>void
}
export interface LoginValueProps{
    email:string,
    password:string,
    tokenCaptcha:string
   
}

export interface SignProps{
    isOpen:boolean,
   onClose:any,
   openLogin:any,
   openVerifySign:()=>void
}

export interface SignUpValueProps{
    name:string,
    email:string,
    password:string,
    confirmPassword:string
}
export interface ForgotProps{
    isOpen:boolean, onClose:()=>void, openLogin:()=>void,openVerify:()=>void
}
export interface ResetProps{
    isOpen:boolean, onClose:()=>void, openLogin:()=>void,openSuccess:()=>void
}
export interface VerifyProps{
    isOpen:boolean, onClose:()=>void, openLogin:()=>void,openReset:()=>void
}

export interface VerifySignProps{
    isOpen:boolean, onClose:()=>void, openLogin:()=>void,openSuccess:()=>void
}
export interface SuccessProps{
    isOpen:boolean, onClose:()=>void, openLogin:()=>void

}

export interface ErrorProps{
    isOpen:boolean, onClose:()=>void,message:string

}

export interface SuccessChangePasswordProps{
    isOpen:boolean, onClose:()=>void

}

export interface ChangePasswordProps{
    isOpen:boolean, onClose:()=>void,openSuccess:()=>void
}

export interface CommentProps{
    comment_left: number,
    comment_right: number,
    comment_content: string,
    comment_parentId: string,
    comment_user:any,
    comment_filmId:string,
    id:string,
    createdAt:any,
    updatedAt:any
}