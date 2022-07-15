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

const getCollectionItems = id => async (limit, skip, controller) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/items`, {
      params: { limit, skip },
      signal: controller.signal,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const getCollectionTags = id => async (limit, skip, controller) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/tags`, {
      params: { limit, skip },
      signal: controller.signal,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const getSingleCollection = async id => {
  try {
    const response = await axios.get(`${API_URL}/single/${id}`);
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

const updateCollection = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const collectionService = {
  getCollections,
  getCollectionItems,
  getCollectionTags,
  getCollectionTopics,
  getOwnCollections,
  getSingleCollection,
  createCollection,
  updateCollection,
};

export default collectionService;
