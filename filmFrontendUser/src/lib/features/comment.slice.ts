'use client'

import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as movieService from './movie.service'
import * as commentService from './comment.service'

export const getCommentByFilm = createAsyncThunk(
  "comment/getcommentbyfilm",

  async (data: { filmId: string }, thunkAPI) => {
    try {
      return await commentService.getCommentByFilm(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);


export const getCommentByParentId = createAsyncThunk(
  "comment/getCommentByParentId",

  async (data: { filmId: string, parentCommentId: string }, thunkAPI) => {
    try {
      return await commentService.getCommentByParentId(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const createComment = createAsyncThunk(
  "comment/createComment",

  async (data: { filmId: string, content: string, parentCommentId?: string }, thunkAPI) => {
    try {
      return await commentService.createComment(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);


export const commentReply = createAsyncThunk(
  "comment/commentReply",

  async (data: { filmId: string, content: string, parentCommentId?: string }, thunkAPI) => {
    try {
      return await commentService.createComment(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const editComment = createAsyncThunk(
  "comment/editComment",

  async (data: { commentId: string, filmId: string, content: string }, thunkAPI) => {
    try {
      return await commentService.editComment(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);


export const deleteComment = createAsyncThunk(
  "comment/deleteComment",

  async (data: { commentId: string, filmId: string }, thunkAPI) => {
    try {
      return await commentService.deleteComment(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);






const initialState = {
  comments: {
    message: "",
    status: 200,
    metadata: []
  },
  comment: {
    message: "",
    status: 200,
    metadata: {}
  },
  commentChilds: {
    message: "",
    status: 200,
    metadata: []
  },
  isError: false,
  isLoading: false,
  isSuccess: false,
  isGetCommentByFilm: false,
  isGetCommentByParentId: false,
  isCreateComment: false,
  isCommentReply: false,
  isEditComment:false,
  isDeleteComment:false,
  message: { message: "" } ,
}


export const resetState = createAction("Reset_all");

export const comment = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCommentByFilm.pending, (state) => {
        state.isLoading = true;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = false
        state.isCreateComment = false
        state.isCommentReply = false
        state.isEditComment=false
        state.isDeleteComment=false
      })
      .addCase(getCommentByFilm.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetCommentByParentId = false
        state.isGetCommentByFilm = true
        state.comments = action.payload;
      })
      .addCase(getCommentByFilm.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetCommentByParentId = false

        state.isGetCommentByFilm = true
        state.message = action.payload as any;
      })

      .addCase(getCommentByParentId.pending, (state) => {
        state.isLoading = true;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = false
        state.isCreateComment = false
        state.isCommentReply = false
        state.isEditComment=false
        state.isDeleteComment=false

      })
      .addCase(getCommentByParentId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = true
        state.commentChilds = action.payload;
      })
      .addCase(getCommentByParentId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = true
        state.message = action.payload as any;
      })


      .addCase(createComment.pending, (state) => {
        state.isLoading = true;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = false
        state.isCreateComment = false
        state.isCommentReply = false
        state.isEditComment=false
        state.isDeleteComment=false

      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = false
        state.isCreateComment = true
        state.comment = action.payload;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = false
        state.isCreateComment = true
        state.message = action.payload as any;
      })

      .addCase(commentReply.pending, (state) => {
        state.isLoading = true;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = false
        state.isCreateComment = false
        state.isCommentReply = false
        state.isEditComment=false
        state.isDeleteComment=false

      })
      .addCase(commentReply.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = false
        state.isCreateComment = false
        state.isCommentReply = true

        state.comment = action.payload;
      })
      .addCase(commentReply.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = false
        state.isCreateComment = false
        state.isCommentReply = true

        state.message = action.payload as any;
      })


      .addCase(editComment.pending, (state) => {
        state.isLoading = true;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = false
        state.isCreateComment = false
        state.isCommentReply = false
        state.isEditComment=false
        state.isDeleteComment=false

      })
      .addCase(editComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = false
        state.isCreateComment = false
        state.isCommentReply = false
        state.isEditComment=true

        state.comment = action.payload;
      })
      .addCase(editComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = false
        state.isCreateComment = false
        state.isCommentReply = false
        state.isEditComment=true

        state.message = action.payload as any;
      })
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = false
        state.isCreateComment = false
        state.isCommentReply = false
        state.isEditComment=false
        state.isDeleteComment=false

      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = false
        state.isCreateComment = false
        state.isCommentReply = false
        state.isEditComment=false
        state.isDeleteComment=true


        state.comment = action.payload;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetCommentByFilm = false
        state.isGetCommentByParentId = false
        state.isCreateComment = false
        state.isCommentReply = false
        state.isEditComment=false
        state.isDeleteComment=true


        state.message = action.payload as any;
      })


  },
});

export default comment.reducer