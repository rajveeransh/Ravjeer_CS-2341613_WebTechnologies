/**
 * services/orderService.js
 */
import axios from 'axios';

const BASE = '/api/orders';

export const orderService = {
  create:       (orderData) => axios.post(BASE, orderData).then((r) => r.data),
  getMyOrders:  ()          => axios.get(`${BASE}/myorders`).then((r) => r.data),
  getById:      (id)        => axios.get(`${BASE}/${id}`).then((r) => r.data),
  pay:          (id)        => axios.post(`${BASE}/${id}/pay`).then((r) => r.data),
};
