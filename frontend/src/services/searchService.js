import { getPartialData } from './helpers';

const API_URL = '/api/search';
const getSearchResults = getPartialData(API_URL);

const searchService = { getSearchResults };
export default searchService;
