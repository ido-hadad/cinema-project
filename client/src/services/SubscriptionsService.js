import axios from 'axios';

const baseUrl = 'http://localhost:3010/api/subscriptions';

let token = null;

const getConfig = () => (token === null ? {} : { headers: { Authorization: 'Bearer ' + token } });

export const getAll = async () => axios.get(baseUrl, getConfig()).then((response) => response.data);
export const getByMember = async (memberId) =>
  axios.get(`${baseUrl}/${memberId}`, getConfig()).then((response) => response.data);
export const addSubscription = async (memberId, data) =>
  axios.post(`${baseUrl}/${memberId}`, data, getConfig()).then((response) => response.data);
export const removeSubscription = async (memberId, movieId) =>
  axios
    .delete(`${baseUrl}/${memberId}`, { ...getConfig(), data: { movieId } })
    .then((response) => response.data);

export const setToken = (value) => (token = value);

const SubscriptionsService = {
  getAll,
  getByMember,
  addSubscription,
  removeSubscription,
  setToken,
};

export default SubscriptionsService;
