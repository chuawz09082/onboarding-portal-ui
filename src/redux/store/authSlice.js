import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../lib/http';

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await API.post('/api/login', { username, password });
      const token = res.data?.access_token;
      if (!token) return rejectWithValue('Login failed: missing token');
      sessionStorage.setItem('access_token', token);
      return { token };
    } catch (e) {
      const status = e?.response?.status;
      return rejectWithValue(status === 401 ? 'Invalid username/email or password' : 'Login failed');
    }
  }
);

const slice = createSlice({
  name: 'auth',
  initialState: {
    status: 'idle',
    error: null,
    token: sessionStorage.getItem('access_token') || localStorage.getItem('access_token') || null
  },
  reducers: {
    // NEW: setToken so we can sync Redux after register/auto-login
    setToken(state, action) {
      state.token = action.payload || null;
    },
    logout(state) {
      state.token = null;
      sessionStorage.removeItem('access_token');
      localStorage.removeItem('access_token');
    }
  },
  extraReducers: (b) => {
    b
      .addCase(login.pending,   (s) => { s.status = 'loading';   s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.status = 'succeeded'; s.token = a.payload.token; })
      .addCase(login.rejected,  (s, a) => { s.status = 'failed';  s.error = a.payload || 'Login failed'; });
  }
});

export const selectToken      = (s) => s.auth.token;
export const selectAuthStatus = (s) => s.auth.status;
export const selectAuthError  = (s) => s.auth.error;

// export setToken so we can use it
export const { logout, setToken } = slice.actions;
export default slice.reducer;














































































