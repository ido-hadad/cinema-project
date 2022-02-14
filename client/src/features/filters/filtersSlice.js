import { createSelector, createSlice } from '@reduxjs/toolkit';
import { selectAllMovies } from '../movies/moviesSlice';

const initialState = {
  movie: '',
  moviePage: 1,
  moviePageSize: 20,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    movieFilterChanged: (state, action) => {
      state.movie = (action.payload ?? '').toString();
      state.moviePage = 1;
    },
    moviePageChanged: (state, action) => {
      const page = parseInt(action.payload);
      if (isNaN(page) || page == null) {
        state.moviePage = 1;
      } else {
        state.moviePage = page;
      }
    },
    moviePageSizeChange: (state, action) => {
      const size = parseInt(action.payload);
      state.moviePage = 1;
      if (isNaN(size) || size == null) {
        state.moviePageSize = 20;
      } else {
        state.moviePageSize = size;
      }
    },
  },
});

export const selectMovieFilter = (state) => state.filters.movie;
export const selectMovieFilterPage = (state) => state.filters.moviePage;
export const selectMovieFilterPageSize = (state) => state.filters.moviePageSize;
export const { movieFilterChanged, moviePageChanged, moviePageSizeChange } = filtersSlice.actions;
export default filtersSlice.reducer;

export const selectFilteredMovies = createSelector(
  selectAllMovies,
  selectMovieFilter,
  (movies, filter) => {
    const filterLower = filter.toLowerCase();
    return filter === ''
      ? movies
      : movies.filter((movie) => movie.name?.toString().toLowerCase().includes(filterLower));
  }
);

export const selectFilteredMoviesPage = createSelector(
  selectFilteredMovies,
  selectMovieFilterPage,
  selectMovieFilterPageSize,
  (movies, currentPage, size) => {
    const pages = Math.ceil(movies.length / size);
    let matchedMovies;
    if (currentPage > pages || currentPage < 0) {
      matchedMovies = [];
    } else {
      matchedMovies = movies.slice((currentPage - 1) * size, currentPage * size);
    }
    return {
      movies: matchedMovies,
      currentPage,
      totalPages: pages,
      pageSize: size,
    };
  }
);

export const selectTotalPages = createSelector(
  selectFilteredMovies,
  selectMovieFilterPageSize,
  (movies, size) => Math.ceil(movies.length / size)
);

export const selectFilteredMoviesTotal = createSelector(
  selectFilteredMovies,
  (movies) => movies.length
);
