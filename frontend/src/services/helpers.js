import axios from 'axios';

export const getPartialData = url => async (params, controller) => {
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
