'use strict'
import * as cheerio from 'cheerio'
import { Request, Response, NextFunction } from 'express'
import { SignUpProps, SignInProps, TokenPairProps } from '@/types'
import { errorResponse } from '@/cores'
import crypto, { Sign } from 'crypto'
import { createTokenPair } from '@/auth/util.auth'
import { UpdateFilmProps, QueryProps, FilterPayloadProps } from '@/types'
import { getInfoData } from '@/utils'
import { KeyTokenModelProps, AdminPayloadProps, FilmData } from '@/types'
import axios from 'axios'
import { createClient } from 'redis'
import { updateNestedObjectParser } from '@/utils'
import { update } from 'lodash'
import { uploadImages } from '@/configs/cloudinary.config'
import { RatingProps } from '@/types'
import { UserPayloadProps } from '@/types'
import * as regex from '@/middlewares/regex'
import { prisma } from '@/db/prisma.init'
import { clientRedis } from '@/utils'
import { AppEventListener } from '@/utils/AppEventListener'
import { ElasticSearchService } from './elasticsearch.service'

const elasticSearch = new ElasticSearchService()

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

export const createFilm = async (urlEmbed: { urlEmbed: string, type: string | null }) => {

    //check urlEmbed
    if (! await isAllowedURL(urlEmbed.urlEmbed)) throw new errorResponse.BadRequestError(`Embed link không hợp lệ`)

    //get url parse
    const parseURL = new URL(urlEmbed.urlEmbed)
    const hostname = parseURL.hostname
    console.log('hostname', hostname)

    // get film data
    const filmRaw = await axios.get<FilmData>(urlEmbed.urlEmbed)
    const film = filmRaw.data
    console.log('filmee', film)

    //check film already existed
    const filmFound = await prisma.film.findFirst({ where: { origin_name: film.movie.origin_name as string } })
    if (filmFound) throw new errorResponse.BadRequestError(`This film already existed`)

    // update images based on hostname
    console.log(hostname.includes("phimapi"))
    let thumb_url
    let poster_url
    if (hostname.includes("phimapi")) {
        [thumb_url, poster_url] = await Promise.all([
            uploadImages(film.movie.poster_url, `${film.movie.slug}-thumb`),
            uploadImages(film.movie.thumb_url, `${film.movie.slug}-poster`)
        ]);
    } else {
        [thumb_url, poster_url] = await Promise.all([
            uploadImages(film.movie.thumb_url, `${film.movie.slug}-thumb`),
            uploadImages(film.movie.poster_url, `${film.movie.slug}-poster`)
        ]);
    }

    //clean content of the film
    const $ = cheerio.load(film.movie.content);
    const content = $.text();
    console.log('film', film)
    const episodes = film.episodes[0].server_data.map((data: any) => ({
        name: data.name,
        slug: data.slug,
        video: data.link_m3u8
    }))
    // save film to mysql
    const newfilm = await prisma.film.create({
        data: {
            name: film.movie.name,
            slug: film.movie.slug,
            origin_name: film.movie.origin_name,
            content: content,
            poster_url: poster_url.url,
            thumb_url: thumb_url.url,
            trailer: film.movie.trailer_url,
            time: film.movie.time,
            lang: film.movie.lang,
            year: film.movie.year,
            type: urlEmbed.type ? urlEmbed.type : "movie",
            view: 0,
            actor: {
                create: film.movie.actor.map((actorName) => (
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
                create: film.movie.director.map((directorName) => (
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
                create: film.movie.category.map((categoryName) => (
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
                create: film.movie.country.map((countryName) => (
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

            quality: film.movie.quality,
            episodes: {
                create: episodes
            },
            episode_total: parseInt(film.movie.episode_total as string),

            episode_current: film.movie.episode_current,
            video: film.episodes[0].server_data[0].link_m3u8,
        },
        include: {
            episodes: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    video: true
                }
            },
            actor: {
                select: {
                    actor: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                }
            },
            director: {
                select: {
                    director: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                }
            },
            category: {
                select: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        }
                    },
                }
            },
            country: {
                select: {
                    country: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        }
                    },
                }
            }
        }
    })
    if (!newfilm) throw new errorResponse.BadRequestError(`Cannot create film`)
    const convertfilm = {
        ...newfilm,
        actor: newfilm.actor.map((a:{actor:{id: string, name: string}}) => a.actor),
        director: newfilm.director.map((d:{director:{id: string, name: string}}) => d.director),
        category: newfilm.category.map((c:{category:{id: string, name: string}}) => c.category),
        country: newfilm.country.map((c:{country:{id: string, name: string}}) => c.country),
    }
    if (newfilm) {
        AppEventListener.instance.notify({
            event: 'createFilm',
            data: convertfilm
        })
    }
    return convertfilm
}

export const updateFilm = async ({ filmId, payload }: UpdateFilmProps) => {
    //check input
    const isValidId2 = await filmId.match(regex.idRegex)
    if (isValidId2 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')

    console.log(payload)
    const film = await elasticSearch.getFilm(filmId)
    if (!film) throw new errorResponse.BadRequestError(`Cannot find film`)
    // const payloadParams = await updateNestedObjectParser(payload)
    // const filmUpdated = await .findOneAndUpdate({ id: filmId }, payloadParams, { new: true })
    const update = await prisma.film.update({
        where: {
            id: filmId
        },
        data: payload
    })
    // update on elasticsearch
    AppEventListener.instance.notify({
        event: 'updateFilm',
        data: {
            id: filmId,
            ...payload
        }
    })
    return update
}

export const deleteFilm = async (filmId: string) => {
    //check input
    const isValidId2 = await filmId.match(regex.idRegex)
    if (isValidId2 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')

    // get all actors, directors, categories, countries related to this film
    const actors = await prisma.actor.findMany({ where: { film: { some: { filmId: filmId } } } })
    const directors = await prisma.director.findMany({ where: { film: { some: { filmId: filmId } } } })
    const categories = await prisma.category.findMany({ where: { film: { some: { filmId: filmId } } } })
    const countries = await prisma.country.findMany({ where: { film: { some: { filmId: filmId } } } })

    // delete film
    const film = await prisma.film.findUnique({ where: { id: filmId } })
    if (!film) throw new errorResponse.BadRequestError(`Cannot find film`)
    const filmDeleted = await prisma.film.delete({ where: { id: filmId } })
    if (!filmDeleted) throw new errorResponse.BadRequestError(`Cannot delete film`)

    for (const actor of actors) {
        const filmFound = await prisma.film.findMany({ where: { actor: { some: { actorId: actor.id } } } })
        if (filmFound.length === 0) await prisma.actor.delete({ where: { id: actor.id } })
    }
    for (const category of categories) {
        const filmFound = await prisma.film.findMany({ where: { category: { some: { categoryId: category.id } } } })
        if (filmFound.length === 0) await prisma.category.delete({ where: { id: category.id } })
    }
    for (const director of directors) {
        const filmFound = await prisma.film.findMany({ where: { director: { some: { directorId: director.id } } } })
        if (filmFound.length === 0) await prisma.director.delete({ where: { id: director.id } })
    }
    for (const country of countries) {
        const filmFound = await prisma.film.findMany({ where: { country: { some: { countryId: country.id } } } })
        if (filmFound.length === 0) await prisma.country.delete({ where: { id: country.id } })
    }

    // delete on elasticsearch
    AppEventListener.instance.notify({
        event: 'deleteFilm',
        data: filmId
    })

    return filmDeleted
}

export const getFilm = async (filmId: string) => {
    //check input
    const isValidId2 = await filmId.match(regex.idRegex)
    if (isValidId2 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')


    const filmFound = await elasticSearch.getFilm(filmId)
    if (!filmFound) throw new errorResponse.BadRequestError(`Cannot find this film`)

    const filmUpdateView = await prisma.film.update({
        where: { id: filmId }, data: { view: { increment: 1 } },
    })

    const updatedfilm = await elasticSearch.updateFilm(
        {
            id: filmId,
            view: filmUpdateView.view
        }
    )
    const film = await elasticSearch.getFilm(filmId)



    return film
}

export const ratingFilm = async ({ filmId, userId, rating }: RatingProps) => {
    //check input
    const isValidId1 = await userId.match(regex.idRegex)
    if (isValidId1 === null) throw new errorResponse.BadRequestError('User Id không hợp lệ')
    const isValidId2 = await filmId.match(regex.idRegex)
    if (isValidId2 === null) throw new errorResponse.BadRequestError('Film Id không hợp lệ')

    const filmFound = await elasticSearch.getFilm(filmId)
    if (!filmFound) throw new errorResponse.BadRequestError(`Không tìm thấy film!`)
    // const ratingFound = await prisma.rating.findUnique({ where: { filmId: filmId }, include: { ratings: true } })
    if (!filmFound.rating) {
        let ratingNew = await prisma.rating.create({
            data: {
                film: { connect: { id: filmId } },
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
            select: {
                id: true,
                ratingAverage: true,
                ratings: {
                    select: {
                        ratingNumber: true,
                        userRating: {
                            select: {
                                id: true,
                                userId: true
                            }
                        }
                    }
                }
            }
        });
        AppEventListener.instance.notify({
            event: 'updateFilm',
            data: {
                id: filmFound.id,
                rating: {
                    id: ratingNew.id,
                    ratingAverage: ratingNew.ratingAverage,
                    ratings: ratingNew.ratings
                }

            }
        })
        return ratingNew;
    }
    // if filmFound.rating 
    const updateRating = await prisma.user_Rating.upsert({
        where: {
            ratingId_userRatingId: {
                ratingId: filmFound.rating.id,
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
                    id: filmFound.rating.id
                }
            }
        }
    })

    const ratingUpdated = await prisma.rating.findUnique({ where: { filmId: filmId }, include: { ratings: true } })
    const totalRatings = ratingUpdated?.ratings.reduce((sum: number, r: {
        userRatingId: string,
        ratingNumber: number,
        ratingId: string
    }) => sum + r.ratingNumber, 0);
    const ratingCount = ratingUpdated?.ratings.length;
    if (totalRatings && ratingCount) {
        const updateFinal = await prisma.rating.update({
            where: { id: ratingUpdated.id },
            data: {
                ratingAverage: totalRatings / ratingCount
            },
            select: {
                id: true,
                ratingAverage: true,
                ratings: {
                    select: {
                        ratingNumber: true,
                        userRating: {
                            select: {
                                id: true,
                                userId: true
                            }
                        }
                    }
                }
            }
        })

        await elasticSearch.updateFilm({
            id: filmFound.id,
            rating: updateFinal
        })
    }
    return await elasticSearch.getFilm(filmId)

}

export const getRatings = async ({ filmId }: { filmId: string }) => {

    //check input
    const isValidId1 = await filmId.match(regex.idRegex)
    if (isValidId1 === null) throw new errorResponse.BadRequestError('User Id không hợp lệ')

    const filmFound = await prisma.film.findUnique({ where: { id: filmId } })
    if (!filmFound) throw new errorResponse.BadRequestError(`Không tìm thấy film!`)
    const ratingFound = await prisma.rating.findMany({
        where: { filmId: filmFound.id },
        include: { ratings: true }
    })
    if (!ratingFound) {
        return {
            filmId: "",
            ratings: [],
            ratingAverage: 0
        }
    }
    return ratingFound
}

export const getRatingByFilm = async ({ filmId }: { filmId: string }) => {

    //check input
    const isValidId1 = await filmId.match(regex.idRegex)
    if (isValidId1 === null) throw new errorResponse.BadRequestError('User Id không hợp lệ')

    const filmFound = await elasticSearch.getFilm(filmId)
    if (!filmFound) throw new errorResponse.BadRequestError(`Không tìm thấy film!`)
    if (!filmFound.rating) {
        return {
        ratings: [
            {
                ratingNumber: 0,
                userRating: {
                    id: "",
                    userId: ""
                }
            }
        ],
        id: "",
        ratingAverage: 0
        }
    }
   return filmFound.rating
}

export const getAllFilm = async (query: QueryProps) => {

    // if (query.query) {
    //     //check input
    const isValidQuery = await query.query.match(regex.queryRegex)
    if (isValidQuery === null) throw new errorResponse.BadRequestError('Query không hợp lệ')
    //     // const searchQuery = {
    //     //     $text: {
    //     //         $search: query.query as string
    //     //     }
    //     // };
    //     film = await prisma.film.findMany({
    //         where: {
    //             name: {
    //                 contains: query.query
    //             }
    //         },
    //         include: {
    //             actor: {
    //                 select: {
    //                     actor: {
    //                         select: {
    //                             id: true,
    //                             name: true,
    //                         },
    //                     },
    //                 },
    //             },
    //             director: {
    //                 include: {
    //                     director: true,
    //                 }
    //             },
    //             category: {
    //                 include: {
    //                     category: true,
    //                 }
    //             },
    //             country: {
    //                 include: {
    //                     country: true,
    //                 }
    //             }
    //         }
    //     })
    // }
    // else {
    //     film = await prisma.film.findMany({
    //         where: {
    //             name: {
    //                 contains: query.query
    //             }
    //         },
    //         include: {
    //             actor: {
    //                 select: {
    //                     actor: {
    //                         select: {
    //                             id: true,
    //                             name: true,
    //                         },
    //                     },
    //                 },
    //             },
    //             director: {
    //                 include: {
    //                     director: true,
    //                 }
    //             },
    //             category: {
    //                 include: {
    //                     category: true,
    //                 }
    //             },
    //             country: {
    //                 include: {
    //                     country: true,
    //                 }
    //             }
    //         }

    //     })

    // }
    console.log('length', query.query?.length)
    const film = await elasticSearch.searchFilm(query.query as string, query.page as number)
    return film
}


export const getPageTotal = async () => {
    const count = await elasticSearch.getCount()
    if (!count) throw new errorResponse.BadRequestError(`Cannot get page total`)
    const pageTotal = Math.ceil(count / 2)
    return pageTotal // Assuming 20 items per page
}

export const getPageTotalFilter = async (filter: string) => {
    const count = await elasticSearch.getCount()
    if (!count) throw new errorResponse.BadRequestError(`Cannot get page total`)
    const pageTotal = Math.ceil(count / 2)
    return pageTotal // Assuming 20 items per page
}

export const getPageTotalSearch = async (search: string) => {
    const count = await elasticSearch.getCount()
    if (!count) throw new errorResponse.BadRequestError(`Cannot get page total`)
    const pageTotal = Math.ceil(count / 2)
    return pageTotal // Assuming 20 items per page
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

export const getListCategory = async () => {
    const categoryList = await elasticSearch.getListCategory()
    if (!categoryList) throw new errorResponse.BadRequestError(`Cannot get list category`)
    return categoryList
}

export const getListCountry = async () => {
    const countryList = await elasticSearch.getListCountry()
    if (!countryList) throw new errorResponse.BadRequestError(`Cannot get list category`)
    return countryList
}

export const deleteFilms = async () => {
    await prisma.episodes.deleteMany()
    await prisma.film.deleteMany()
    await prisma.actor.deleteMany()
    await prisma.director.deleteMany()
    await prisma.category.deleteMany()
    await prisma.country.deleteMany()
    await prisma.rating.deleteMany()
    await prisma.user_Rating.deleteMany()
    await elasticSearch.deleteAllFilm()
    await prisma.comment.deleteMany()
    await prisma.commentUser.deleteMany()
    await elasticSearch.deleteIndex()
    return {
        message: "All films deleted successfully"
    }
}

export const filterFilm = async ({ field, data, page }: { field: string, data: string, page: number | null }) => {
    const filterList = await elasticSearch.filter(field, data, page)
    if (!filterList) throw new errorResponse.BadRequestError(`Cannot get filter list`)
    return filterList
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