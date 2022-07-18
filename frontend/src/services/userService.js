import axios from 'axios';
import { getPartialData } from './helpers';

const API_URL = '/api/users';

const getSingleUser = async id => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const getUserItems = id => getPartialData(`${API_URL}/${id}/items`);
const getUserCollections = id => getPartialData(`${API_URL}/${id}/collections`);

const userService = {
  getSingleUser,
  getUserItems,
  getUserCollections,
};

export default userService;
