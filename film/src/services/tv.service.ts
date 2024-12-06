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
import { KeyTokenModelProps, AdminPayloadProps, TVData, RatingProps } from '@/types'
import axios from 'axios'
import { createClient } from 'redis'
import { updateNestedObjectParser } from '@/utils'
import { update } from 'lodash'
import { uploadImages } from '@/configs/cloudinary.config'
import { ratingModel } from '@/models/rating.model'
import { prisma } from '@/db/prisma.init'
import * as regex from '@/middlewares/regex'

const isAllowedURL = async (url: string) => {
    const allowedUrls = [
        {
            hostname: 'ophim1.com',
            path: '/phim'
        },
        {
            hostname: 'phimapi.com',
            path: '/phim'
        }
    ]
    const parseURL = new URL(url)
    console.log(`parseURL`, parseURL)
    const check = allowedUrls.some((url: any) => {
        return url.hostname === parseURL.hostname &&
            parseURL.pathname.startsWith(url.path) === true
    })
    console.log('check', check)
    return check

}
export const createTV = async (urlEmbed: { urlEmbed: string }) => {

    //kiểm tra url hợp lệ
    if (! await isAllowedURL(urlEmbed.urlEmbed)) throw new errorResponse.BadRequestError(`Embed link không hợp lệ`)

    const parseURL = new URL(urlEmbed.urlEmbed)
    const hostname = parseURL.hostname
    console.log('hostname', hostname)
    const tvRaw: any = await axios.get(urlEmbed.urlEmbed)
    const tv = tvRaw.data as TVData
    const tvFound = await prisma.tV.findFirst({ where: { origin_name: tv.movie.origin_name } })

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

    console.log('thumb_url', thumb_url)
    console.log(tv)
    const newMovie = await prisma.tV.create({
        data: {
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
            actor: {
                create: tv.movie.actor.map((actorName) => (
                    {
                        actor: {
                            connectOrCreate: {
                                where: {
                                    name: actorName
                                },
                                create: {

                                    name: actorName
                                }
                            },

                        },

                    }

                ))
            },
            director: {
                create: tv.movie.director.map((directorName) => (
                    {
                        director: {

                            connectOrCreate: {
                                where: {

                                    name: directorName
                                },
                                create: {
                                    name: directorName
                                }
                            },

                        }
                    }
                ))
            },
            category: {
                create: tv.movie.category.map((categoryName) => (
                    {
                        category: {
                            connectOrCreate: {
                                where: {
                                    name: categoryName.name,
                                    slug: categoryName.slug
                                },

                                create: {
                                    name: categoryName.name,
                                    slug: categoryName.slug
                                }
                            },

                        }
                    }
                ))
            },
            country: {
                create: tv.movie.country.map((countryName) => (
                    {
                        country: {

                            connectOrCreate: {
                                where: {

                                    name: countryName.name,
                                    slug: countryName.slug
                                },
                                create: {
                                    name: countryName.name,
                                    slug: countryName.slug
                                }
                            },
                        }
                    }
                ))
            },
            quality: tv.movie.quality,
            episode_current: tv.movie.episode_current,
            episode_total: parseInt(tv.movie.episode_total),
            episodes: {

                create: tv.episodes[0].server_data.map((data: any) => ({
                    name: data.name,
                    slug: data.slug,
                    video: data.link_m3u8
                })),
            }

        },
        include: {
            episodes: true,

        }
    })
    return newMovie
}

// export const updateTV = async ({ movieId, payload }: UpdateMovieProps) => {
//     //check input
//     const isValidId1 = await movieId.match(regex.idRegex)
//     if (isValidId1 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')

//     console.log(payload)
//     const movie = await tvModel.findOne({ id: movieId })
//     if (!movie) throw new errorResponse.BadRequestError(`Cannot find movie`)
//     const payloadParams = await updateNestedObjectParser(payload)
//     const movieUpdated = await tvModel.findOneAndUpdate({ id: movieId }, payloadParams, { new: true })
//     return movieUpdated
// }

