import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import { hasPermission, Permissions } from '../../app/permissions';
import { selectCurrentUser } from '../login/loginSlice';

function SubscriptionsNav() {
  const user = useSelector(selectCurrentUser);
  return (
    <>
      <div className="bg-dark-2 mb-3">
        <Container>
          <Nav variant="tabs" className="my-tabs" defaultActiveKey="/subs">
            {hasPermission(user, Permissions.ViewSubscription) && (
              <Nav.Item>
                <Nav.Link as={NavLink} to="/subs" end>
                  All Members
                </Nav.Link>
              </Nav.Item>
            )}

            {hasPermission(user, Permissions.CreateSubscription) && (
              <Nav.Item>
                <Nav.Link as={NavLink} to="/subs/create/">
                  Add Member
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
          {/* <h1>Member Subscriptions</h1> */}
        </Container>
      </div>
      <Container>
        <Outlet />
      </Container>
    </>
  );
}

export default SubscriptionsNav;
