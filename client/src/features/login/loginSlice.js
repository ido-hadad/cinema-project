import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { extractRequestError, saveUserToken } from '../../app/util';
import { LoginService } from '../../services/LoginService';
import MembersService from '../../services/MembersService';
import MoviesService from '../../services/MoviesService';
import SubscriptionsService from '../../services/SubscriptionsService';
import UsersService from '../../services/UsersService';

const initialState = { current: null };
let logoutTimerId = null;

export function setServiceToken(token) {
  MembersService.setToken(token);
  UsersService.setToken(token);
  SubscriptionsService.setToken(token);
  MoviesService.setToken(token);
}

export const logout = () => (dispatch) => {
  clearTimeout(logoutTimerId);
  setServiceToken(null);
  saveUserToken(null);
  dispatch(userLoggedOut());
};

export const userAuthenticated = (user) => async (dispatch) => {
  setServiceToken(user.token);
  saveUserToken(user);

  // basic auto-logout
  clearTimeout(logoutTimerId);
  if (user.expiresAt) {
    console.log('auto logout at: ', new Date(user.expiresAt * 1000));
    logoutTimerId = setTimeout(() => dispatch(logout()), user.expiresAt * 1000 - Date.now());
  }

  dispatch(userLoggedOn(user));
};

export const register = createAsyncThunk(
  'login/register',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      await LoginService.createAccount(username, password);
    } catch (error) {
      return rejectWithValue(extractRequestError(error));
    }
  }
);

export const login = createAsyncThunk(
  'login/login',
  async ({ username, password }, { dispatch, rejectWithValue }) => {
    try {
      const { user, error } = await LoginService.login(username, password);

      if (error) {
        throw new Error(error);
      }
      dispatch(userAuthenticated(user));
      return user;
    } catch (err) {
      return rejectWithValue(extractRequestError(err));
    }
  }
);

export const test = createAsyncThunk('test/test', async (data, { rejectWithValue }) => {
  //await UsersService.getById('1');

  // return rejectWithValue('blalba');
  // return 'how';
  throw new Error('TOKEN EXPIRED');
});

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    userLoggedOut(state) {
      state.current = null;
    },
    userLoggedOn(state, action) {
      state.current = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export default loginSlice.reducer;
export const { userLoggedOut, userLoggedOn } = loginSlice.actions;

export const selectCurrentUser = (state) => state.login.current;
