const axios = require('axios');

const BASE_API_URL = 'https://jsonplaceholder.typicode.com/users';

const getAll = async () => axios.get(BASE_API_URL).then((response) => response.data);

module.exports = { getAll };
