import axios from 'axios';
import { getById, getPartialData } from './helpers';

const API_URL = '/api/users';

const getSingleUser = getById(API_URL);
const getUserItems = id => getPartialData(`${API_URL}/${id}/items`);
const getUserCollections = id => getPartialData(`${API_URL}/${id}/collections`);

const blockOrUnblockUser = async id => {
  try {
    const response = await axios.post(`${API_URL}/${id}/block`);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const userService = {
  getSingleUser,
  getUserItems,
  getUserCollections,
  blockOrUnblockUser,
};

export default userService;
