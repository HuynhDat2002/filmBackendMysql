import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export const base_url = "http://localhost:8080/film/api"
const base_url_user = "http://localhost:8080/admin/api"


interface Token {
    user: { id: string,name:string,role:string };
    tokens: {accessToken:string,refreshToken:string};
}

export const getToken = (): Token => {
    if (typeof window !== "undefined") {
        const user = localStorage.getItem("user") as string;
        if (user) {
            return JSON.parse(user) as Token;
        }
    }
    
    return {
        user: { id: "",name:"",role:"" },
        tokens: {accessToken:"",refreshToken:""}
    };
};


const createAxiosUserInstance = (token: Token) => {
    return axios.create({
        baseURL: base_url_user,
        withCredentials: true,
        headers: {
            'x-client-id': token.user.id || '',
            'authorization': token.tokens.accessToken || '',
            Accept: "application/json",
        },
    });
};

const createAxiosUserInstanceFilm = (token: Token) => {
    return axios.create({
        baseURL: base_url,
        withCredentials: true,
        headers: {
            'x-client-id': token.user.id || '',
            'authorization': token.tokens.accessToken || '',
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
    return axios
};