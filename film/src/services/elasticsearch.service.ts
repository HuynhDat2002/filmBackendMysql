
import 'dotenv/config'
import { Client } from '@elastic/elasticsearch'
import { EventPayload } from '@/utils/AppEventListener'
import { errorResponse } from '@/cores'
import { getRatingByFilm } from './film.service';
import { FilmType } from "@/types"
export class ElasticSearchService {
    private indexName = "film"
    private client: Client
    constructor() {
        this.client = new Client({
            node: process.env.ELASTICSEARCH_URL,
            maxRetries: 10,
            requestTimeout: 10000,
        })
        this.createIndex()
    }


    async handleEvents({ event, data }: EventPayload) {
        switch (event) {
            case "createFilm":
                await this.createFilm(data as any)
                console.log("createFilm event received elasticsearch")
                break;
            case "updateFilm":
                await this.updateFilm(data as any)
                console.log("updateFilm event received elasticsearch")
                break;
            case "deleteFilm":
                await this.deleteFilm(data as string)
                console.log("deleteFilm event received elasticsearch")
                break;
        }
    }


    async createIndex() {
        const indexMovie = await this.client.indices.exists({ index: this.indexName })
        if (!indexMovie) {
            console.log("Index does not exist, creating index:", this.indexName);
            await this.client.indices.create({
                index: this.indexName,
                body: {
                    mappings: {
                        properties: {
                            id: { type: "keyword" },
                            name: { type: "text" },
                            slug: { type: "text" },
                            origin_name: { type: "text" },
                            content: { type: "text" },
                            poster_url: { type: "text" },
                            thumb_url: { type: "text" },
                            trailer: { type: "text" },
                            time: { type: "text" },
                            lang: { type: "text" },
                            year: { type: "integer" },
                            view: { type: "integer" },
                            quality: { type: "text" },
                            episode_current: { type: "text" },
                            episode_total: { type: "integer" },
                            episodes: {
                                type: "nested",
                                properties: {
                                    id: { type: "keyword" },
                                    name: { type: "text" },
                                    slug: { type: "keyword" },
                                    video: { type: "text" },

                                }
                            },
                            video: { type: "text" },
                            type: { type: "keyword" },

                            actor: {
                                type: "nested",
                                properties: {
                                    id: { type: "keyword" },
                                    name: { type: "text" }
                                }
                            },

                            director: {
                                type: "nested",

                                properties: {
                                    id: { type: "keyword" },
                                    name: { type: "text" }
                                }

                            },

                            category: {
                                type: "nested",

                                properties: {
                                    id: { type: "keyword" },
                                    name: { type: "text" },
                                    slug: { type: "keyword" },
                                }

                            },
                            country: {
                                type: "nested",
                                properties: {
                                    id: { type: "keyword" },
                                    name: { type: "text" },
                                    slug: { type: "keyword" },
                                }

                            },
                            rating: {
                                properties: {
                                    id: { type: "keyword" },
                                    ratingAverage: { type: "float" },
                                    ratings: {
                                        type: "nested",
                                        properties: {
                                            ratingNumber: { type: "integer" },
                                            userRating: {
                                                type: "nested",
                                                properties: {
                                                    id: { type: "keyword" },
                                                    userId: { type: "keyword" },
                                                }
                                            },
                                        }
                                    }
                                }
                            },
                            comment: {
                                type: "nested",
                                properties: {
                                    id: { type: "keyword" },
                                    comment_content: { type: "text" },
                                    comment_left: { type: "integer" },
                                    comment_right: { type: "integer" },
                                    comment_parentId: { type: "keyword" },
                                    isDeleted: { type: "boolean" },
                                    createdAt: { type: "date" },
                                    updatedAt: { type: "date" },
                                    comment_user: {
                                        properties:{
                                            id:{type:"keyword"},
                                            userId:{type:"keyword"},
                                            name:{type:"text"},
                                            email:{type:"keyword"},
                                            role:{type:"keyword"},
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
            })
        }


    }

    async putMapping() {
        const result = await this.client.indices.putMapping({
            index: this.indexName,
            body: {
                properties: {
                    comment: {
                        type: "nested",
                        properties: {
                            id: { type: "keyword" },
                            comment_content: { type: "text" },
                            comment_left: { type: "integer" },
                            comment_right: { type: "integer" },
                            comment_parentId: { type: "keyword" },
                            isDeleted: { type: "boolean" },
                            createdAt: { type: "date" },
                            updatedAt: { type: "date" },
                            comment_user: {

                            }
                        }
                    }
                }
            }
        })
    }
    async deleteIndex() {
        await this.client.indices.delete({
            index: 'film'
        });
        console.log("Index deleted successfully");
    }
    async createFilm(data: any) {
        const result = await this.client.index({
            index: this.indexName,
            id: data.id.toString(),
            document: data

        })
        console.log("film created in elasticsearch", result)

    }

    async updateFilm(data: any) {
        console.log('data updatefilm', data)
        const result = await this.client.update({
            index: this.indexName,
            id: data.id.toString(),
            doc: data
        })
        console.log("film updated in elasticsearch", result)
    }
    async deleteFilm(id: string) {
        const result = await this.client.delete({
            index: this.indexName,
            id: id.toString(),
        })
        console.log("film deleted in elasticsearch", result)
    }
    async searchFilm(search: string, page: number) {
        const from = (page - 1) * 20

        const result = await this.client.search({
            index: this.indexName,
            query: search.length === 0 ? {
                match_all: {}
            } : {
                multi_match: {
                    query: search,
                    fields: ["name", "slug", "origin_name"]
                }
            },
            sort: [
                {
                    year: {
                        order: "desc"
                    }
                }
            ],
            size: 20,
            from: from

        })

        const count = await this.client.count({
            index: this.indexName,
            query: search.length === 0 ? {
                match_all: {}
            } : {
                multi_match: {
                    query: search,
                    fields: ["name", "slug", "origin_name"]
                }
            }

        })
        return {
            films: result.hits.hits.map((hit) => hit._source),
            pageTotal: Math.ceil(count.count / 20)
        }
    }

    async deleteAllFilm() {
        const result = await this.client.deleteByQuery({
            index: this.indexName,
            query: {
                match_all: {}
            }
        })
        console.log("all films deleted in elasticsearch", result)
        return result
    }

    async filter(field: string, data: string, page: number | null) {
        if (!page) page = 1
        const from = (page - 1) * 20

        if (field !== "type") {
            const result = await this.client.search({
                index: this.indexName,
                query: {
                    nested: {
                        path: field,
                        query: {
                            term: {
                                [`${field}.slug`]: data
                            }
                        }
                    }
                },
                sort: [
                    {
                        year: {
                            order: "desc"
                        }
                    }
                ],
                size: 20,
                from: from

            })
            const count = await this.client.count({
                index: this.indexName,
                query: {
                    nested: {
                        path: field,
                        query: {
                            term: {
                                [`${field}.slug`]: data
                            }
                        }
                    }
                },
            })
            return {
                films: result.hits.hits.map((hit) => hit._source),
                pageTotal: Math.ceil(count.count / 20)
            }
        }
        else {
            const result = await this.client.search({
                index: this.indexName,
                query: {
                    term: {
                        type: data
                    }
                },
                sort: [
                    {
                        year: {
                            order: "desc"
                        }
                    }
                ],
                size: 20,
                from: from
            })
            const count = await this.client.count({
                index: this.indexName,
                query: {
                    term: {
                        type: data
                    }
                }


            })
            return {
                films: result.hits.hits.map((hit) => hit._source),
                pageTotal: Math.ceil(count.count / 20)
            }
        }
    }

    async getCount() {
        const result = await this.client.count({
            index: this.indexName,
            query: {
                match_all: {}
            },

        })
        return result.count
    }
    async getFilm(id: string): Promise<FilmType> {
        const result = await this.client.get({
            index: this.indexName,
            id: id.toString(),
        }, {
            ignore: [404] // Ignore 404 errors,
        })
        // if(result.found===false) throw new errorResponse.BadRequestError(`Cannot find this movie`)

        console.log("film got from elasticsearch", result)
        const source = result._source as any
        await source.episodes.length > 1 && source.episodes.sort((a: any, b: any) => a.slug.localeCompare(b.slug))
        return source
    }
    async getAllFilms() {
        const result = await this.client.search({
            index: this.indexName,
            query: {
                match_all: {}
            }
        })
        return result.hits.hits.map((hit) => hit._source)
    }


    async getListCategory() {
        const filmList = await this.getAllFilms()
        const categoryList = filmList.flatMap((film: any) => film.category)
        const uniqueCategory = Array.from(new Map(categoryList.map((cat: any) => [cat.slug, cat])).values())
        return uniqueCategory
    }

    async getListCountry() {
        const filmList = await this.getAllFilms()
        const countryList = filmList.flatMap((film: any) => film.country)
        const uniqueCountry = Array.from(new Map(countryList.map((cat: any) => [cat.slug, cat])).values())
        return uniqueCountry
    }
}