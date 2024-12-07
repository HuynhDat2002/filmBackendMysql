
import axios from 'axios';
import { LoginValueProps, SignUpValueProps } from '@/types'
import { updateAxiosUserInstanceFilm, updateAxiosUserInstance } from '@/utils/axiosConfig';
interface Token {
    user: { _id: string };
    tokens: string;
}

export const getToken = (): Token => {
    if (typeof window !== "undefined" && localStorage.getItem("user") as string) {
        return JSON.parse(localStorage.getItem("user") as string) as Token;
    }
    return {
        user: { _id: "" },
        tokens: ""
    };
};

// const base_url_user = "http://localhost/user/api"

// const createAxiosUserInstance = (token: Token) => {
//     return axios.create({
//         baseURL: base_url_user,
//         withCredentials: true,
//         headers: {
//             'x-client-id': token.user._id || '',
//             'authorization': token.tokens || '',
//             Accept: "application/json",
//         },
//     });
// };


let axiosUser = updateAxiosUserInstance()

export const checkDevice = async (data: {email:string,password:string}) => {
    try {
        console.log('data check',data)
        await localStorage.setItem('email', data.email);
        const response = await axiosUser.post(`/checkDevice`, {email:data.email,password:data.password});
        // await localStorage.setItem('user', JSON.stringify(response.data.metadata));
        await updateAxiosUserInstance();  // Update the axios instance with new token
        await updateAxiosUserInstanceFilm()
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}

const getEmail = (): string => {
    if (localStorage.getItem('email')) return localStorage.getItem('email') as string
    return ""
}


export const checkLogin = async () => {
    try {
        await updateAxiosUserInstance()
        const response = await axiosUser.post(`/checkLogin`);
        await updateAxiosUserInstance()

        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}

export const logIn = async (data: LoginValueProps) => {
    try {

        const response = await axiosUser.post(`/signIn`, data);
        await localStorage.setItem('user', JSON.stringify(response.data.metadata));
        await updateAxiosUserInstance();  // Update the axios instance with new token
        await updateAxiosUserInstanceFilm()
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}

export const signUp = async () => {
    try {
        const response = await axiosUser.post(`/signUp`);
        console.log('dataaa', response.data)
        await localStorage.setItem('user', JSON.stringify(response.data.metadata));
       await  updateAxiosUserInstance();  // Update the axios instance with new token
       await  updateAxiosUserInstanceFilm()
        return response.data;
    }
    catch (error: any) {
        throw error.response.data
    }
}
export const logout = async () => {
    try {

        const response = await axiosUser.post(`/logout`);
        await localStorage.removeItem("user");
        await updateAxiosUserInstance();  // Update the axios instance after removing token
        await updateAxiosUserInstanceFilm()
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}

export const forgotPassword = async (data: { email: string }) => {
    try {

        const response = await axiosUser.post(`/forgotPassword`, data);
       await localStorage.setItem('email', data.email)
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}

export const verify = async (data: { otp: string }) => {
    try {
        const email = getEmail()
        const response = await axiosUser.post(`/verifyOTP`, {
            email: email,
            otp: data.otp
        });
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}

export const resetPassword = async (data: { password: string, confirmPassword: string }) => {
    try {
        const email = getEmail()
        const response = await axiosUser.post(`/resetPassword`, {
            email: email,
            newPassword: data.password
        });
        if (response)
            localStorage.removeItem('email')
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}


export const sendOTP = async (data: { name: string, email: string, password: string }) => {
    try {
        
        const response = await axiosUser.post(`/sendOTP`, data);
        if (localStorage.getItem('email')) {
            await localStorage.removeItem('email')
        }
        localStorage.setItem('email', data.email)

        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}

export const changePassword = async (data: { password: string, newPassword: string }) => {
    try {
        await updateAxiosUserInstance()
        const response = await axiosUser.post(`/changePassword`, data);
       await updateAxiosUserInstanceFilm()
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}

export const getUser = async () => {
    try {
      await  updateAxiosUserInstance()
        const response = await axiosUser.get(`/getUser`);
        if (localStorage.getItem('userinfo')) {
            await localStorage.removeItem('userinfo')
        }
       await localStorage.setItem('userinfo', JSON.stringify(response.data.metadata))
       await updateAxiosUserInstanceFilm()
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}

export const editUser = async (data: { name: string }) => {
    try {
        await updateAxiosUserInstance()
        const response = await axiosUser.patch(`/editUser`, data);
        if (localStorage.getItem('userinfo')) await localStorage.removeItem('userinfo')

         await localStorage.setItem('userinfo', JSON.stringify(response.data.metadata))
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}