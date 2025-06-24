export interface FilmType {
    id: string,
    name: string,
    slug: string,
    origin_name: string,
    content: string,
    poster_url: string,
    thumb_url: string,
    trailer: string,
    time: string,
    lang: string,
    year: number,
    view: number,
    quality: string,
    episode_current: string,
    episode_total: Number,
    episodes: [
        {
            id: string,
            name: string,
            slug: string,
            video: string,
        }
    ],
    video: string,
    type: string,
    actor: [
        {
            id: string,
            name: string
        }
    ],

    director: [
        {
            id: string,
            name: string
        }
    ],

    category: [
        {
            id: string,
            name: string,
            slug: string,
        }
    ],
    country: [
        {
            id: string,
            name: string,
            slug: string,
        }
    ],
    rating?: {
        id: string,
        ratingAverage: number,
        ratings: [
            {
                ratingNumber: number,
                userRating: {
                    id: string,
                    userId: string,

                },
            }
        ]

    },
    comment:Comment[]
}


export interface CommentUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
}

export interface Comment {
  id: string;
  comment_content: string;
  comment_left: number;
  comment_right: number;
  comment_parentId: string;
  isDeleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  comment_user: CommentUser;
}