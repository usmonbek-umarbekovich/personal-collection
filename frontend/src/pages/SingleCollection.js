import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import collectionService from '../services/collectionService';
import { timeDiff } from '../helpers';
import Items from '../components/Items';
import Tags from '../components/Tags';
import AuthorInfo from '../components/AuthorInfo';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function SingleCollection() {
  const [collection, setCollection] = useState();
  const itemQuery = useMemo(() => ({ createdAt: 'desc', limit: 6 }), []);
  const { id } = useParams();

  useEffect(() => {
    collectionService.getSingleCollection(id).then(setCollection);
  }, [id]);

  if (!collection) return null;

  return (
    <main>
      <section className="border-bottom py-lg-5 px-2 pt-4">
        <Container fluid="md">
          <AuthorInfo
            fontSize="lg"
            picSize="md"
            user={collection.user}
            description={timeDiff(collection.createdAt, 'item', 'long')}
            root="../.."
          />
          <h1 className="lh-base">{collection.name}</h1>
          {collection.description && (
            <p className="text-secondary fs-4">{collection.description}</p>
          )}
        </Container>
      </section>
      <section className="py-lg-5 px-2 pb-4">
        <Container fluid="md">
          <Row className="justify-content-between align-items-start">
            <Col
              lg={{ span: 4, order: 'last' }}
              className="tags position-lg-sticky sticky-lg-top border-bottom py-lg-0 py-3"
              style={{ top: 'calc(var(--nav-height) + 2.5rem)' }}>
              <Tags callback={collectionService.getCollectionTags(id)} />
            </Col>
            <Col lg={{ span: 8, order: 'first' }} className="py-lg-0 py-3">
              <Items
                showUser={false}
                showCollection={false}
                query={itemQuery}
                callback={collectionService.getCollectionItems(id)}
                root="../.."
              />
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
export default SingleCollection;
