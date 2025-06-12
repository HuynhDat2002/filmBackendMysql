'use strict'
import * as cheerio from 'cheerio'
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
import { RatingProps } from '@/types'
import { ratingModel } from '@/models/rating.model'
import { UserPayloadProps } from '@/types'
import * as regex from '@/middlewares/regex'
import { prisma } from '@/db/prisma.init'
import { clientRedis } from '@/utils'

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

export const createMovie = async (urlEmbed: { urlEmbed: string }) => {

    //kiểm tra url hợp lệ
    if (! await isAllowedURL(urlEmbed.urlEmbed)) throw new errorResponse.BadRequestError(`Embed link không hợp lệ`)

    const parseURL = new URL(urlEmbed.urlEmbed)
    const hostname = parseURL.hostname
    console.log('hostname', hostname)
    const movieRaw = await axios.get<MovieData>(urlEmbed.urlEmbed)
    const movie = movieRaw.data
    console.log('movieee', movie)
    const movieFound = await prisma.movie.findFirst({ where: { origin_name: movie.movie.origin_name as string } })
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
   
    const $ = cheerio.load(movie.movie.content);
    const content = $.text();

    console.log('movie', movie)

    const newMovie = await prisma.movie.create({
        data: {
            name: movie.movie.name,
            slug: movie.movie.slug,
            origin_name: movie.movie.origin_name,
            content: content,
            poster_url: poster_url.url,
            thumb_url: thumb_url.url,
            trailer: movie.movie.trailer_url,
            time: movie.movie.time,
            lang: movie.movie.lang,
            year: movie.movie.year,
            view: 0,
            actor: {
                create: movie.movie.actor.map((actorName) => (
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
                create: movie.movie.director.map((directorName) => (
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
                create: movie.movie.category.map((categoryName) => (
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
                create: movie.movie.country.map((countryName) => (
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
            quality: movie.movie.quality,
            episode_current: movie.movie.episode_current,
            video: movie.episodes[0].server_data[0].link_m3u8,
        }
    })
    return newMovie
}

export const updateMovie = async ({ movieId, payload }: UpdateMovieProps) => {
    //check input
    const isValidId2 = await movieId.match(regex.idRegex)
    if (isValidId2 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')

    console.log(payload)
    const movie = await movieModel.findOne({ id: movieId })
    if (!movie) throw new errorResponse.BadRequestError(`Cannot find movie`)
    const payloadParams = await updateNestedObjectParser(payload)
    const movieUpdated = await movieModel.findOneAndUpdate({ id: movieId }, payloadParams, { new: true })
    return movieUpdated
}

export const deleteMovie = async (movieId: string) => {
    //check input
    const isValidId2 = await movieId.match(regex.idRegex)
    if (isValidId2 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')
    
    // lay danh sach lien quan
    const actors = await prisma.actor.findMany({ where: { movie: { some: { movieId: movieId } } } })
    const directors = await prisma.director.findMany({ where: { movie: { some: { movieId: movieId } } } })
    const categories = await prisma.category.findMany({ where: { movie: { some: { movieId: movieId } } } })
    const countries = await prisma.country.findMany({ where: { movie: { some: { movieId: movieId } } } })

    // xoa movie
    const movie = await prisma.movie.findUnique({ where: { id: movieId } })
    if (!movie) throw new errorResponse.BadRequestError(`Cannot find movie`)
    const movieDeleted = await prisma.movie.delete({ where: { id: movieId } })
    if (!movieDeleted) throw new errorResponse.BadRequestError(`Cannot delete movie`)
    
    for (const actor of actors){
        const movieFound = await prisma.movie.findMany({where:{actor:{some:{actorId:actor.id}}}})
        if(movieFound.length===0) await prisma.actor.delete({where:{id:actor.id}})
    }   
    for (const category of categories) {
        const movieFound = await prisma.movie.findMany({where:{category:{some:{categoryId:category.id}}}})
        if(movieFound.length===0) await prisma.category.delete({where:{id:category.id}})
    } 
    for (const director of directors){
        const movieFound = await prisma.movie.findMany({where:{director:{some:{directorId:director.id}}}})
        if(movieFound.length===0) await prisma.director.delete({where:{id:director.id}})
    } 
    for (const country of countries){
        const movieFound = await prisma.movie.findMany({where:{country:{some:{countryId:country.id}}}})
        if(movieFound.length===0) await prisma.country.delete({where:{id:country.id}})
    } 

    return movieDeleted
}

export const getMovie = async (movieId: string) => {
    //check input
    const isValidId2 = await movieId.match(regex.idRegex)
    if (isValidId2 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')

    const movie = await prisma.movie.findUnique({
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
            }
        }
    })
    if (!movie) throw new errorResponse.BadRequestError(`Không tìm thấy movie`)
    const movieUpdateView = await prisma.movie.update({
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
            }
        }
    })

    return movieUpdateView
}

export const ratingMovie = async ({ filmId, userId, rating }: RatingProps) => {
    //check input
    const isValidId1 = await userId.match(regex.idRegex)
    if (isValidId1 === null) throw new errorResponse.BadRequestError('User Id không hợp lệ')
    const isValidId2 = await filmId.match(regex.idRegex)
    if (isValidId2 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')

    const movieFound = await prisma.movie.findUnique({ where: { id: filmId } })
    if (!movieFound) throw new errorResponse.BadRequestError(`Không tìm thấy movie!`)
    const ratingFound = await prisma.rating.findUnique({ where: { movieId: filmId }, include: { ratings: true } })
    if (!ratingFound) {
        let ratingNew = await prisma.rating.create({
            data: {
                movie: { connect: { id: filmId } },
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
    const ratingUpdated = await prisma.rating.findUnique({ where: { movieId: filmId }, include: { ratings: true } })
    if (!ratingUpdated) throw new errorResponse.BadRequestError(`Cannot find rating with this filmId`)
    const totalRatings = ratingUpdated?.ratings.reduce((sum: number, r: {
        userRatingId: string,
        ratingNumber: number,
        ratingId: string
    }) => sum + r.ratingNumber, 0);
    const ratingCount = ratingUpdated?.ratings.length;
    if (totalRatings && ratingCount) {
        await prisma.rating.update({
            where: { id: ratingUpdated.id },
            data: {
                ratingAverage: totalRatings / ratingCount
            }
        })
    }
    return await prisma.rating.findUnique({ where: { movieId: filmId }, include: { ratings: true } })

}

export const getRatings = async ({ filmId }: { filmId: string }) => {

    //check input
    const isValidId1 = await filmId.match(regex.idRegex)
    if (isValidId1 === null) throw new errorResponse.BadRequestError('User Id không hợp lệ')

    const movieFound = await prisma.movie.findUnique({ where: { id: filmId } })
    if (!movieFound) throw new errorResponse.BadRequestError(`Không tìm thấy movie!`)
    const ratingFound = await prisma.rating.findMany({ where: { movieId: movieFound.id }, include: { ratings: true } })
    if (!ratingFound) {
        return {
            filmId: "",
            ratings: [],
            ratingAverage: 0
        }
    }
    return ratingFound
}

export const getAllMovie = async (query: QueryProps) => {
    let movie
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
        movie = await prisma.movie.findMany({
            where: {
                name: {
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
                }
            }
        })
    }
    else {
        movie = await prisma.movie.findMany({
            where: {
                name: {
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
                }
            }

        })

    }
    return movie
}


export const getPageTotal = async () => {
    const movies = await prisma.movie.findMany()
    return {
        movieLength: movies.length
    }
}


export const getPayloadAdmin = async (data: AdminPayloadProps) => {
    const client = await clientRedis()
    await client.connect()


    console.log(` i received data: `, data.adminFound)
    await client.set('admin', JSON.stringify(data.adminFound))
    await client.set('keyTokenAdmin', JSON.stringify(data.keyToken))
    return {
        admin: getInfoData(["id", "name", "email", "role"], data.adminFound),
        keyToke: getInfoData(["user", "publicKey", "refreshToken"], data.keyToken)

    }
}

export const getPayloadUser = async (data: UserPayloadProps) => {

    const client = await clientRedis()

    await client.connect()
    // await client.on()

    // await redisClient.connect()
    console.log(` i received data login: `, data.userFound)
    // await client.set('user', JSON.stringify(data.userFound))
    // await client.set('keyTokenUser', JSON.stringify(data.keyToken))
    // await client.set('agent', JSON.stringify(data.agent))
    if (await prisma.userLogin.findUnique({ where: { userId: data.userFound.id as string } })) {
        await prisma.userLogin.update({
            where: {
                userId: data.userFound.id
            },
            data: {
                user: JSON.stringify(data.userFound),
                keyToken: JSON.stringify(data.keyToken),
                agent: JSON.stringify(data.agent)
            }
        })
    }
    else {
        await prisma.userLogin.create({
            data: {
                userId: data.userFound.id as string,
                user: JSON.stringify(data.userFound),
                keyToken: JSON.stringify(data.keyToken),
                agent: JSON.stringify(data.agent)
            }
        })

    }
    return {
        user: getInfoData(["id", "name", "email", "role"], data.userFound),
        keyToke: getInfoData(["user", "publicKey", "refreshToken"], data.keyToken),
        agent: data.agent

    }
}

export const logoutuser = async (data: { userId: string }) => {


    console.log(` i received data logout: `, data.userId)
    const del = await prisma.userLogin.findUnique({ where: { userId: data.userId } })
    if (del) {
        await prisma.userLogin.delete({ where: { userId: data.userId } })
    }
    console.log('del', del)
    // }
    // return {
    //     user: getInfoData(["id", "name", "email", "role"], data.userFound),
    //     keyToke: getInfoData(["user", "publicKey", "refreshToken"], data.keyToken),
    //     agent:data.agent

    // }
    return del
}

export const SubscribeEvents = async (payload: string) => {
    const payloadJson = JSON.parse(payload)
    const { event, data } = payloadJson;

    switch (event) {
        case 'GET_ADMIN_PAYLOAD':
            getPayloadAdmin(data)
            break;
        case 'GET_USER_PAYLOAD':
            getPayloadUser(data)
            break;
        case 'LOGOUT':
            logoutuser(data)
            break;
        default:
            break;
    }

}