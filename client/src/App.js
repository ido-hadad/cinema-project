import './App.css';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import AppNavbar from './app/AppNavbar';
import { loadUserToken, saveUserToken } from './app/util';
import {
  login,
  logout,
  selectCurrentUser,
  setServiceToken,
  userAuthenticated,
} from './features/login/loginSlice';
import WelcomePage from './features/login/WelcomePage';
import AddMemberPage from './features/members/AddMemberPage';
import EditMemberPage from './features/members/EditMemberPage';
import AddMoviePage from './features/movies/AddMoviePage';
import AllMoviesPage from './features/movies/AllMoviesPage';
import EditMoviePage from './features/movies/EditMoviePage';
import MoviesNav from './features/movies/MoviesNav';
import AllSubscriptionsPage from './features/subscriptions/AllSubscriptionsPage';
import SubscriptionsNav from './features/subscriptions/SubscriptionsNav';
import AddUserPage from './features/users/AddUserPage';
import AllUsersPage from './features/users/AllUsersPage';
import EditUserPage from './features/users/EditUserPage';
import UsersNav from './features/users/UsersNav';

import { Container } from 'react-bootstrap';
import LoginPage from './features/login/LoginPage';
import CreateAccountPage from './features/login/CreateAccountPage';

import { Permissions } from './app/permissions';

import Protected from './app/Protected';
import ViewMoviePage from './features/movies/ViewMoviePage';
import ViewMemberPage from './features/members/ViewMemberPage';
import ToastList from './features/notifications/ToastList';

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    const user = loadUserToken();

    if (user && (!user.expiresAt || user.expiresAt > Date.now() / 1000)) {
      dispatch(userAuthenticated(user));
    }
  }, [dispatch]);

  return (
    <div className="App">
      <header>
        <AppNavbar />
      </header>
      <main>
        {/* <Container> */}
        {!currentUser ? (
          <Routes>
            <Route path="*" element={<LoginPage />} />
            <Route path="/register" element={<CreateAccountPage />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="users" element={<UsersNav />}>
              <Route path="edit/:id" element={<EditUserPage />} />
              <Route path="create" element={<AddUserPage />} />
              <Route path="" element={<AllUsersPage />} />
            </Route>
            <Route path="movies" element={<MoviesNav />}>
              <Route path="edit/:id" element={<EditMoviePage />} />
              <Route path="create" element={<AddMoviePage />} />
              <Route path=":id" element={<ViewMoviePage />} />
              <Route path="" element={<AllMoviesPage />} />
            </Route>
            <Route path="subs" element={<SubscriptionsNav />}>
              <Route path="edit/:id" element={<EditMemberPage />} />
              <Route path="create" element={<AddMemberPage />} />
              <Route path=":id" element={<ViewMemberPage />} />
              <Route path="" element={<AllSubscriptionsPage />} />
            </Route>
          </Routes>
        )}
        <ToastList />
        {/* </Container> */}
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
