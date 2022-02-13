import MoviesService from '../../services/MoviesService';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

import Status from '../../app/status';
import { extractRequestError } from '../../app/util';
import { showToast } from '../notifications/notificationsSlice';

const moviesAdapter = createEntityAdapter();

const initialState = moviesAdapter.getInitialState({
  status: Status.Idle,
  isLoaded: false,
});

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (refresh, { rejectWithValue }) => {
    try {
      return await MoviesService.getAll();
    } catch (error) {
      return rejectWithValue(extractRequestError(error));
    }
  },
  {
    condition: (refresh = false, { getState }) => {
      const { status, isLoaded } = getState().movies;
      if (status === Status.Loading) return false;
      return refresh || !isLoaded;
    },
  }
);

export const addMovie = createAsyncThunk(
  'movies/movieAdded',
  async (movie, { rejectWithValue }) => {
    try {
      return await MoviesService.create(movie);
    } catch (error) {
      return rejectWithValue(extractRequestError(error));
    }
  }
);

export const deleteMovie = createAsyncThunk(
  'movies/movieDeleted',
  async (movieId, { dispatch, getState }) => {
    try {
      await MoviesService.remove(movieId);
      return movieId;
    } catch (error) {
      const { message } = extractRequestError(error);
      const movie = selectMovieById(getState(), movieId);
      dispatch(
        showToast({
          type: 'error',
          title: `Delete ${movie.name ? `'${movie.name}'` : 'movie'} failed`,
          message,
        })
      );
    }
  }
);

export const updateMovie = createAsyncThunk(
  'movies/movieUpdated',
  async ({ movieId, movie }, { rejectWithValue }) => {
    try {
      const updatedMovie = await MoviesService.update(movieId, movie);
      return { id: movieId, changes: updatedMovie };
    } catch (error) {
      return rejectWithValue(extractRequestError(error));
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.fulfilled, (state, action) => {
        moviesAdapter.setAll(state, action);
        state.status = Status.Success;
        state.isLoaded = true;
      })
      .addCase(fetchMovies.pending, (state, action) => {
        state.status = Status.Loading;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = Status.Failed;
        state.error = action.payload ? action.payload : action.error;
      })
      .addCase(addMovie.fulfilled, moviesAdapter.addOne)
      .addCase(deleteMovie.fulfilled, moviesAdapter.removeOne)
      .addCase(updateMovie.fulfilled, moviesAdapter.updateOne);
  },
});

export default moviesSlice.reducer;
export const {} = moviesSlice.actions;

export const {
  selectById: selectMovieById,
  selectAll: selectAllMovies,
  selectIds: selectMovieIds,
  selectEntities: selectMovieEntities,
} = moviesAdapter.getSelectors((state) => state.movies);
