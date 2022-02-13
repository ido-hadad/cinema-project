import { createEntityAdapter, createSlice, nanoid } from '@reduxjs/toolkit';

// const toastFormat = {
//   id,
//   timestamp,
//   type,
//   title,
//   message,
// };

export const showToast =
  ({ type, title, message, duration = 10000 }) =>
  (dispatch) => {
    const toast = { id: nanoid(), timestamp: Date.now(), type, title, message };
    dispatch(addToast(toast));
    setTimeout(() => dispatch(removeToast(toast.id)), duration);
  };

const notificationsAdapter = createEntityAdapter();

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationsAdapter.getInitialState({}),
  reducers: { addToast: notificationsAdapter.addOne, removeToast: notificationsAdapter.removeOne },
});

export const { addToast, removeToast } = notificationsSlice.actions;
export default notificationsSlice.reducer;
export const {
  selectAll: selectAllNotifications,
  selectById: selectNotificationById,
  selectIds: selectNotificationIds,
} = notificationsAdapter.getSelectors((state) => state.notifications);
