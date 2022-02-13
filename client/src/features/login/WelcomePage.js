import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import PageLoadError from '../../app/PageLoadError';
import { selectCurrentUser, test } from './loginSlice';

function WelcomePage() {
  const user = useSelector(selectCurrentUser);

  const displayName = user.name || user.username;

  return (
    <Container>
      <div className="p-3">Welcome {displayName}!</div>
    </Container>
  );
}

export default WelcomePage;
