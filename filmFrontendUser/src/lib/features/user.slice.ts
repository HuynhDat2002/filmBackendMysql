'use client'

import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as userService from './user.service'
import { NextRequest, NextResponse, userAgent } from 'next/server'
import { SignUpValueProps, LoginValueProps } from "../../types";
export const checkLogin = createAsyncThunk(
  "user/checklogin",
  async (_, thunkAPI) => {
    try {
      return await userService.checkLogin();
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);
export const logIn = createAsyncThunk(
  "user/login",
  async (data: LoginValueProps, thunkAPI) => {
    try {
      return await userService.logIn(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const signUp = createAsyncThunk(
  "user/signUp",
  async (_, thunkAPI) => {
    try {
      return await userService.signUp();
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, thunkAPI) => {
    try {
      return await userService.logout();
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (data: { email: string }, thunkAPI) => {
    try {
      return await userService.forgotPassword(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);
export const verify = createAsyncThunk(
  "user/verify",
  async (data: { otp: string }, thunkAPI) => {
    try {
      return await userService.verify(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);
export const verifySign = createAsyncThunk(
  "user/verifySign",
  async (data: { otp: string }, thunkAPI) => {
    try {
      return await userService.verify(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);
export const verifyDevice = createAsyncThunk(
  "user/verifyDevice",
  async (data: { otp: string }, thunkAPI) => {
    try {
      return await userService.verify(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);
export const resetPassword = createAsyncThunk(
  "user/resetpassword",
  async (data: { password: string, confirmPassword: string }, thunkAPI) => {
    try {
      return await userService.resetPassword(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const sendOTP = createAsyncThunk(
  "user/sendotp",
  async (data: { name: string, email: string, password: string }, thunkAPI) => {
    try {
      return await userService.sendOTP(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changepassword",
  async (data: { password: string, newPassword: string }, thunkAPI) => {
    try {
      return await userService.changePassword(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, thunkAPI) => {
    try {
      return await userService.getUser();
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const editUser = createAsyncThunk(
  "user/edituser",
  async (data: { name: string }, thunkAPI) => {
    try {
      console.log('edit',data)
      return await userService.editUser(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const checkDevice = createAsyncThunk(
  "user/checkDevice",
  async (data: { email: string, password: string, tokenCaptcha: string }, thunkAPI) => {
    try {
      return await userService.checkDevice(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);
export const initialState = {
  userLogin: {
    message: "",
    status: 0,
    metadata: {
      user: {
        id: "",

      },
      tokens: ""
    }
  },

  user: {
    message: "",
    status: 0,
    metadata: {
      id: "",
      name: "",
      email: ""

      ,
    }
  },

  isError: false,
  isSuccess: false,
  isLoading: false,
  isForgot: false,
  isLogin: false,
  isLogout: false,
  isVerify: false,
  isReset: false,
  isSign: false,
  isCheck: false,
  isSendOTP: false,
  isChangePassword: false,
  isEdit: false,
  isGetUser: false,
  isCheckDevice: false,
  isVerifySign: false,
  isVerifyDevice: false,

  message: { message: "" },
}

function resetFlags(state: any) {
  for (const key in state) {
    if (key.startsWith("is") && typeof state[key] === "boolean") {
      state[key] = false;
    }
  }
}

export const resetState = createAction("user/resetState");

export const user = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(checkLogin.pending, (state) => {
        resetFlags(state)
        state.isLoading = true;

      })
      .addCase(checkLogin.fulfilled, (state, action) => {
        resetFlags(state)
        state.isSuccess = true;
        state.isCheck = true
        state.user = action.payload;


      })
      .addCase(checkLogin.rejected, (state, action) => {
        resetFlags(state)
        state.isError = true;
        state.isCheck = true
        state.message = action.payload as any;
      })

      .addCase(logIn.pending, (state) => {
        resetFlags(state)
        state.isLoading = true;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        resetFlags(state)
        state.isSuccess = true;
        state.userLogin = action.payload;
        state.isLogin = true



      })
      .addCase(logIn.rejected, (state, action) => {
        resetFlags(state)
        state.isError = true;
        state.message = action.payload as any;
        state.isLogin = true

      })



      .addCase(signUp.pending, (state) => {
        resetFlags(state)
        state.isLoading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        resetFlags(state)
        state.isSuccess = true;
        state.user = action.payload;
        state.isSign = true

      })
      .addCase(signUp.rejected, (state, action) => {
        resetFlags(state)
        state.isError = true;
        state.message = action.payload as any;
        state.isSign = true
      })


      .addCase(logout.pending, (state) => {
        resetFlags(state)
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        resetFlags(state)
        state.isSuccess = true;
        state.user = action.payload; // Reset user state to initial
        state.isLogout = true


      })
      .addCase(logout.rejected, (state, action) => {
        resetFlags(state)
        state.isError = true;
        state.message = action.payload as any;
        state.isLogout = true

      })

      .addCase(forgotPassword.pending, (state) => {
        resetFlags(state)
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        resetFlags(state)
        state.isForgot = true
        state.isSuccess = true;
        state.user = action.payload; // Reset user state to initial
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        resetFlags(state)
        state.isForgot = true
        state.isError = true;
        state.message = action.payload as any;
      })


      .addCase(verify.pending, (state) => {
        resetFlags(state)
        state.isLoading = true;
      })
      .addCase(verify.fulfilled, (state, action) => {
        resetFlags(state)
        state.isSuccess = true;
        state.isVerify = true
        state.user = action.payload; // Reset user state to initial

      })
      .addCase(verify.rejected, (state, action) => {
        resetFlags(state)
        state.isError = true;
        state.isVerify = true
        state.message = action.payload as any;
      })

      .addCase(resetPassword.pending, (state) => {
        resetFlags(state)
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        resetFlags(state)
        state.isSuccess = true;
        state.isReset = true
        state.user = action.payload; // Reset user state to initial

      })

      .addCase(resetPassword.rejected, (state, action) => {
        resetFlags(state)
        state.isError = true;
        state.isReset = true
        state.message = action.payload as any;
      })

      .addCase(sendOTP.pending, (state) => {
        resetFlags(state)
        state.isLoading = true;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        resetFlags(state)
        state.isSuccess = true;
        state.isSendOTP = true
        state.user = action.payload; // Reset user state to initial

      })

      .addCase(sendOTP.rejected, (state, action) => {
        resetFlags(state)
        state.isError = true;
        state.isSendOTP = true
        state.message = action.payload as any;
      })


      .addCase(changePassword.pending, (state) => {
        resetFlags(state)
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        resetFlags(state)


        state.isSuccess = true;
        state.isChangePassword = true
        state.user = action.payload; // Reset user state to initial

      })

      .addCase(changePassword.rejected, (state, action) => {
        resetFlags(state)


        state.isError = true;

        state.isChangePassword = true
        state.message = action.payload as any;
      })

      .addCase(getUser.pending, (state) => {
        resetFlags(state)

        state.isLoading = true;

      })
      .addCase(getUser.fulfilled, (state, action) => {
        resetFlags(state)
        state.isSuccess = true;
        state.isGetUser = true
        state.user = action.payload; // Reset user state to initial

      })

      .addCase(getUser.rejected, (state, action) => {
        resetFlags(state)
        state.isError = true;
        state.isGetUser = true
        state.message = action.payload as any;
      })

      .addCase(editUser.pending, (state) => {
        resetFlags(state)
        state.isLoading = true;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        resetFlags(state)
        state.isSuccess = true;
        state.isEdit = true
        state.user = action.payload; // Reset user state to initial

      })

      .addCase(editUser.rejected, (state, action) => {
        resetFlags(state)
        state.isError = true;
        state.isEdit = true
        state.message = action.payload as any;
      })


      .addCase(checkDevice.pending, (state) => {
        resetFlags(state)
        state.isLoading = true;
      })
      .addCase(checkDevice.fulfilled, (state, action) => {
        resetFlags(state)
        state.isSuccess = true;
        state.isCheckDevice = true
        state.user = action.payload; // Reset user state to initial

      })

      .addCase(checkDevice.rejected, (state, action) => {
        resetFlags(state)
        state.isError = true;
        state.isCheckDevice = true
        state.message = action.payload as any;
      })
      .addCase(verifyDevice.pending, (state) => {
        resetFlags(state)
        state.isLoading = true;
      })
      .addCase(verifyDevice.fulfilled, (state, action) => {
        resetFlags(state)
        state.isSuccess = true;
        state.isVerifyDevice = true
        state.message = action.payload; // Reset user state to initial

      })

      .addCase(verifyDevice.rejected, (state, action) => {
        resetFlags(state)
        state.isError = true;
        state.isVerifyDevice = true
        state.message = action.payload as any;
      })

      .addCase(verifySign.pending, (state) => {
        resetFlags(state)

        state.isLoading = true;

      })
      .addCase(verifySign.fulfilled, (state, action) => {
        resetFlags(state)
        state.isSuccess = true;
        state.isVerifySign = true
        state.message = action.payload; // Reset user state to initial
      })

      .addCase(verifySign.rejected, (state, action) => {
        resetFlags(state)
        state.isError = true;
        state.isVerifySign = true

        state.message = action.payload as any;
      })
      .addCase(resetState, () => initialState);
  },
});

export default user.reducer