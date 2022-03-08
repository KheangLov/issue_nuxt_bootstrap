import axios from 'axios';

const baseURL = 'https://issue-app-api.herokuapp.com/api/v1';
const requestInstance = token => {
  return axios.create({
    headers: {
      'Authorization': token
    }
  });
};

export const list = (token, params = {}) => {
  return requestInstance(token).get(`${baseURL}/users`, { params });
};

export const show = (id, token, params = {}) => {
  return requestInstance(token).get(`${baseURL}/users/${id}`, { params });
};

export const create = (token, params = {}) => {
  return requestInstance(token).post(`${baseURL}/users`, params);
};

export const update = (id, token, params = {}) => {
  return requestInstance(token).put(`${baseURL}/users/${id}`, params);
};

export const disable = (id, token, params = {}) => {
  return requestInstance(token).put(`${baseURL}/users/disable/${id}`, params);
};

export const destroy = (id, token, params = {}) => {
  return requestInstance(token).delete(`${baseURL}/users/${id}`, { params });
};

export const restore = (id, token, params = {}) => {
  return requestInstance(token).get(`${baseURL}/users/restore/${id}`, { params });
};
