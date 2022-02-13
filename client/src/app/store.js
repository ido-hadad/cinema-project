import { combineReducers, configureStore } from '@reduxjs/toolkit';
import loginReducer, { userLoggedOut } from '../features/login/loginSlice';
import membersReducer from '../features/members/membersSlice';
import moviesReducer from '../features/movies/moviesSlice';
import subscriptionsReducer from '../features/subscriptions/subscriptionsSlice';
import usersReducer from '../features/users/usersSlice';
import filtersReducer from '../features/filters/filtersSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';

const appReducer = combineReducers({
  login: loginReducer,
  members: membersReducer,
  movies: moviesReducer,
  subscriptions: subscriptionsReducer,
  users: usersReducer,
  filters: filtersReducer,
  notifications: notificationsReducer,
});

const rootReducer = (state, action) => {
  // reset store on logout
  if (action.type === userLoggedOut.type) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});
