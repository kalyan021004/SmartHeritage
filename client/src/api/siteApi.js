import axios from 'axios';

const BASE = '/api/sites';

export const searchSites = (q) =>
  axios.get(`${BASE}/search`, { params: { q } }).then(r => r.data);

export const getSiteBySlug = (slug) =>
  axios.get(`${BASE}/${slug}`).then(r => r.data);

export const getAllSites = () =>
  axios.get(`${BASE}/all`).then(r => r.data);

export const generateSite = (place_name) =>
  axios.post(`${BASE}/generate`, { place_name }).then(r => r.data);

// ✅ COMPLETE THIS
export const getSitesByState = (state) =>
  axios.get(`${BASE}/bystate`, { params: { state } }).then(r => r.data);


export const getSiteSection = (slug, section) =>
  axios
    .get(`${BASE}/${slug}/${section}`)
    .then(r => r.data);