import axios from 'axios';
import { getPartialData } from './helpers';

const API_URL = '/api/items';

const getAllItems = getPartialData(API_URL);
const getAllTags = getPartialData(`${API_URL}/all/tags`);

const createItem = async data => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const itemService = {
  getAllItems,
  getAllTags,
  createItem,
};

export default itemService;
