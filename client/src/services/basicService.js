import axios from 'axios';

class BasicService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  get config() {
    return this.token === null ? {} : { headers: { Authorization: 'Bearer ' + this.token } };
  }
  getAll() {
    return axios.get(this.baseUrl, this.config).then((response) => response.data);
  }

  getById(id) {
    return axios.get(`${this.baseUrl}/${id}`, this.config).then((response) => response.data);
  }

  create(data) {
    return axios.post(this.baseUrl, data, this.config).then((response) => response.data);
  }

  update(id, data) {
    return axios.put(`${this.baseUrl}/${id}`, data, this.config).then((response) => response.data);
  }

  remove(id) {
    return axios.delete(`${this.baseUrl}/${id}`, this.config);
  }
}

export default BasicService;
