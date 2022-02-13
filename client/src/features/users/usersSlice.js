import UsersService from '../../services/UsersService';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { extractRequestError } from '../../app/util';
import Status from '../../app/status';

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState({
  status: Status.Idle,
  isLoaded: false,
});

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (refresh, { rejectWithValue }) => {
    try {
      return await UsersService.getAll();
    } catch (error) {
      return rejectWithValue(extractRequestError(error));
    }
  },
  {
    condition: (refresh = false, { getState }) => {
      const { status, isLoaded } = getState().users;
      if (status === Status.Loading) return false;
      return refresh || !isLoaded;
    },
  }
);

export const addUser = createAsyncThunk('users/userAdded', async (user, { rejectWithValue }) => {
  try {
    return await UsersService.create(user);
  } catch (error) {
    return rejectWithValue(extractRequestError(error));
  }
});

export const deleteUser = createAsyncThunk('users/userDeleted', async (userId) => {
  await UsersService.remove(userId);
  return userId;
});

export const updateUser = createAsyncThunk(
  'users/userUpdated',
  async ({ userId, user }, { rejectWithValue }) => {
    try {
      const updatedUser = await UsersService.update(userId, user);
      return { id: userId, changes: updatedUser };
    } catch (error) {
      return rejectWithValue(extractRequestError(error));
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        usersAdapter.setAll(state, action);
        state.status = Status.Success;
        state.isLoaded = true;
      })
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = Status.Loading;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = Status.Failed;
        state.error = action.payload ? action.payload : action.error;
      })
      .addCase(addUser.fulfilled, usersAdapter.addOne)
      .addCase(deleteUser.fulfilled, usersAdapter.removeOne)
      .addCase(updateUser.fulfilled, usersAdapter.updateOne);
  },
});

export default usersSlice.reducer;
export const {} = usersSlice.actions;

export const {
  selectById: selectUserById,
  selectAll: selectAllUsers,
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
} = usersAdapter.getSelectors((state) => state.users);
