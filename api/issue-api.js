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
  return requestInstance(token).get(`${baseURL}/issues`, { params });
};

export const show = (id, token, params = {}) => {
  return requestInstance(token).get(`${baseURL}/issues/${id}`, { params });
};

export const create = (token, params = {}) => {
  return requestInstance(token).post(`${baseURL}/issues`, params);
};

export const update = (id, token, params = {}) => {
  return requestInstance(token).put(`${baseURL}/issues/${id}`, params);
};

export const destroy = (id, token, params = {}) => {
  return requestInstance(token).delete(`${baseURL}/issues/${id}`, { params });
};

export const restore = (id, token, params = {}) => {
  return requestInstance(token).get(`${baseURL}/issues/restore/${id}`, { params });
};

export const dashboard = (token, params = {}) => {
  return requestInstance(token).get(`${baseURL}/dashboard/issues/count`, { params });
};
