import { getPartialData } from './helpers';

const API_URL = '/api/items';

const getSearchResults = getPartialData(`${API_URL}/search`);

const searchService = { getSearchResults };

export default searchService;
