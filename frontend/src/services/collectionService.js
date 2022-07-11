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

const collectionService = {
  getCollections,
};

export default collectionService;
