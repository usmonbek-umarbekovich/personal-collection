import { getPartialData } from './helpers';

const API_URL = 'https://personal-collection-wrol.onrender.com/api/search';
const getSearchResults = getPartialData(API_URL);

const searchService = { getSearchResults };
export default searchService;
