import API from '../lib/http';

export const fetchMeStatus = async () => {
  const { data } = await API.get('/api/me/status'); // Auth server
  return data; // { userId, email, state, missing }
};