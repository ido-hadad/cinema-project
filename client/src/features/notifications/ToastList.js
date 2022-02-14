import React from 'react';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast, selectNotificationById, selectNotificationIds } from './notificationsSlice';

function ToastList() {
  const ids = useSelector(selectNotificationIds);
  return (
    <div>
      <ToastContainer position="top-center" className="p-3 position-fixed" style={{ zIndex: 20 }}>
        {ids.map((id) => (
          <ToastItem key={id} id={id} />
        ))}
      </ToastContainer>
    </div>
  );
}

function ToastItem({ id }) {
  const dispatch = useDispatch();
  const toast = useSelector((state) => selectNotificationById(state, id));
  return (
    <Toast onClose={() => dispatch(removeToast(id))} bg="light">
      <Toast.Header className="">
        {toast.type === 'error' && (
          <i className="fa fa-exclamation-circle me-2 text-danger" aria-hidden="true"></i>
        )}
        <strong className="me-auto">{toast.title}</strong>
      </Toast.Header>
      <Toast.Body>{toast.message}</Toast.Body>
    </Toast>
  );
}

export default ToastList;
