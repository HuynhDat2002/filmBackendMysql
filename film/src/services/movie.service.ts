'use strict'

import { movieModel } from '@/models/movie.model'
import { Request, Response, NextFunction } from 'express'
import { SignUpProps, SignInProps, TokenPairProps } from '@/types'
import { errorResponse } from '@/cores'
import bcrypt from 'bcrypt'
import crypto, { Sign } from 'crypto'
import { createTokenPair } from '@/auth/util.auth'
import { UpdateMovieProps, QueryProps, FilterPayloadProps } from '@/types'
import { getInfoData } from '@/utils'
import { KeyTokenModelProps, AdminPayloadProps, MovieData } from '@/types'
import axios from 'axios'
import { createClient } from 'redis'
import { updateNestedObjectParser } from '@/utils'
import { update } from 'lodash'
import { uploadImages } from '@/configs/cloudinary.config'
// type MovieData = {
//     movie: {
//         name: string;
//         slug: string;
//         origin_name: string;
//         contain: string;
//         poster_url: string;
//         thumb_url: string;
//         trailer: string;
//         time: string;
//         lang: string;
//         year: number;
//         actor: string;
//         director: string;
//         category: string;
//         country: string;
//         quality: string;
//         episode_current: string;
//     };
//     episodes: Array<{
//         server_data: Array<{
//             link_embed: string;
//         }>
//     }>;
// };

export const createMovie = async (urlEmbed: { urlEmbed: string }) => {
    const parseURL = new URL(urlEmbed.urlEmbed)
    const hostname = parseURL.hostname
    console.log('hostname', hostname)
    const movieRaw: any = await axios.get<MovieData>(urlEmbed.urlEmbed)
    const movie = movieRaw.data
    console.log(movie)

    const movieFound = await movieModel.findOne({ origin_name: movie.movie.origin_name })
if (movieFound) throw new errorResponse.BadRequestError(`This movie already existed`)
    console.log(hostname.includes("phimapi"))
    let thumb_url
    let poster_url
    if (hostname.includes("phimapi")) {
        [thumb_url, poster_url] = await Promise.all([
            uploadImages(movie.movie.poster_url, `${movie.movie.slug}-thumb`, 'movie'),
            uploadImages(movie.movie.thumb_url, `${movie.movie.slug}-poster`, 'movie')
        ]);
    } else {
        [thumb_url, poster_url] = await Promise.all([
            uploadImages(movie.movie.thumb_url, `${movie.movie.slug}-thumb`, 'movie'),
            uploadImages(movie.movie.poster_url, `${movie.movie.slug}-poster`, 'movie')
        ]);
    }
    // if (hostname.includes("phimapi")) {
    //     thumb_url = await uploadImages(movie.movie.poster_url, `${movie.movie.slug}-thumb`, 'movie')
    //     poster_url = await uploadImages(movie.movie.thumb_url, `${movie.movie.slug}-poster`, 'movie')
    // }
    // else{

    //     thumb_url = await uploadImages(movie.movie.thumb_url, `${movie.movie.slug}-thumb`, 'movie')
    //     poster_url = await uploadImages(movie.movie.poster_url, `${movie.movie.slug}-poster`, 'movie')
    // }

    const newMovie = await movieModel.create({
        name: movie.movie.name,
        slug: movie.movie.slug,
        origin_name: movie.movie.origin_name,
        content: movie.movie.content,
        poster_url: poster_url.url,
        thumb_url: thumb_url.url,
        trailer: movie.movie.trailer_url,
        time: movie.movie.time,
        lang: movie.movie.lang,
        year: movie.movie.year,
        actor: movie.movie.actor,
        director: movie.movie.director,
        category: movie.movie.category,
        country: movie.movie.country,
        quality: movie.movie.quality,
        episode_current: movie.movie.episode_current,
        video: movie.episodes[0].server_data[0].link_embed,
    })
    return newMovie
}

export const updateMovie = async ({ movieId, payload }: UpdateMovieProps) => {
    console.log(payload)
    const movie = await movieModel.findOne({ _id: movieId })
    if (!movie) throw new errorResponse.BadRequestError(`Cannot find movie`)
    const payloadParams = await updateNestedObjectParser(payload)
    const movieUpdated = await movieModel.findOneAndUpdate({ _id: movieId }, payloadParams, { new: true })
    return movieUpdated
}


export const deleteMovie = async (movieId: string) => {
    const movie = await movieModel.findOne({ _id: movieId })
    if (!movie) throw new errorResponse.BadRequestError(`Cannot find movie`)
    const movieDeleted = await movieModel.findOneAndDelete({ _id: movieId })
    return movieDeleted
}

export const getMovie = async (movieId: string) => {
    const movie = await movieModel.findOne({ _id: movieId })
    if (!movie) throw new errorResponse.BadRequestError(`Cannot find movie`)

    return movie
}

export const getAllMovie = async (query: QueryProps) => {

    let movie
    let page = 1
    if (query.page) {
        page = parseInt(query.page as string)
    }
    const limit = 16
    const skip = (page - 1) * limit
    if (query.query) {

        const searchQuery = {
            $text: {
                $search: query.query as string
            }
        };
        movie = await movieModel.find(searchQuery)
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
    }
    else {
        movie = await movieModel.find()
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();;

    }

    // // Sorting

    //   const sortBy = query.sort.split(",").join(" ");
    //   query = query.sort(sortBy);

    //   query = query.sort("-createdAt");


    // if (query.fields) {
    //   const fields = query.fields.split(",").join(" ");
    //   console.log('fields',fields)
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }

    return await movie
}

export const filterMoive = async (payload: FilterPayloadProps) => {

}

export const getPayloadAdmin = async (data: AdminPayloadProps) => {
    const client = createClient()
    await client.connect()

    console.log(` i received data: `, data.adminFound)
    await client.set('admin', JSON.stringify(data.adminFound))
    await client.set('keyTokenAdmin', JSON.stringify(data.keyToken))
    return {
        admin: getInfoData(["_id", "name", "email", "role"], data.adminFound),
        keyToke: getInfoData(["user", "publicKey", "refreshToken"], data.keyToken)

    }
}

export const SubscribeEvents = async (payload: string) => {
    const payloadJson = JSON.parse(payload)
    const { event, data } = payloadJson;

    switch (event) {
        case 'GET_ADMIN_PAYLOAD':
            getPayloadAdmin(data)
            break;
        case 'ADD_TO_CART':

            break;
        case 'REMOVE_FROM_CART':

            break;
        case 'CREATE_ORDER':

            break;
        case 'TEST':
            console.log('Working.............')
            break;
        default:
            break;
    }

}