import { useEffect, useMemo } from 'react';
import { useUserInfo } from '../contexts/userInfoContext';
import collectionService from '../services/collectionService';
import itemService from '../services/itemService';
import Showcase from '../components/Showcase';
import Collections from '../components/Collections';
import Items from '../components/Items';
import Tags from '../components/Tags';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Dashboard() {
  const { user } = useUserInfo();
  const colQuery = useMemo(() => ({ 'meta.numItems': -1, limit: 6 }), []);
  const itemQuery = useMemo(() => ({ createdAt: -1, limit: 6 }), []);

  useEffect(() => {
    document.title = 'Personal Collection';
  }, []);

  return (
    <>
      {!user && <Showcase />}
      <section className="border-bottom pt-lg-5 py-4 px-2">
        <Container fluid="md">
          <Collections
            fill={false}
            indexes={true}
            showUser={true}
            topCollections={true}
            maxWords={10}
            maxChars={100}
            query={colQuery}
            callback={collectionService.getAllCollections}
          />
        </Container>
      </section>
      <main className="py-lg-5 px-2">
        <Container fluid="md">
          <Row className="justify-content-between align-items-start">
            <Col
              lg={{ span: 4, order: 'last' }}
              className="tags sticky-lg-top border-bottom py-lg-0 py-3"
              style={{ top: 'calc(var(--nav-height) + 2.5rem)' }}>
              <Tags callback={itemService.getAllTags} />
            </Col>
            <Col lg={{ span: 8, order: 'first' }} className="py-lg-0 py-3">
              <Items
                showUser={true}
                showCollection={true}
                query={itemQuery}
                isUserAuthorized={!!user}
                callback={itemService.getAllItems}
              />
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
}
export default Dashboard;
