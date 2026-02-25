/**
 * services/designService.js
 */
import axios from 'axios';

const BASE = '/api/designs';

export const designService = {
  create:       (data)      => axios.post(BASE, data).then((r) => r.data),
  getMine:      ()          => axios.get(`${BASE}/mine`).then((r) => r.data),
  getById:      (id)        => axios.get(`${BASE}/${id}`).then((r) => r.data),
  update:       (id, data)  => axios.put(`${BASE}/${id}`, data).then((r) => r.data),
  delete:       (id)        => axios.delete(`${BASE}/${id}`).then((r) => r.data),
  uploadImage:  (formData)  =>
    axios.post(`${BASE}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
};
