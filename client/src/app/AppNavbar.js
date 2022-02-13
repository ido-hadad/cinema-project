import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout, selectCurrentUser } from '../features/login/loginSlice';
import { AdminPermissions, hasPermission, Permissions } from './permissions';
import { Container, Button, Navbar, Nav } from 'react-bootstrap';

function AppNavbar() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  if (!user) return null;

  const displayName = user.name || user.username;

  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Container>
        <Navbar.Toggle aria-controls="app-nav" />
        <Navbar.Collapse id="app-nav">
          <Nav className="me-auto">
            {hasPermission(user, Permissions.ViewMovie) && (
              <Nav.Link as={NavLink} to="/movies">
                Movies
              </Nav.Link>
            )}
            {hasPermission(user, Permissions.ViewSubscription) && (
              <Nav.Link as={NavLink} to="/subs">
                Subscriptions
              </Nav.Link>
            )}
            {hasPermission(user, AdminPermissions.ManageUsers) && (
              <Nav.Link as={NavLink} to="/users">
                User Management
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Text className="me-2">Signed in as: {displayName}</Navbar.Text>
        <Button variant="outline-light" onClick={() => dispatch(logout())}>
          Logout
        </Button>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
