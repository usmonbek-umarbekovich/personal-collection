import axios from 'axios';

const API_URL = '/api/collections';

const getCollections = async params => {
  try {
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const getOwnCollections = async (limit, skip, controller) => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      params: { limit, skip },
      signal: controller.signal,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const getCollectionTopics = async (limit, skip, controller) => {
  try {
    const response = await axios.get(`${API_URL}/topics`, {
      params: { limit, skip },
      signal: controller.signal,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const createCollection = async data => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const collectionService = {
  getCollections,
  getCollectionTopics,
  getOwnCollections,
  createCollection,
};

export default collectionService;
