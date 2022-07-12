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

const itemService = {
  getItems,
};

export default itemService;
