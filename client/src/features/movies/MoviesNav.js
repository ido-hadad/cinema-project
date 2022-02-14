import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';
import { Permissions } from '../../app/permissions';
import Protected from '../../app/Protected';

function MoviesNav() {
  return (
    <div>
      <div className="bg-dark-2 mb-3">
        <Container>
          <Nav variant="tabs" className="my-tabs" defaultActiveKey="/movies">
            <Protected permission={Permissions.ViewMovie} hide>
              <Nav.Item>
                <Nav.Link as={NavLink} to="/movies" end>
                  All Movies
                </Nav.Link>
              </Nav.Item>
            </Protected>

            <Protected permission={Permissions.CreateMovie} hide>
              <Nav.Item>
                <Nav.Link as={NavLink} to="/movies/create/">
                  Add Movie
                </Nav.Link>
              </Nav.Item>
            </Protected>
          </Nav>
        </Container>
      </div>
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}

export default MoviesNav;
