import axios from 'axios';

export const generateQuiz = (site_name, site_context, count = 6) =>
  axios.post('/api/quiz/generate', { site_name, site_context, count }).then(r => r.data);