import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import searchService from '../services/searchService';
import Items from '../components/Items';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const term = searchParams.get('term');

  useEffect(() => {
    document.title = 'Search';
  }, []);

  const query = useMemo(() => {
    if (term) return { term, limit: 6 };
  }, [term]);

  if (!query) return null;

  return (
    <main className="py-5 px-2">
      <Container fluid="md">
        <Col md="8" className="mx-auto">
          <Items
            showUser={true}
            showCollection={true}
            query={query}
            callback={searchService.getSearchResults}
          />
        </Col>
      </Container>
    </main>
  );
}

export default Search;
