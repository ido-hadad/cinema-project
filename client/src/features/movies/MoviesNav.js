import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import { hasPermission, Permissions } from '../../app/permissions';
import { selectCurrentUser } from '../login/loginSlice';
import MovieFilterForm from './MovieFilterForm';

function MoviesNav() {
  const user = useSelector(selectCurrentUser);
  return (
    <div>
      {/* <h1>Movies</h1> */}
      <div className="bg-dark-2 mb-3">
        <Container>
          <Nav variant="tabs" className="my-tabs" defaultActiveKey="/movies">
            {hasPermission(user, Permissions.ViewMovie) && (
              <Nav.Item>
                <Nav.Link as={NavLink} to="/movies" end>
                  All Movies
                </Nav.Link>
              </Nav.Item>
            )}

            {hasPermission(user, Permissions.CreateMovie) && (
              <Nav.Item>
                <Nav.Link as={NavLink} to="/movies/create/">
                  Add Movie
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
        </Container>
      </div>
      {/* <div className="d-flex align-items-center">
        <nav className="d-flex gap-2 mb-3 me-2">
          {hasPermission(user, Permissions.ViewMovie) && (
            <NavLink to="/movies/">All Movies</NavLink>
          )}
          {hasPermission(user, Permissions.CreateMovie) && (
            <NavLink to="/movies/create">Add Movie</NavLink>
          )}
        </nav>
      </div> */}
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}

export default MoviesNav;
