'use strict'

import { tvModel } from '@/models/tv.model'
import { Request, Response, NextFunction } from 'express'
import { SignUpProps, SignInProps, TokenPairProps } from '@/types'
import { errorResponse } from '@/cores'
import bcrypt from 'bcrypt'
import crypto, { Sign } from 'crypto'
import { createTokenPair } from '@/auth/util.auth'
import { UpdateMovieProps, QueryProps, FilterPayloadProps } from '@/types'
import { getInfoData } from '@/utils'
import { KeyTokenModelProps, AdminPayloadProps, TVData,RatingProps } from '@/types'
import axios from 'axios'
import { createClient } from 'redis'
import { updateNestedObjectParser } from '@/utils'
import { update } from 'lodash'
import { uploadImages } from '@/configs/cloudinary.config'
import { ratingModel } from '@/models/rating.model'
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

export const createTV = async (urlEmbed: { urlEmbed: string }) => {
    const parseURL = new URL(urlEmbed.urlEmbed)
    const hostname = parseURL.hostname
    console.log('hostname', hostname)
    const tvRaw: any = await axios.get(urlEmbed.urlEmbed)
    const tv = tvRaw.data as TVData
    const tvFound = await tvModel.findOne({ origin_name: tv.movie.origin_name })

    if (tvFound) throw new errorResponse.BadRequestError(`This tvshow already existed`)
    let thumb_url
    let poster_url
    if (hostname.includes("phimapi")) {
        [thumb_url, poster_url] = await Promise.all([
            uploadImages(tv.movie.poster_url, `${tv.movie.slug}-thumb`, 'movie'),
            uploadImages(tv.movie.thumb_url, `${tv.movie.slug}-poster`, 'movie')
        ]);
    } else {
        [thumb_url, poster_url] = await Promise.all([
            uploadImages(tv.movie.thumb_url, `${tv.movie.slug}-thumb`, 'movie'),
            uploadImages(tv.movie.poster_url, `${tv.movie.slug}-poster`, 'movie')
        ]);
    }
    // if (hostname.includes("phimapi")) {
    //     thumb_url =await  uploadImages(tv.movie.poster_url, `${tv.movie.slug}-thumb`, 'movie')
    //     poster_url =await  uploadImages(tv.movie.thumb_url, `${tv.movie.slug}-poster`, 'movie')
    // }
    // else{

    //     thumb_url = await uploadImages(tv.movie.thumb_url, `${tv.movie.slug}-thumb`, 'movie')
    //     poster_url =await  uploadImages(tv.movie.poster_url, `${tv.movie.slug}-poster`, 'movie')
    // }
    console.log('thumb_url',thumb_url)
    console.log(tv)
    const newMovie = await tvModel.create({
        name: tv.movie.name,
        slug: tv.movie.slug,
        origin_name: tv.movie.origin_name,
        content: tv.movie.content,
        poster_url: poster_url.url,
        thumb_url: thumb_url.url,
        trailer: tv.movie.trailer_url,
        time: tv.movie.time,
        lang: tv.movie.lang,
        year: tv.movie.year,
        actor: tv.movie.actor,
        director: tv.movie.director,
        category: tv.movie.category,
        country: tv.movie.country,
        quality: tv.movie.quality,
        episode_current: tv.movie.episode_current,
        episode_total: parseInt(tv.movie.episode_total),
        episodes: tv.episodes[0].server_data.map((data: any) => ({
            name: data.name,
            slug: data.slug,
            video: data.link_embed
        })),

    })
    return newMovie
}

export const updateTV = async ({ movieId, payload }: UpdateMovieProps) => {
    console.log(payload)
    const movie = await tvModel.findOne({ _id: movieId })
    if (!movie) throw new errorResponse.BadRequestError(`Cannot find movie`)
    const payloadParams = await updateNestedObjectParser(payload)
    const movieUpdated = await tvModel.findOneAndUpdate({ _id: movieId }, payloadParams, { new: true })
    return movieUpdated
}

export const ratingTV = async ({filmId,userId,rating}:RatingProps) => {
    const movieFound = await tvModel.findOne({_id:filmId})
    if(!movieFound) throw new errorResponse.BadRequestError(`Không tìm thấy movie!`)
 
     const ratingFound = await ratingModel.findOne({filmId:filmId})
     // if(!ratingFound) return  await ratingModel.create({
     //     filmId:filmId,
     //     $push:{
     //         ratings:{
     //             userId:userId,
     //             rating:rating,
     //         }
     //     }
     // })
     if(!ratingFound){
         let ratingNew = await ratingModel.create({
             filmId: filmId,
             ratings: [{
                 userId: userId,
                 rating: rating 
             }],
             ratingAverage:rating
         });
         return ratingNew;
     }
     const userRating = ratingFound.ratings.find((r:any) => r.userId.toString() === userId.toString());
     if (userRating) {
         userRating.rating = rating; // Đảm bảo rating là số hợp lệ
     } else {
         // Nếu người dùng chưa đánh giá, thêm đánh giá mới
         ratingFound.ratings.push({
             userId: userId,
             rating: rating // Đảm bảo rating là số hợp lệ
         });
     }
     const totalRatings = ratingFound.ratings.reduce((sum: number, r: any) => sum + r.rating, 0);
     const ratingCount = ratingFound.ratings.length;
     ratingFound.ratingAverage = totalRatings / ratingCount;
     await ratingFound.save()
     return ratingFound
 
  }

  export const getRatings = async ({ filmId }: { filmId: string }) => {
    const movieFound = await tvModel.findOne({ _id: filmId })
    if (!movieFound) throw new errorResponse.BadRequestError(`Không tìm thấy movie!`)
    const ratingFound = await ratingModel.findOne({ filmId: filmId })
    if (!ratingFound) {
        return {
            filmId:"",
            ratings:[],
            ratingAverage:0
        }
    }
    return ratingFound
}
export const deleteTV = async (movieId: string) => {
    const tv = await tvModel.findOne({ _id: movieId })
    if (!tv) throw new errorResponse.BadRequestError(`Cannot find movie`)
    const tvDeleted = await tvModel.findOneAndDelete({ _id: movieId })
    return tvDeleted
}

export const getTV = async (movieId: string) => {
    const movie = await tvModel.findOne({ _id: movieId })
    if (!movie) throw new errorResponse.BadRequestError(`Không tìm thấy tvshow`)

    return movie
}

export const getAllTV = async (query: QueryProps) => {
    let tv
    let page = 1
    if (query.page) {
        page = parseInt(query.page as string)
    }
    const limit = 16
    const skip = (page - 1) * limit
    if (query.page) {

        const searchQuery = {
            $text: {
                $search: query.query as string
            }
        };
        tv = await tvModel.find(searchQuery)
            .sort({ updateAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
    }
    else {
        tv = await tvModel.find()
            .sort({ updateAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();;

    }

  

    return await tv
}



export const filterMoive = async (payload: FilterPayloadProps) => {

}

