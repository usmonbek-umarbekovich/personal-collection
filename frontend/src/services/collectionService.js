import axios from 'axios';
import { getById, getPartialData } from './helpers';

const API_URL = 'https://personal-collection-wrol.onrender.com/api/collections';

const getSingleCollection = getById(API_URL);
const getAllCollections = getPartialData(API_URL);
const getAllTopics = getPartialData(`${API_URL}/topics/all`);
const getCollectionTags = id => getPartialData(`${API_URL}/${id}/tags`);
const getCollectionItems = id => getPartialData(`${API_URL}/${id}/items`);

const createCollection = async ({ data }) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const updateCollection = async ({ id, data }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const deleteCollection = async id => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    return error.response;
  }
};

const collectionService = {
  getAllCollections,
  getSingleCollection,
  getCollectionItems,
  getCollectionTags,
  getAllTopics,
  createCollection,
  updateCollection,
  deleteCollection,
};

export default collectionService;
