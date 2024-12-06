import { SuccessResonse } from '../cores/success.response';
import * as jwt from 'jsonwebtoken'
import { Request } from 'express'
import { Types } from 'mongoose'
export interface CustomRequest extends Request {
    keyToken?: KeyTokenModelProps,
    user?: PayloadTokenPair,
    admin?: PayloadTokenPair,
    refreshToken?: string,
    keyTokenAdmin?: KeyTokenAdminProps
}

export interface CustomRequestUser extends Request {
    keyToken?: KeyTokenModelProps,
    user?: UserProps,
    admin?: PayloadTokenPair,
    refreshToken?: string,
    keyTokenAdmin?: KeyTokenAdminProps
}
export interface UserProps {
    id: string, name: string, email: string,role:string
}


//------------MODELS-------------------
export interface KeyTokenModelProps {
    id: string | Types.ObjectId;
    userId: string | Types.ObjectId;
    publicKey: string;
    privateKey: string;
    refreshTokensUsed: string[] | null;
    refreshToken: string
}
//-----------------------CONFIGS-------------------

export interface ConfigDB {
    dev: ConfigEnvironment,
    [key: string]: ConfigEnvironment
}

export interface ConfigEnvironment {
    app: { port: number },
    db: { host: string, name: string }

}

export interface SuccessResonseProps {
    message?: string,
    metadata?: any,
    statusCode?: number,
    responseStatusCode?: string,
}

// ---------------------SERVICES------------------

export interface SignUpProps {
    name: string,
    email: string,
    password: string
}

export interface SignInProps {
    email: string,
    password: string
}

export interface TokenPairProps {
    accessToken: string,
    refreshToken: string
}

export interface AdminPayloadProps {
    adminFound: {
        id: string,
        name: string,
        email: string,
        role: string
    },
    keyToken: KeyTokenAdminProps
}
export interface UserPayloadProps {
    userFound: {
        id: string,
        name: string,
        email: string,
        role: string
    },
    keyToken: KeyTokenAdminProps,
    agent: Array<{
        userAgent: {
            id: string,
            agent: string
        },
        userId: string,
        agentId: string
    }>
}
export interface KeyTokenAdminProps {
    id: string,
    userId: string,
    publicKey: string,
    privateKey: string,
    refreshToken: string,
    refreshTokenUsed: Array<string>
}

export interface MovieData {
    movie: {
        name: string;
        slug: string;
        origin_name: string;
        content: string;
        poster_url: string;
        thumb_url: string;
        trailer_url: string;
        time: string;
        lang: string;
        year: number;
        actor: Array<string>;
        director: Array<string>;
        category: Array<{id:string,name:string,slug:string}>;
        country: Array<{id:string,name:string,slug:string}>;
        quality: string;
        episode_current: string;
    };
    episodes: Array<{
        server_data: Array<{
            link_m3u8: string;
        }>
    }>;
};


export interface TVData {
    movie: {
        name: string;
        slug: string;
        origin_name: string;
        content: string;
        poster_url: string;
        thumb_url: string;
        trailer_url: string;
        time: string;
        lang: string;
        year: number;
        actor: Array<string>;
        director: Array<string>;
        category: Array<{id:string,name:string,slug:string}>;
        country: Array<{id:string,name:string,slug:string}>;
        quality: string;
        episode_current: string;
        episode_total: string
    };
    episodes: Array<{
        server_data: Array<{
            name: string,
            slug: string,
            link_m3u8: string;
        }>
    }>;
};

export interface UpdateMovieProps {
    movieId: string,
    payload: MovieData
}
export interface QueryProps {
    query?: string,
    page?: string
}

export interface FilterPayloadProps {

}

export interface RatingProps {
    filmId: string,
    userId: string,
    rating: number
}

//---------COMMENT SERVICE--------------------
export interface CreateCommentProps {
    filmId: string,
    user: { id: string, name: string, email: string,role:string },
    content: any,
    parentCommentId?: string
}
//------------------AUTH-------------------

export interface CreateTokenPairProps {
    payload: any,
    publicKey: string,
    privateKey: string
}

//---------UTILS-------------
export interface PayloadTokenPair extends jwt.JwtPayload {
    userId?: string;
    email?: string;
    iat?: number;
    exp?: number;
    role?:string;
}

