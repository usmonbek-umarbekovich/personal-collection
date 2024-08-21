import axios from 'axios';
import { getById, getPartialData } from './helpers';

const API_URL = 'https://personal-collection-wrol.onrender.com/api/items';

const getSingleItem = getById(API_URL);
const getAllItems = getPartialData(API_URL);
const getAllTags = getPartialData(`${API_URL}/tags/all`);
const getItemTags = id => getPartialData(`${API_URL}/${id}/tags`);
const getItemsByTag = id => getPartialData(`${API_URL}/tags/${id}`);
const getItemComments = id => getPartialData(`${API_URL}/${id}/comments`);

const createItem = async ({ data }) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const updateItem = async ({ id, data }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const deleteItem = async id => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    return error.response;
  }
};

const createComment = async ({ itemId, data }) => {
  try {
    const response = await axios.post(`${API_URL}/${itemId}/comments`, data);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const updateComment = async ({ itemId, commentId, data }) => {
  try {
    const response = await axios.put(
      `${API_URL}/${itemId}/comments/${commentId}`,
      data
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const deleteComment = async ({ itemId, commentId }) => {
  try {
    await axios.delete(`${API_URL}/${itemId}/comments/${commentId}`);
  } catch (error) {
    return error.response;
  }
};

const likeOrUnlikeItem = async id => {
  try {
    const response = await axios.post(`${API_URL}/${id}/likes`);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const itemService = {
  getSingleItem,
  getAllItems,
  getAllTags,
  getItemTags,
  getItemsByTag,
  getItemComments,
  createItem,
  updateItem,
  deleteItem,
  createComment,
  updateComment,
  deleteComment,
  likeOrUnlikeItem,
};

export default itemService;
