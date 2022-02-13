import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

function LoadingSpinner() {
  return (
    <div
      className="text-center d-flex align-items-center justify-content-center"
      style={{ height: '300px' }}
    >
      <div>
        <Spinner animation="border" role="status" />
        <div className="my-2 h5">Loading...</div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
