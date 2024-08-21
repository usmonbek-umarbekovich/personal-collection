import axios from 'axios';
import { makeAuthRequest } from './helpers';

const API_URL = 'https://personal-collection-wrol.onrender.com/api/auth';

const register = makeAuthRequest(`${API_URL}/signup`);
const login = makeAuthRequest(`${API_URL}/login`);

const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`);
  } catch (error) {
    return error.response;
  }
};

const authService = {
  login,
  logout,
  register,
};

export default authService;
