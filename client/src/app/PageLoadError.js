import React from 'react';

function PageLoadError({
  title = 'Unable to load page',
  reason = 'Failed to retrieve required information from server.',
  error = null,
}) {
  return (
    <div className="d-flex justify-content-center mt-3">
      <div className="load-error-page bg-light border shadow w-100 p-3 rounded-3">
        <h3>{title}</h3>
        <div>{reason}</div>
        <div>{error}</div>
      </div>
    </div>
  );
}

export default PageLoadError;
