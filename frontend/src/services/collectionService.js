import axios from 'axios';
import { getById, getPartialData } from './helpers';

const API_URL = '/api/collections';

const getSingleCollection = getById(API_URL);
const getAllCollections = getPartialData(API_URL);
const getAllTopics = getPartialData(`${API_URL}/all/topics`);
const getCollectionTags = id => getPartialData(`${API_URL}/${id}/tags`);
const getCollectionItems = id => getPartialData(`${API_URL}/${id}/items`);

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
  getAllCollections,
  getSingleCollection,
  getCollectionItems,
  getCollectionTags,
  getAllTopics,
  createCollection,
  updateCollection,
};

export default collectionService;
