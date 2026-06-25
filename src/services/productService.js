import api from "../api/axios";

export const getProducts = () => api.get("/products/");

export const getProduct = (id) => api.get(`/products/${id}/`);

export const searchProducts = (query) => api.get(`/products/?search=${query}`);
