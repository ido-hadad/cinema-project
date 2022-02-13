import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';
import { AdminPermissions } from '../../app/permissions';
import Protected from '../../app/Protected';

function UsersNav() {
  return (
    <div>
      <Protected permission={AdminPermissions.ManageUsers} hide>
        <div className="bg-dark-2 mb-3">
          <Container>
            <Nav variant="tabs" className="my-tabs" defaultActiveKey="/users">
              <Nav.Item>
                <Nav.Link as={NavLink} to="/users" end>
                  All Users
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link as={NavLink} to="/users/create/">
                  Add Users
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Container>
        </div>
      </Protected>

      <Container>
        <Outlet />
      </Container>
    </div>
  );
}

export default UsersNav;
