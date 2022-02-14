import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';
import { Permissions } from '../../app/permissions';
import Protected from '../../app/Protected';

function SubscriptionsNav() {
  return (
    <>
      <div className="bg-dark-2 mb-3">
        <Container>
          <Nav variant="tabs" className="my-tabs" defaultActiveKey="/subs">
            <Protected permission={Permissions.ViewSubscription} hide>
              <Nav.Item>
                <Nav.Link as={NavLink} to="/subs" end>
                  All Members
                </Nav.Link>
              </Nav.Item>
            </Protected>

            <Protected permission={Permissions.CreateSubscription} hide>
              <Nav.Item>
                <Nav.Link as={NavLink} to="/subs/create/">
                  Add Member
                </Nav.Link>
              </Nav.Item>
            </Protected>
          </Nav>
        </Container>
      </div>
      <Container>
        <Outlet />
      </Container>
    </>
  );
}

export default SubscriptionsNav;
