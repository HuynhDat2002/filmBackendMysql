'use strict'
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import https from "https";

export const base_url = "https://localhost/film/api"
const base_url_user = "https://localhost/user/api"



interface Token {
    user: { id: string,name:string,role:string };
    tokens: string;
}

// export const getToken = (): Token => {
//     // if (typeof window !== 'undefined'){

//         const user = localStorage.getItem("user") as string;
//         if (user) {
    
//             return JSON.parse(user) as Token;
    
//         }
//     // }
//     // if ( JSON.parse(localStorage.getItem("user") as string)) {
//     //     return JSON.parse(localStorage.getItem("user") as string) as Token;
//     // }
//     return {
//         user: { id: "" },
//         tokens: ""
//     };
// };

export const getToken = (): Token => {
    if (typeof window !== "undefined") {
        const user = localStorage.getItem("user") as string;
        if (user) {
            return JSON.parse(user) as Token;
        }
    }
    return { user: { id: "" ,name:"",role:""}, tokens: "" };
};


const createAxiosUserInstance = (token: Token) => {
    return axios.create({
        baseURL: base_url_user,
    //     httpsAgent: new https.Agent({
    //         rejectUnauthorized: false, // Bỏ qua xác thực SSL
    //    }),
        withCredentials: true,
        headers: {
            'x-client-id': token.user.id || '',
            'authorization': token.tokens || '',
            Accept: "application/json",
        },
    });
};

const createAxiosUserInstanceFilm = (token: Token) => {
    return axios.create({
        baseURL: base_url,
        // httpsAgent: new https.Agent({
        //      rejectUnauthorized: false, // Bỏ qua xác thực SSL
        // }),
        withCredentials: true,
        headers: {
            'x-client-id': token.user.id || '',
            'authorization': token.tokens || '',
            Accept: "application/json",
        },
    });
};



export const updateAxiosUserInstance = () => {
    const axiosUser = createAxiosUserInstance(getToken());
    return axiosUser
};

export const updateAxiosUserInstanceFilm = () => {
    const axios = createAxiosUserInstanceFilm(getToken());
    // console.log('cert',certResponse)
    return axios
};