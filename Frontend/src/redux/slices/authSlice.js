import api from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getUserDetails = createAsyncThunk(
  'auth/getUserDetails',
  async ({userId,token}, { rejectWithValue }) => {
    try {
      // We pass the userId into the 'X-User-Id' header as your backend expects
      const response = await api.get('/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-Id': userId
        }
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'User Profile Sync Failed');
    }
  }
);

const tokenFromStorage = localStorage.getItem("token");
const userFromStorage = localStorage.getItem("user");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    token: tokenFromStorage || null,
    isAuthenticated: !!tokenFromStorage,
    currentUser: null, // This stores the full UserResponse from the backend
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'

  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.status = 'succeeded';

      // 🔐 persist
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.currentUser = null;
      localStorage.clear();
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload; // Full profile stored here
      })
      .addCase(getUserDetails.rejected, (state) => {
        state.status = 'failed';
      });
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
