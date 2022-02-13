const axios = require('axios');

const BASE_API_URL = 'https://api.tvmaze.com/shows';

const getAll = async () => axios.get(BASE_API_URL).then((response) => response.data);

module.exports = { getAll };
