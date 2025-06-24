'use strict'
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import https from "https";
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
const base_url = "http://localhost:8080/film/api"
const base_url_user = "http://localhost:8080/user/api"



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
        const user = localStorage.getItem("user") as string;
        if (user) {
            return JSON.parse(user) as Token;
        }
    return { user: { id: "" ,name:"",role:""}, tokens: "" };
};


const createAxiosUserInstance =async (token: Token) => {
    return axios.create({
        
        baseURL: base_url_user,
  
        withCredentials: true,
        headers: {
            'x-client-id': token.user.id || '',
            'authorization': token.tokens || '',
            Accept: "application/json",
        },
    });
};

const createAxiosUserInstanceFilm =async (token: Token) => {
    


    return axios.create({
        // httpsAgent: new https.Agent({
        //     ca: cert, 
        // }),
        baseURL: base_url,
  
        withCredentials: true,
        headers: {
            'x-client-id': token.user.id || '',
            'authorization': token.tokens || '',
            Accept: "application/json",
        },
    });
};



export const updateAxiosUserInstance =async () => {
    const axiosUser =await createAxiosUserInstance(getToken());
    return axiosUser
};

export const updateAxiosUserInstanceFilm =async () => {
    const axios =await createAxiosUserInstanceFilm(getToken());
    // console.log('cert',certResponse)
    return axios
};