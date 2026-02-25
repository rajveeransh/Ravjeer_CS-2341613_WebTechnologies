/**
 * services/productService.js
 *
 * All product-related API calls, centralised here
 * so pages don't contain raw axios calls.
 */

import axios from 'axios';

const BASE = '/api/products';

export const productService = {
  // Get paginated products with optional filters
  getAll: (params = {}) =>
    axios.get(BASE, { params }).then((r) => r.data),

  // Get featured products for homepage
  getFeatured: () =>
    axios.get(`${BASE}/featured`).then((r) => r.data),

  // Get single product by ID or slug
  getById: (id) =>
    axios.get(`${BASE}/${id}`).then((r) => r.data),

  // Get all available categories
  getCategories: () =>
    axios.get(`${BASE}/categories`).then((r) => r.data),

  // Submit a review
  addReview: (productId, reviewData) =>
    axios.post(`${BASE}/${productId}/reviews`, reviewData).then((r) => r.data),
};
