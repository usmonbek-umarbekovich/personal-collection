import axios from 'axios';

const API_URL = '/api/item';

const getItems = async (limit, skip, controller) => {
  try {
    const response = await axios.get(API_URL, {
      params: { limit, skip },
      signal: controller.signal,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const getTags = async (limit, skip, controller) => {
  try {
    const response = await axios.get(`${API_URL}/tags/all`, {
      params: { limit, skip },
      signal: controller.signal,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const createItem = async data => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const itemService = {
  getItems,
  getTags,
  createItem,
};

export default itemService;
