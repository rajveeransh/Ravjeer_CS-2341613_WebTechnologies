/**
 * services/adminService.js
 */
import axios from 'axios';

const BASE = '/api/admin';

export const adminService = {
  getStats:          ()               => axios.get(`${BASE}/stats`).then((r) => r.data),
  createProduct:     (data)           => axios.post(`${BASE}/products`, data).then((r) => r.data),
  updateProduct:     (id, data)       => axios.put(`${BASE}/products/${id}`, data).then((r) => r.data),
  deleteProduct:     (id)             => axios.delete(`${BASE}/products/${id}`).then((r) => r.data),
  getAllOrders:       (params = {})    => axios.get(`${BASE}/orders`, { params }).then((r) => r.data),
  updateOrderStatus: (id, status)     => axios.put(`${BASE}/orders/${id}/status`, { status }).then((r) => r.data),
  getAllUsers:        ()               => axios.get(`${BASE}/users`).then((r) => r.data),
  updateUserRole:    (id, role)       => axios.put(`${BASE}/users/${id}/role`, { role }).then((r) => r.data),
  deleteUser:        (id)             => axios.delete(`${BASE}/users/${id}`).then((r) => r.data),
};
