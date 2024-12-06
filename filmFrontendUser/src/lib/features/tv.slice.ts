'use client'

import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as tvService from './tv.service'


export const getAllTV = createAsyncThunk(
  "tv/get-tvshows",

  async (page: number, thunkAPI) => {
    try {
      return await tvService.getAllTV(page);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const getA = createAsyncThunk(
  "tv/getA",

  async (data: { id: string }, thunkAPI) => {
    try {
      return await tvService.getA(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const searchTV = createAsyncThunk(
  "tv/search",

  async (data: { query: string, page: string }, thunkAPI) => {
    try {
      return await tvService.search(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const ratingTV = createAsyncThunk(
  "tv/rating",

  async (data: { filmId: string, rating: number }, thunkAPI) => {
    try {
      return await tvService.ratingTV(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);


export const getRatings = createAsyncThunk(
  "tv/getrating",

  async (data: { filmId: string }, thunkAPI) => {
    try {
      return await tvService.getRatings(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);


export const getPageTotal = createAsyncThunk(
  "tv/getPageTotal",

  async (_, thunkAPI) => {
    try {
      return await tvService.getPageTotal();
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);
const initialState = {
  tvs: {
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
          "tvId": "",
          "director": {
            "id": "",
            "name": ""
          }
        }
      ],
      category: [
        {
          "categoryId": "",
          "tvId": "",
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
          "tvId": "",
          "country": {
            "id": "",
            "name": "",
            "slug": ""
          }
        }
      ],
      quality: "",
      episode_current: "",

      episode_total: 0,
      episodes: [{
        name: "",
        slug: "",
        video: "",
        id: ""
      }]
    }]
  },
  tv: {
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
          "tvId": "",
          "director": {
            "id": "",
            "name": ""
          }
        }
      ],
      category: [
        {
          "categoryId": "",
          "tvId": "",
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
          "tvId": "",
          "country": {
            "id": "",
            "name": "",
            "slug": ""
          }
        }
      ],
      quality: "",
      episode_current: "",

      episode_total: 0,
      episodes: [{
        name: "",
        slug: "",
        video: "",
        id: ""
      }]

    }
  },
  tvLength: {
    metadata: {
      tvLength: 0
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
  message: { message: "" },

}



export const resetState = createAction("Reset_all");

export const tv = createSlice({
  name: "tv",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTV.pending, (state) => {
        state.isLoading = true;
        state.isGetAll = false;
        state.isSearch = false;
        state.isGetA = false
        state.isRating = false
        state.isGetRatings = false
        state.isGetPageTotal = false
      })
      .addCase(getAllTV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetAll = true

        state.tvs = action.payload;
      })
      .addCase(getAllTV.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetAll = true

        state.message = action.payload as any;
      })


      .addCase(searchTV.pending, (state) => {
        state.isLoading = true;
        state.isGetAll = false;
        state.isSearch = false;
        state.isGetA = false
        state.isRating = false
        state.isGetRatings = false
        state.isGetPageTotal = false



      })
      .addCase(searchTV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isSearch = true;


        state.tvs = action.payload;
      })
      .addCase(searchTV.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isSearch = true;

        state.message = action.payload as any;
      })


      .addCase(getA.pending, (state) => {
        state.isLoading = true;
        state.isGetAll = false;
        state.isSearch = false;
        state.isGetA = false
        state.isRating = false
        state.isGetRatings = false
        state.isGetPageTotal = false



      })
      .addCase(getA.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetA = true;
        state.isGetRatings = false


        state.tv = action.payload;
      })
      .addCase(getA.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetA = true;
        state.isGetRatings = false

        state.message = action.payload as any;
      })


      .addCase(ratingTV.pending, (state) => {
        state.isLoading = true;
        state.isGetAll = false;
        state.isSearch = false;
        state.isGetA = false
        state.isRating = false
        state.isGetRatings = false
        state.isGetPageTotal = false



      })
      .addCase(ratingTV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isRating = true;


        state.ratings = action.payload;
      })
      .addCase(ratingTV.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isRating = true;
        state.message = action.payload as any;
      })

      .addCase(getRatings.pending, (state) => {
        state.isLoading = true;
        state.isGetAll = false;
        state.isSearch = false;
        state.isGetA = false
        state.isRating = false
        state.isGetRatings = false
        state.isGetPageTotal = false



      })
      .addCase(getRatings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetRatings = true;
        state.isGetA = false

        state.ratings = action.payload;
      })
      .addCase(getRatings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetRatings = true;
        state.isGetA = false

        state.message = action.payload as any;
      })



      .addCase(getPageTotal.pending, (state) => {
        state.isLoading = true;
        state.isGetAll = false;
        state.isSearch = false;
        state.isGetA = false
        state.isRating = false
        state.isGetRatings = false
        state.isGetPageTotal = false



      })
      .addCase(getPageTotal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetPageTotal = true;
        state.tvLength = action.payload;
      })
      .addCase(getPageTotal.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetPageTotal = true;
        state.message = action.payload as any;
      })
      .addCase(resetState, () => initialState);
  },
});

export default tv.reducer