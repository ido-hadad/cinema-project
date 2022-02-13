import SubscriptionsService from '../../services/SubscriptionsService';
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import { deleteMovie, selectAllMovies, selectMovieById } from '../movies/moviesSlice';
import Status from '../../app/status';
import { extractRequestError } from '../../app/util';
import { deleteMember, selectMemberById } from '../members/membersSlice';
import { showToast } from '../notifications/notificationsSlice';

const subscriptionsAdapter = createEntityAdapter({ selectId: (entity) => entity.memberId });

const initialState = subscriptionsAdapter.getInitialState({
  status: Status.Idle,
  isLoaded: false,
});

export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async (refresh, { rejectWithValue }) => {
    try {
      return await SubscriptionsService.getAll();
    } catch (error) {
      return rejectWithValue(extractRequestError(error));
    }
  },
  {
    condition: (refresh = false, { getState }) => {
      const { status, isLoaded } = getState().subscriptions;
      if (status === Status.Loading) return false;
      return refresh || !isLoaded;
    },
  }
);

export const addSubscription = createAsyncThunk(
  'subscriptions/subscriptionAdded',
  async ({ memberId, subscription }, { dispatch, getState }) => {
    try {
      const updatedSubs = await SubscriptionsService.addSubscription(memberId, subscription);
      return updatedSubs;
    } catch (error) {
      const movie = selectMovieById(getState(), subscription.movieId);
      const { message } = extractRequestError(error);
      dispatch(
        showToast({
          type: 'error',
          title: `Add subscription ${movie ? `'${movie.name}' ` : ''}failed`,
          message,
        })
      );
      throw error; // reject
    }
  }
);

export const removeSubscription = createAsyncThunk(
  'subscriptions/subscriptionDeleted',
  async ({ memberId, movieId }, { dispatch, getState }) => {
    try {
      await SubscriptionsService.removeSubscription(memberId, movieId);
      return { memberId, movieId };
    } catch (error) {
      const movie = selectMovieById(getState(), movieId);
      const { message } = extractRequestError(error);
      dispatch(
        showToast({
          type: 'error',
          title: `Remove subscription ${movie ? `'${movie.name}' ` : ''}failed`,
          message,
        })
      );
      throw error; // reject
    }
  }
);

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        subscriptionsAdapter.setAll(state, action);
        state.status = Status.Success;
        state.isLoaded = true;
      })
      .addCase(fetchSubscriptions.pending, (state, action) => {
        state.status = Status.Loading;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.status = Status.Failed;
        state.error = action.payload ? action.payload : action.error;
      })
      .addCase(addSubscription.fulfilled, subscriptionsAdapter.upsertOne)
      .addCase(removeSubscription.fulfilled, (state, action) => {
        const { memberId, movieId } = action.payload;
        const member = state.entities[memberId];
        if (!member) return state;
        member.movies = member.movies.filter((sub) => sub.movieId !== movieId);
      })
      .addCase(deleteMember.fulfilled, subscriptionsAdapter.removeOne)
      .addCase(deleteMovie.fulfilled, (state, action) => {
        const movieId = action.payload;

        Object.values(state.entities).forEach((member) => {
          const subs = member.movies;
          const movieIndex = subs.findIndex((movie) => movie.movieId === movieId);
          if (movieIndex !== -1) {
            subs.splice(movieIndex, 1);
          }
        });
      });
  },
});

export default subscriptionsSlice.reducer;
export const {} = subscriptionsSlice.actions;

export const {
  selectById: selectSubscriptionById,
  selectAll: selectAllSubscriptions,
  selectIds: selectSubscriptionIds,
  selectEntities: selectSubscriptionEntities,
} = subscriptionsAdapter.getSelectors((state) => state.subscriptions);

export const selectMovieSubs = createSelector(selectAllSubscriptions, (subs) => {
  const subsByMovie = new Map();
  subs.forEach((memberSubs) => {
    memberSubs.movies.forEach((sub) => {
      if (!subsByMovie.get(sub.movieId)) subsByMovie.set(sub.movieId, []);

      const arr = subsByMovie.get(sub.movieId);
      arr.push({ memberId: memberSubs.memberId, date: sub.date });
    });
  });
  return subsByMovie;
});

export const selectMovieSubsById = (state, id) => selectMovieSubs(state).get(id);
export const selectUnwatchedMoviesByMemberId = createSelector(
  selectSubscriptionById,
  selectAllMovies,
  (memberSubs, movies) => {
    if (!memberSubs || !memberSubs.movies.length) return movies;

    const subs = memberSubs.movies;
    const watchedIds = new Set(subs.map((sub) => sub.movieId));
    const unwatchedMovies = movies.filter((movie) => !watchedIds.has(movie.id));
    return unwatchedMovies;
  }
);
