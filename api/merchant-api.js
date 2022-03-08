import axios from 'axios';

const baseURL = process.env.API_URL;
const requestInstance = token => {
  return axios.create({
    headers: {
      'Authorization': token
    }
  });
};

export const list = (token, params = {}) => {
  return requestInstance(token).get(`${baseURL}/merchants`, { params });
};

export const show = (id, token, params = {}) => {
  return requestInstance(token).get(`${baseURL}/merchants/${id}`, { params });
};

export const create = (token, params = {}) => {
  return requestInstance(token).post(`${baseURL}/merchants`, params);
};

export const update = (id, token, params = {}) => {
  return requestInstance(token).put(`${baseURL}/merchants/${id}`, params);
};

export const destroy = (id, token, params = {}) => {
  return requestInstance(token).delete(`${baseURL}/merchants/${id}`, { params });
};

export const restore = (id, token, params = {}) => {
  return requestInstance(token).get(`${baseURL}/merchants/restore/${id}`, { params });
};
