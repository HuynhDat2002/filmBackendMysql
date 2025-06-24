'use client'

import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as filmService from './film.service'


export const getFilms = createAsyncThunk(
  "film/get-films",

  async (page: number, thunkAPI) => {
    try {
      console.log('film list')
      return await filmService.getFilms(page);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);


export const getA = createAsyncThunk(
  "film/getA",

  async (data: { id: string }, thunkAPI) => {
    try {
      return await filmService.getA(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);


export const searchFilm = createAsyncThunk(
  "film/search",

  async (data: { query: string, page: number }, thunkAPI) => {
    try {
      return await filmService.search(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const ratingFilm = createAsyncThunk(
  "film/rating",

  async (data: { filmId: string, rating: number }, thunkAPI) => {
    try {
      return await filmService.ratingFilm(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const getRating = createAsyncThunk(
  "film/getrating",

  async (data: { filmId: string }, thunkAPI) => {
    try {
      return await filmService.getRatings(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const getPageTotalFilm = createAsyncThunk(
  "film/getPageTotal",

  async (_, thunkAPI) => {
    try {
      return await filmService.getPageTotal();
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const getListCategory = createAsyncThunk(
  "film/getListCategory",

  async (_, thunkAPI) => {
    try {
      return await filmService.getListCategory();
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const getListCountry = createAsyncThunk(
  "film/getListCountry",

  async (_, thunkAPI) => {
    try {
      return await filmService.getListCountry();
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);


export const filter = createAsyncThunk(
  "film/filter",

  async ({ field, data, page }: { field: string, data: string, page: number }, thunkAPI) => {
    try {
      return await filmService.filter({ field, data, page });
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);




export const initialState = {
  films: {
    message: "",
    status: 200,
    metadata: {
      films: [{
        id: "",
        name: "",
        slug: "",
        origin_name: "",
        content: "",
        poster_url: "",
        thumb_url: "",
        trailer: "",
        time: "",
        lang: "",
        year: 0,
        episodes:[
          {
            id:"",
            name:"",
            slug:"",
            video:""
          }
        ],
        actor: [
          {
            id: "",
            name: ""
          }
        ],
        director: [
          {
            id: "",
            name: ""
          }
        ],
        category: [
          {
            id: "",
            name: "",
            slug: ""
          },

        ],
        country: [
          {
            id: "",
            name: "",
            slug: ""
          }
        ],
        quality: "",
        episode_current: "",
        episode_total:0,
        video: "",
        view: 0,
        type: ""
      }],
      pageTotal: 0,
    }
  },
  filmLength: {
    metadata: 0
  },
  film: {
    message: "",
    status: 200,
    metadata: {
      id: "",
      name: "",
      slug: "",
      origin_name: "",
      content: "",
      poster_url: "",
      thumb_url: "",
      trailer: "",
      time: "",
      lang: "",
      year: 0,
      actor: [
        {
          id: "",
          name: ""
        }
      ],
      director: [
        {
          id: "",
          name: ""
        }
      ],
      category: [
        {
          id: "",
          name: "",
          slug: ""
        },

      ],
      country: [
        {
          id: "",
          name: "",
          slug: ""
        }
      ],
      episodes:[
          {
            id:"",
            name:"",
            slug:"",
            video:""
          }
        ],
      episode_total:0,
      episode_current: "",
      video: "",
      view: 0,
      type: ""
    }
  },
  category: {
    metadata: [
      {
        id: "",
        name: "",
        slug: ""
      }

    ]
  },
  country: {
    metadata: [
      {
        id: "",
        name: "",
        slug: ""
      }

    ]
  },
  // ratings


  rating: {
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
  },
  isError: false,
  isLoading: false,
  isSuccess: false,
  isGetAll: false,
  isSearch: false,
  isGetA: false,
  isRating: false,
  isGetRating: false,
  isGetPageTotal: false,
  isGetListCategory: false,
  isGetListCountry: false,
  isFilter: false,
  message: { message: "" },

}

function resetFlags(state: any) {
  for (const key in state) {
    if (key.startsWith("is") && typeof state[key] === "boolean") {
      state[key] = false;
    }
  }
}

export const resetState = createAction("Reset_all");

export const film = createSlice({
  name: "film",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListCountry.pending, (state) => {
        resetFlags(state);
        state.isLoading = true;
      })
      .addCase(getListCountry.fulfilled, (state, action) => {
        resetFlags(state);
        state.isSuccess = true;
        state.isGetListCountry = true
        state.country = action.payload;
      })
      .addCase(getListCountry.rejected, (state, action) => {
        resetFlags(state);
        state.isError = true;
        state.isGetListCountry = true
        state.message = action.payload as any;
      })

      .addCase(filter.pending, (state) => {
        resetFlags(state);
        state.isLoading = true;
      })
      .addCase(filter.fulfilled, (state, action) => {
        resetFlags(state);
        state.isSuccess = true;
        state.isFilter = true
        state.films = action.payload;
      })
      .addCase(filter.rejected, (state, action) => {
        resetFlags(state);
        state.isError = true;
        state.isFilter = true
        state.message = action.payload as any;
      })


      .addCase(getListCategory.pending, (state) => {
        resetFlags(state);
        state.isLoading = true;

      })
      .addCase(getListCategory.fulfilled, (state, action) => {
        resetFlags(state);
        state.isSuccess = true;
        state.isGetListCategory = true
        state.category = action.payload;
      })
      .addCase(getListCategory.rejected, (state, action) => {
        resetFlags(state);
        state.isError = true;
        state.isGetListCategory = true
        state.message = action.payload as any;
      })
      .addCase(getFilms.pending, (state) => {
        resetFlags(state);
        state.isLoading = true;
      })
      .addCase(getFilms.fulfilled, (state, action) => {
        resetFlags(state);
        state.isSuccess = true;
        state.isGetAll = true
        state.films = action.payload;
      })
      .addCase(getFilms.rejected, (state, action) => {
        resetFlags(state);
        state.isError = true;
        state.isGetAll = true
        state.message = action.payload as any;
      })


      .addCase(searchFilm.pending, (state) => {
        resetFlags(state);
        state.isLoading = true;
      })
      .addCase(searchFilm.fulfilled, (state, action) => {
        resetFlags(state);
        state.isSuccess = true;
        state.isSearch = true
        state.films = action.payload;
      })
      .addCase(searchFilm.rejected, (state, action) => {
        resetFlags(state);
        state.isError = true;
        state.isSearch = true
        state.message = action.payload as any;
      })

      .addCase(getA.pending, (state) => {
        resetFlags(state);
        state.isLoading = true;
      })
      .addCase(getA.fulfilled, (state, action) => {
        resetFlags(state);
        state.isSuccess = true;
        state.isGetA = true;
        state.film = action.payload;
      })
      .addCase(getA.rejected, (state, action) => {
        resetFlags(state);
        state.isError = true;
        state.isGetA = true;
        state.message = action.payload as any;
      })

      .addCase(ratingFilm.pending, (state) => {
        resetFlags(state);
        state.isLoading = true;
      })
      .addCase(ratingFilm.fulfilled, (state, action) => {
        resetFlags(state);
        state.isSuccess = true;
        state.isRating = true;
        state.rating = action.payload;
      })
      .addCase(ratingFilm.rejected, (state, action) => {
        resetFlags(state);
        state.isError = true;
        state.isRating = true
        state.message = action.payload as any;
      })

      .addCase(getRating.pending, (state) => {
        resetFlags(state);
        state.isLoading = true;
      })
      .addCase(getRating.fulfilled, (state, action) => {
        resetFlags(state);
        state.isSuccess = true;
        state.isGetRating = true
        state.rating = action.payload;
      })
      .addCase(getRating.rejected, (state, action) => {
        resetFlags(state);
        state.isError = true;
        state.isGetRating = true
        state.message = action.payload as any;
      })

      .addCase(getPageTotalFilm.pending, (state) => {
        resetFlags(state);
        state.isLoading = true;
      })
      .addCase(getPageTotalFilm.fulfilled, (state, action) => {
        resetFlags(state);
        state.isSuccess = true;
        state.isGetPageTotal = true
        state.filmLength = action.payload;
      })
      .addCase(getPageTotalFilm.rejected, (state, action) => {
        resetFlags(state);
        state.isError = true;
        state.isGetPageTotal = true
        state.message = action.payload as any;
      })
      .addCase(resetState, () => initialState);
  },
});

export default film.reducer