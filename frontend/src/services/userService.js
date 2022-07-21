import { getById, getPartialData } from './helpers';

const API_URL = '/api/users';

const getSingleUser = getById(API_URL);
const getUserItems = id => getPartialData(`${API_URL}/${id}/items`);
const getUserCollections = id => getPartialData(`${API_URL}/${id}/collections`);

const userService = {
  getSingleUser,
  getUserItems,
  getUserCollections,
};

export default userService;
