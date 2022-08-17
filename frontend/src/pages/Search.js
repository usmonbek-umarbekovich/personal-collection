import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import searchService from '../services/searchService';
import useObserver from '../hooks/useObserver';
import Items from '../components/Items';
import Collections from '../components/Collections';
import Users from '../components/Users';
import LoadingBalls from '../components/LoadingBalls';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

function Search() {
  const [searchParams] = useSearchParams();
  const term = searchParams.get('term');
  const type = searchParams.get('type');

  const query = useMemo(() => {
    if (term) return { term, type, limit: 6 };
  }, [term, type]);

  useEffect(() => {
    document.title = 'Search';
  }, []);

  let [results, lastElement, loading, setResults] = useObserver(
    query,
    searchService.getSearchResults
  );

  if (results.length === 0) return null; // TODO: show loading

  const { items, collections, users } = results[0];

  return (
    <main className="py-5 px-2">
      <Container fluid="md">
        <Col md="8" className="mx-auto">
          {(type === 'item' || type === 'all') && items.length > 0 && (
            <div
              className={classNames({
                'mb-5': collections.length > 0 || users.length > 0,
              })}>
              <Items showUser={true} showCollection={true} data={items} />
            </div>
          )}
          {(type === 'collection' || type === 'all') && collections.length > 0 && (
            <div className={classNames({ 'mb-5': users.length > 0 })}>
              <Collections
                indexes={false}
                fill={true}
                showUser={true}
                data={collections}
              />
            </div>
          )}
          {(type === 'user' || type === 'all') && users.length > 0 && (
            <Users data={users} />
          )}
          {loading && <LoadingBalls />}
          {!loading &&
            items.length === 0 &&
            collections.length === 0 &&
            users.length === 0 && (
              <h2 className="display-6 text-center">
                Sorry, we could not find anything :(
              </h2>
            )}
        </Col>
      </Container>
    </main>
  );
}

export default Search;
