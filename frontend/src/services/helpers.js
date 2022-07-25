import axios from 'axios';

const getById = url => async (id) => {
  try {
    const response = await axios.get(`${url}/${id}`);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const getPartialData = url => async (params, controller) => {
  try {
    const response = await axios.get(url, {
      params,
      signal: controller.signal,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

/**
 * @desc Helper function for login and signup
 */
const makeAuthRequest = url => {
  let controller;

  return async userData => {
    try {
      if (controller) controller.abort();

      controller = new AbortController();
      return await axios.post(url, userData, {
        signal: controller.signal,
      });
    } catch (error) {
      return error.response;
    }
  };
};

export { getById, getPartialData, makeAuthRequest };
