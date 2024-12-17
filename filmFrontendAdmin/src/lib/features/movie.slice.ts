'use client'

import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as movieService from './movie.service'


export const getMovies = createAsyncThunk(
  "movie/get-movies",

  async (page: number, thunkAPI) => {
    try {
      console.log('hiiii')
      return await movieService.getMovies(page);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);


export const getA = createAsyncThunk(
  "movie/getA",

  async (data: { id: string }, thunkAPI) => {
    try {
      return await movieService.getA(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);


export const searchMovie = createAsyncThunk(
  "movie/search",

  async (data: { query: string, page: string }, thunkAPI) => {
    try {
      return await movieService.search(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const ratingMovie = createAsyncThunk(
  "movie/rating",

  async (data: { filmId: string, rating: number }, thunkAPI) => {
    try {
      return await movieService.ratingMovie(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const getRatings = createAsyncThunk(
  "movie/getrating",

  async (data: { filmId: string }, thunkAPI) => {
    try {
      return await movieService.getRatings(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const getPageTotalMovie = createAsyncThunk(
  "movie/getPageTotal",

  async (_, thunkAPI) => {
    try {
      return await movieService.getPageTotal();
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);


export const createMovie = createAsyncThunk(
  "movie/createMovie",

  async (data: { urlEmbed: string }, thunkAPI) => {
    try {
      return await movieService.createMovie(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);
export const deleteMovie = createAsyncThunk(
  "movie/deteteMovie",

  async (data:{id:string}, thunkAPI) => {
    try {
      return await movieService.deleteMovie(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  movies: {
    message: "",
    status: 200,
    metadata: [{
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
          "actor": {
            "id": "",
            "name": ""
          }
        },

      ],
      director: [
        {
          "directorId": "",
          "movieId": "",
          "director": {
            "id": "",
            "name": ""
          }
        }
      ],
      category: [
        {
          "categoryId": "",
          "movieId": "",
          "category": {
            "id": "",
            "name": "",
            "slug": ""
          }
        },

      ],
      country: [
        {
          "countryId": "",
          "movieId": "",
          "country": {
            "id": "",
            "name": "",
            "slug": ""
          }
        }
      ],
      quality: "",
      episode_current: "",
      video: "",
    }]
  },
  movieLength: {
    metadata: {
      movieLength: 0
    }
  },
  movie: {
    message: "",
    status: 200,
    metadata: {
      _id: "",
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
          "actor": {
            "id": "",
            "name": ""
          }
        },

      ],
      director: [
        {
          "directorId": "",
          "movieId": "",
          "director": {
            "id": "",
            "name": ""
          }
        }
      ],
      category: [
        {
          "categoryId": "",
          "movieId": "",
          "category": {
            "id": "",
            "name": "",
            "slug": ""
          }
        },

      ],
      country: [
        {
          "countryId": "",
          "movieId": "",
          "country": {
            "id": "",
            "name": "",
            "slug": ""
          }
        }
      ],
      quality: "",
      episode_current: "",
      video: ""
    }
  },

  ratings: {
    id: "",
    filmId: "",
    ratings: []
  },
  isError: false,
  isLoading: false,
  isSuccess: false,
  isGetAll: false,
  isSearch: false,
  isGetA: false,
  isRating: false,
  isGetRatings: false,
  isGetPageTotal: false,
  isCreateMovie: false,
  message: { message: "" },
  isDelete: false
}



export const resetState = createAction("Reset_all");

export const movie = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteMovie.pending, (state) => {
        state.isLoading = true;
        state.isGetAll = false
        state.isSearch = false
        state.isGetA = false
        state.isRating = false
        state.isGetRatings = false
        state.isGetPageTotal = false
        state.isCreateMovie = false
        state.isDelete = false

      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetAll = false
        state.isDelete = true
        state.movie = action.payload;
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetAll = false
        state.isDelete = true
        state.message = action.payload as any;
      })
      .addCase(getMovies.pending, (state) => {
        state.isLoading = true;
        state.isGetAll = false
        state.isSearch = false
        state.isGetA = false
        state.isRating = false
        state.isGetRatings = false
        state.isGetPageTotal = false
        state.isCreateMovie = false

      })
      .addCase(getMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetAll = true

        state.movies = action.payload;
      })
      .addCase(getMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetAll = true
        state.message = action.payload as any;
      })


      .addCase(searchMovie.pending, (state) => {
        state.isLoading = true;
        state.isGetAll = false
        state.isSearch = false
        state.isGetA = false
        state.isRating = false
        state.isGetRatings = false
        state.isGetPageTotal = false
        state.isCreateMovie = false


      })
      .addCase(searchMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isSearch = true

        state.movies = action.payload;
      })
      .addCase(searchMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isSearch = true
        state.message = action.payload as any;


      })

      .addCase(getA.pending, (state) => {
        state.isLoading = true;
        state.isGetAll = false
        state.isSearch = false
        state.isGetA = false
        state.isRating = false
        state.isGetRatings = false
        state.isGetPageTotal = false
        state.isCreateMovie = false
      })
      .addCase(getA.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetA = true

        state.movie = action.payload;
      })
      .addCase(getA.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetA = true

        state.message = action.payload as any;
      })

      .addCase(ratingMovie.pending, (state) => {
        state.isLoading = true;
        state.isGetAll = false
        state.isSearch = false
        state.isGetA = false
        state.isRating = false
        state.isGetRatings = false
        state.isGetPageTotal = false
        state.isCreateMovie = false


      })
      .addCase(ratingMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isRating = true

        state.ratings = action.payload;
      })
      .addCase(ratingMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isRating = true
        state.message = action.payload as any;
      })

      .addCase(getRatings.pending, (state) => {
        state.isLoading = true;
        state.isGetAll = false
        state.isSearch = false
        state.isGetA = false
        state.isRating = false
        state.isGetRatings = false
        state.isGetPageTotal = false
        state.isCreateMovie = false


      })
      .addCase(getRatings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetRatings = true
        state.isGetA = false
        state.isRating=false
        state.ratings = action.payload;
      })
      .addCase(getRatings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetRatings = true
        state.isGetA = false

        state.message = action.payload as any;
      })

      .addCase(getPageTotalMovie.pending, (state) => {
        state.isLoading = true;
        state.isGetAll = false
        state.isSearch = false
        state.isGetA = false
        state.isRating = false
        state.isGetRatings = false
        state.isGetPageTotal = false
        state.isCreateMovie = false


      })
      .addCase(getPageTotalMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetPageTotal = true
        state.isGetA = false
        state.movieLength = action.payload;
      })
      .addCase(getPageTotalMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetPageTotal = true
        state.isGetA = false

        state.message = action.payload as any;
      })

      .addCase(createMovie.pending, (state) => {
        state.isLoading = true;
        state.isGetAll = false
        state.isSearch = false
        state.isGetA = false
        state.isRating = false
        state.isGetRatings = false
        state.isGetPageTotal = false
        state.isCreateMovie = false


      })
      .addCase(createMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetPageTotal = false
        state.isCreateMovie = true

        state.isGetA = false
        state.movieLength = action.payload;
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetPageTotal = false
        state.isGetA = false
        state.isCreateMovie = true


        state.message = action.payload as any;
      })
      .addCase(resetState, () => initialState);
  },
});

export default movie.reducer