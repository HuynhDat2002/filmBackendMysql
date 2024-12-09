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
  async (data: { password:string,confirmPassword: string }, thunkAPI) => {
    try {
      return await userService.resetPassword(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const sendOTP = createAsyncThunk(
  "user/sendotp",
  async (data: { name:string,email:string,password:string}, thunkAPI) => {
    try {
      return await userService.sendOTP(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changepassword",
  async (data: { password:string,newPassword:string}, thunkAPI) => {
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
  async (data:{name:string}, thunkAPI) => {
    try {
      return await userService.editUser(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);

export const checkDevice = createAsyncThunk(
  "user/checkDevice",
  async (data:{email:string,password:string,tokenCaptcha:string}, thunkAPI) => {
    try {
      return await userService.checkDevice(data);
    } catch (error) {
      throw thunkAPI.rejectWithValue(error);
    }
  }
);
const initialState = {
  user: {
    user: {
      _id: "",

    },
    tokens: ""
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
  isCheck:false,
  isSendOTP:false,
  isChangePassword:false,
  isEdit:false,
  isGetUser:false,
  isCheckDevice:false,
  isVerifySign:false,
  isVerifyDevice:false,

  message: {message:""} ,
}



export const resetState = createAction("user/resetState");

export const user = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(checkLogin.pending, (state) => {
        state.isLoading = true;
        state.isForgot = false
        state.isCheck=false
          state.isLogin = false
          state.isLogout = false
          state.isVerify = false
          state.isReset = false
          state.isSign = false
          state.isSendOTP=false
          state.isChangePassword=false
          state.isGetUser=false
          state.isEdit=false
          state.isCheckDevice=false
          state.isVerifyDevice=false
          state.isVerifySign=false
      })
      .addCase(checkLogin.fulfilled, (state, action) => {
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isCheck=true
        state.isLoading=false


      })
      .addCase(checkLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isCheck=true

        state.message = action.payload as any;
      })

      .addCase(logIn.pending, (state) => {
        state.isLoading = true;
        state.isForgot = false
          state.isLogin = false
          state.isLogout = false
          state.isVerify = false
          state.isReset = false
          state.isSign = false
        state.isCheck=false
        state.isSendOTP=false
        state.isChangePassword=false
        state.isGetUser=false
        state.isEdit=false
        state.isCheckDevice=false
        state.isVerifyDevice=false
        state.isVerifySign=false



      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isLogin = true



      })
      .addCase(logIn.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload as any;
        state.isLogin = true

      })



      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.isForgot = false
          state.isLogin = false
          state.isLogout = false
          state.isVerify = false
          state.isReset = false
          state.isSign = false
        state.isCheck=false
        state.isSendOTP=false
        state.isChangePassword=false
        state.isGetUser=false
        state.isEdit=false
        state.isCheckDevice=false
        state.isVerifyDevice=false
        state.isVerifySign=false



      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isSign=true

      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload as any;
        state.isSign=true

      })


      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.isForgot = false
          state.isLogin = false
          state.isLogout = false
          state.isVerify = false
          state.isReset = false
          state.isSign = false
        state.isCheck=false
        state.isSendOTP=false
        state.isChangePassword=false
        state.isGetUser=false

        state.isEdit=false
        state.isCheckDevice=false
        state.isVerifyDevice=false
        state.isVerifySign=false


      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload; // Reset user state to initial
        state.isLogout=true


      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload as any;
        state.isLogout=true

      })




      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.isForgot = false
          state.isLogin = false
          state.isLogout = false
          state.isVerify = false
          state.isReset = false
          state.isSign = false
        state.isCheck=false
        state.isSendOTP=false
        state.isChangePassword=false
        state.isGetUser=false
        state.isEdit=false
        state.isCheckDevice=false
        state.isVerifyDevice=false
        state.isVerifySign=false


      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isForgot = true
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload; // Reset user state to initial
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isForgot = true

        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload as any;
      })


      .addCase(verify.pending, (state) => {
        state.isLoading = true;
        state.isForgot = false
          state.isLogin = false
          state.isLogout = false
          state.isVerify = false
          state.isReset = false
          state.isSign = false
        state.isCheck=false
        state.isSendOTP=false
        state.isChangePassword=false
        state.isGetUser=false
        state.isEdit=false
        state.isCheckDevice=false
        state.isVerifyDevice=false
        state.isVerifySign=false


      })
      .addCase(verify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isVerify=true
        state.user = action.payload; // Reset user state to initial
        
      })
      .addCase(verify.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isVerify=true
        state.message = action.payload as any;
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
         state.isForgot = false
          state.isLogin = false
          state.isLogout = false
          state.isVerify = false
          state.isReset = false
          state.isSign = false
        state.isCheck=false
        state.isSendOTP=false
        state.isChangePassword=false
        state.isGetUser=false
        state.isEdit=false
        state.isCheckDevice=false
        state.isVerifyDevice=false
        state.isVerifySign=false



      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isReset=true
        state.user = action.payload; // Reset user state to initial
        
      })
      
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isReset=true
        state.message = action.payload as any;
      })

      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
         state.isForgot = false
          state.isLogin = false
          state.isLogout = false
          state.isVerify = false
          state.isReset = false
          state.isSign = false
        state.isCheck=false
        state.isSendOTP=false
        state.isChangePassword=false
        state.isGetUser=false
        state.isEdit=false
        state.isCheckDevice=false
        state.isVerifyDevice=false
        state.isVerifySign=false
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isSendOTP=true
        state.user = action.payload; // Reset user state to initial
        
      })
      
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isSendOTP=true
        state.message = action.payload as any;
      })


      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
         state.isForgot = false
          state.isLogin = false
          state.isLogout = false
          state.isVerify = false
          state.isReset = false
          state.isSign = false
        state.isCheck=false
        state.isSendOTP=false
        state.isChangePassword=false
        state.isGetUser=false
        state.isEdit=false
        state.isCheckDevice=false
        state.isVerifyDevice=false
        state.isVerifySign=false
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isChangePassword=true
        state.user = action.payload; // Reset user state to initial
        
      })
      
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isChangePassword=true
        state.message = action.payload as any;
      })

      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
         state.isForgot = false
          state.isLogin = false
          state.isLogout = false
          state.isVerify = false
          state.isReset = false
          state.isSign = false
        state.isCheck=false
        state.isSendOTP=false
        state.isChangePassword=false
        state.isGetUser=false
        state.isEdit=false
        state.isCheckDevice=false
        state.isVerifyDevice=false
        state.isVerifySign=false
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetUser=true
        state.user = action.payload; // Reset user state to initial
        
      })
      
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isGetUser=true
        state.message = action.payload as any;
      })

      .addCase(editUser.pending, (state) => {
        state.isLoading = true;
         state.isForgot = false
          state.isLogin = false
          state.isLogout = false
          state.isVerify = false
          state.isReset = false
          state.isSign = false
        state.isCheck=false
        state.isSendOTP=false
        state.isChangePassword=false
        state.isGetUser=false
        state.isEdit=false
        state.isCheckDevice=false
        state.isVerifyDevice=false
        state.isVerifySign=false
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isEdit=true
        state.user = action.payload; // Reset user state to initial
        
      })
      
      .addCase(editUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isEdit=true
        state.message = action.payload as any;
      })


      .addCase(checkDevice.pending, (state) => {
        state.isLoading = true;
         state.isForgot = false
          state.isLogin = false
          state.isLogout = false
          state.isVerify = false
          state.isReset = false
          state.isSign = false
        state.isCheck=false
        state.isSendOTP=false
        state.isChangePassword=false
        state.isGetUser=false
        state.isEdit=false
        state.isCheckDevice=false
        state.isVerifyDevice=false
        state.isVerifySign=false
      })
      .addCase(checkDevice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isEdit=false
        state.isCheckDevice=true

        state.user = action.payload; // Reset user state to initial
        
      })
      
      .addCase(checkDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isEdit=false
        state.isCheckDevice=true
        state.message = action.payload as any;
      })
      .addCase(verifyDevice.pending, (state) => {
        state.isLoading = true;
         state.isForgot = false
          state.isLogin = false
          state.isLogout = false
          state.isVerify = false
          state.isReset = false
          state.isSign = false
        state.isCheck=false
        state.isSendOTP=false
        state.isChangePassword=false
        state.isGetUser=false
        state.isEdit=false
        state.isCheckDevice=false
        state.isVerifyDevice=false
        state.isVerifySign=false
      })
      .addCase(verifyDevice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isEdit=false
        state.isVerifyDevice=true

        state.message = action.payload; // Reset user state to initial
        
      })
      
      .addCase(verifyDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isEdit=false
        state.isVerifyDevice=true

        state.message = action.payload as any;
      })

      .addCase(verifySign.pending, (state) => {
        state.isLoading = true;
         state.isForgot = false
          state.isLogin = false
          state.isLogout = false
          state.isVerify = false
          state.isReset = false
          state.isSign = false
        state.isCheck=false
        state.isSendOTP=false
        state.isChangePassword=false
        state.isGetUser=false
        state.isEdit=false
        state.isCheckDevice=false
        state.isVerifyDevice=false
        state.isVerifySign=false
      })
      .addCase(verifySign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isEdit=false
        state.isVerifySign=true

        state.message = action.payload; // Reset user state to initial
        
      })
      
      .addCase(verifySign.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isEdit=false
        state.isVerifySign=true

        state.message = action.payload as any;
      })
      .addCase(resetState, () => initialState);
  },
});

export default user.reducer