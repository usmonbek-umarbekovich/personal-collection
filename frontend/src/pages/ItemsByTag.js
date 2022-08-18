import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import itemService from '../services/itemService';
import Items from '../components/Items';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

function ItemsByTag() {
  const location = useLocation();

  const query = useMemo(() => ({ limit: 6 }), []);
  const callback = useCallback(
    async (params, controller) => {
      return itemService.getItemsByTag(location.state.id)(params, controller);
    },
    [location.state.id]
  );

  return (
    <main className="py-5 px-2">
      <Container fluid="md">
        <Col md="8" className="mx-auto">
          <Items
            query={query}
            callback={callback}
            showUser={true}
            showCollection={true}
          />
        </Col>
      </Container>
    </main>
  );
}
export default ItemsByTag;
