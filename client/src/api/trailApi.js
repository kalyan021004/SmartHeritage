import axios from 'axios';

export const generateTrail = (form) =>
  axios.post('/api/trail/generate', form).then(r => r.data);