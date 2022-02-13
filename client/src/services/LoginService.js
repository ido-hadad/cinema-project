import axios from 'axios';

const baseUrl = 'http://localhost:3010/api/login';

export const login = async (username, password) =>
  axios.post(baseUrl, { username, password }).then((response) => response.data);
export const createAccount = async (username, password) =>
  axios.post(`${baseUrl}/create`, { username, password });

export const LoginService = {
  login,
  createAccount,
};
