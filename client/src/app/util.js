export function debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export function loadUserToken() {
  const tokenString = localStorage.getItem('userToken');
  if (tokenString) return JSON.parse(tokenString);
  return null;
}

export function saveUserToken(token) {
  localStorage.setItem('userToken', JSON.stringify(token));
}

export function dateToInput(date) {
  if (!date || !(date instanceof Date)) return '';
  return date.toISOString().slice(0, 10);
}

export const extractRequestError = (error) => {
  const err = {};
  if (error.response) {
    const { data } = error.response;
    if (typeof data === 'object' && Object.keys(data).length > 0) {
      const { error: message, ...rest } = data;
      err.message = message;
      Object.assign(err, rest);
    } else if ([401, 403].includes(error.response.status)) {
      err.message = 'You do not have the required permission.';
    } else {
      err.message = `${error.response.status} - ${error.response.statusText}`;
    }
  } else if (error.request) {
    err.message = `No response from server - ${error.message}`;
  } else {
    err.message = error.message;
  }
  return err;
};
