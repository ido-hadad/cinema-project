import MembersService from '../../services/MembersService';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { extractRequestError } from '../../app/util';
import Status from '../../app/status';
import { showToast } from '../notifications/notificationsSlice';

const membersAdapter = createEntityAdapter();

const initialState = membersAdapter.getInitialState({
  status: Status.Idle,
  isLoaded: false,
});

export const fetchMembers = createAsyncThunk(
  'members/fetchMembers',
  async (refresh, { rejectWithValue }) => {
    try {
      return await MembersService.getAll();
    } catch (error) {
      return rejectWithValue(extractRequestError(error));
    }
  },
  {
    condition: (refresh = false, { getState }) => {
      const { status, isLoaded } = getState().members;
      if (status === Status.Loading) return false;
      return refresh || !isLoaded;
    },
  }
);

export const addMember = createAsyncThunk(
  'members/memberAdded',
  async (member, { rejectWithValue }) => {
    try {
      return await MembersService.create(member);
    } catch (error) {
      return rejectWithValue(extractRequestError(error));
    }
  }
);

export const deleteMember = createAsyncThunk(
  'members/memberDeleted',
  async (memberId, { dispatch, getState }) => {
    try {
      await MembersService.remove(memberId);
      return memberId;
    } catch (error) {
      const { message } = extractRequestError(error);
      const member = selectMemberById(getState(), memberId);
      dispatch(
        showToast({
          type: 'error',
          title: `Delete ${member ? `'${member.name}'` : 'member'} failed`,
          message,
        })
      );
    }
  }
);

export const updateMember = createAsyncThunk(
  'members/memberUpdated',
  async ({ memberId, member }, { rejectWithValue }) => {
    try {
      const updatedMember = await MembersService.update(memberId, member);
      return { id: memberId, changes: updatedMember };
    } catch (error) {
      return rejectWithValue(extractRequestError(error));
    }
  }
);

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.fulfilled, (state, action) => {
        membersAdapter.setAll(state, action);
        state.status = Status.Success;
        state.isLoaded = true;
      })
      .addCase(fetchMembers.pending, (state, action) => {
        state.status = Status.Loading;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.status = Status.Failed;
        state.error = action.payload ? action.payload : action.error;
      })
      .addCase(addMember.fulfilled, membersAdapter.addOne)
      .addCase(deleteMember.fulfilled, membersAdapter.removeOne)
      .addCase(updateMember.fulfilled, membersAdapter.updateOne);
  },
});

export default membersSlice.reducer;
export const {} = membersSlice.actions;

export const {
  selectById: selectMemberById,
  selectAll: selectAllMembers,
  selectIds: selectMemberIds,
  selectEntities: selectMemberEntities,
} = membersAdapter.getSelectors((state) => state.members);