export const ratingTV = async ({ filmId, userId, rating }: RatingProps) => {

    //check input
    const isValidId1 = await filmId.match(regex.idRegex)
    if (isValidId1 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')

    const isValidId2 = await userId.match(regex.idRegex)
    if (isValidId2 === null) throw new errorResponse.BadRequestError('User Id không hợp lệ')

    const movieFound = await prisma.tV.findUnique({ where: { id: filmId } })
    if (!movieFound) throw new errorResponse.BadRequestError(`Không tìm thấy film!`)

    const ratingFound = await prisma.rating.findUnique({ where: { tvId: filmId }, include: { ratings: true } })

    if (!ratingFound) {
        let ratingNew = await prisma.rating.create({
            data: {
                tv: { connect: { id: filmId } },
                ratings: {
                    create: {
                        ratingNumber: rating,
                        userRating: {
                            connectOrCreate: {
                                where: {
                                    userId: userId
                                },
                                create: {
                                    userId: userId
                                }
                            }
                        }

                    }
                },
                ratingAverage: rating
            },
            include: {
                ratings: true
            }
        });
        return ratingNew;
    }
    console.log('rating found', ratingFound)
    const updateRating = await prisma.user_Rating.upsert({
        where: {
            ratingId_userRatingId: {
                ratingId: ratingFound.id,
                userRatingId: userId
            }
        },
        update: {
            ratingNumber: rating
        },
        create: {
            userRating: {
                connectOrCreate: {
                    where: {
                        userId: userId
                    },
                    create: {
                        userId: userId
                    }
                }
            },
            ratingNumber: rating,
            rating: {
                connect: {
                    id: ratingFound.id
                }
            }
        }
    })

    const ratingUpdated = await prisma.rating.findUnique({ where: { tvId: filmId }, include: { ratings: true } })
    if (!ratingUpdated) throw new errorResponse.BadRequestError(`Cannot find rating with this filmId`)
    const totalRatings = ratingUpdated.ratings.reduce((sum: number, r: {
        userRatingId: string,
        ratingNumber: number,
        ratingId: string
    }) => sum + r.ratingNumber, 0);
    const ratingCount = ratingUpdated.ratings.length;
    if (totalRatings && ratingCount) {
        await prisma.rating.update({
            where: { id: ratingUpdated.id },
            data: {
                ratingAverage: totalRatings / ratingCount
            }
        })
    }
    return await prisma.rating.findUnique({ where: { tvId: filmId }, include: { ratings: true } })

}

export const getRatings = async ({ filmId }: { filmId: string }) => {
    //check input
    const isValidId1 = await filmId.match(regex.idRegex)
    if (isValidId1 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')

    const movieFound = await prisma.tV.findUnique({ where: { id: filmId } })
    if (!movieFound) throw new errorResponse.BadRequestError(`Không tìm thấy film!`)
    const ratingFound = await prisma.rating.findUnique({ where: { tvId: filmId },include:{ratings:true} })
    if (!ratingFound) {
        return {
            filmId: "",
            ratings: [],
            ratingAverage: 0
        }
    }
    return ratingFound
}
// export const deleteTV = async (movieId: string) => {
//     const isValidId2 = await movieId.match(regex.idRegex)
//     if (isValidId2 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')

//     const tv = await prisma.tV.findUnique({where:{ id: movieId }})
//     if (!tv) throw new errorResponse.BadRequestError(`Không tìm thấy film`)
//     const tvDeleted = await tvModel.findOneAndDelete({ id: movieId })
//     return tvDeleted
// }

export const getTV = async (movieId: string) => {
    //check input
    const isValidId1 = await movieId.match(regex.idRegex)
    if (isValidId1 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')

    const movie = await prisma.tV.findUnique({
        where: { id: movieId },
        include: {
            actor: {
                include: {
                    actor: true,
                }
            },
            director: {
                include: {
                    director: true,
                }
            },
            category: {
                include: {
                    category: true,
                }
            },
            country: {
                include: {
                    country: true,
                }
            },
            episodes: true
        }
    })
    if (!movie) throw new errorResponse.BadRequestError(`Không tìm thấy tvshow`)
    const movieUpdateView = await prisma.tV.update({
        where: { id: movieId }, data: { view: { increment: 1 } },
        include: {
            actor: {
                select: {
                    actor: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            director: {
                include: {
                    director: true,
                }
            },
            category: {
                include: {
                    category: true,
                }
            },
            country: {
                include: {
                    country: true,
                }
            },
            episodes: true
        }
    })

    return movieUpdateView
}

export const getAllTV = async (query: QueryProps) => {

    let tv
    let page = 1
    if (query.page) {
        //check input
        const isValidPage = await query.page.match(regex.pageRegex)
        if (isValidPage === null) throw new errorResponse.BadRequestError('Page không hợp lệ')
        page = parseInt(query.page as string)
    }
    const limit = 20
    const skip = (page - 1) * limit
    if (query.query) {
        //check input
        // const isValidQuery = await query.query.match(regex.queryRegex)
        // if (isValidQuery === null) throw new errorResponse.BadRequestError('Query không hợp lệ')
        // const searchQuery = {
        //     $text: {
        //         $search: query.query as string
        //     }
        // };
        tv = await prisma.tV.findMany({
            where: {
                name: {
                    contains: query.query
                },
                origin_name: {
                    contains: query.query
                }
            },
            include: {
                actor: {
                    select: {
                        actor: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                director: {
                    include: {
                        director: true,
                    }
                },
                category: {
                    include: {
                        category: true,
                    }
                },
                country: {
                    include: {
                        country: true,
                    }
                },
                episodes: true
            }
        })
    }
    else {
        tv = await prisma.tV.findMany({
            where: {
                name: {
                    contains: query.query
                },
                origin_name: {
                    contains: query.query
                }
            },
            include: {
                actor: {
                    select: {
                        actor: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                director: {
                    include: {
                        director: true,
                    }
                },
                category: {
                    include: {
                        category: true,
                    }
                },
                country: {
                    include: {
                        country: true,
                    }
                },
                episodes: true
            }

        })

    }



    return tv
}


export const getPageTotal = async () => {
    const movies = await prisma.tV.findMany()
    return {
        tvLength: movies.length
    }
}
export const filterMoive = async (payload: FilterPayloadProps) => {

}

