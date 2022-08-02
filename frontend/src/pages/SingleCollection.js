import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import collectionService from '../services/collectionService';
import { useUserInfo } from '../contexts/userInfoContext';
import { timeDiff } from '../helpers';
import Items from '../components/Items';
import Tags from '../components/Tags';
import AuthorInfo from '../components/AuthorInfo';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FaPlus, FaPen, FaTrashAlt } from 'react-icons/fa';

function SingleCollection() {
  const [collection, setCollection] = useState();
  const itemQuery = useMemo(() => ({ createdAt: 'desc', limit: 6 }), []);
  const { id } = useParams();
  const { user } = useUserInfo();

  useEffect(() => {
    collectionService.getSingleCollection(id).then(setCollection);
  }, [id]);

  const handleDelete = id => {
    collectionService.deleteCollection(id).then(() => {
      window.location.reload();
    });
  };

  if (!collection) return null;

  return (
    <main>
      <section className="border-bottom py-lg-5 px-2 pt-4">
        <Container fluid="md">
          <Stack className="align-items-start">
            <AuthorInfo
              fontSize="lg"
              picSize="md"
              user={collection.user}
              description={timeDiff(collection.createdAt, 'item', 'long')}
            />
            <h1 className="lh-base">{collection.name}</h1>
            {collection.description && (
              <p className="text-secondary fs-4">{collection.description}</p>
            )}
            {user?._id === collection.user._id && (
              <Stack gap="2" direction="horizontal" className="fs-5">
                <Link
                  to="/items/create"
                  state={{
                    collectionId: {
                      _id: collection._id,
                      name: collection.name,
                    },
                  }}
                  title="Add Item"
                  className="link-secondary px-1">
                  <FaPlus />
                </Link>
                <Link
                  to={`/collections/edit/${collection._id}`}
                  state={collection}
                  title="Edit"
                  className="link-secondary px-1">
                  <FaPen />
                </Link>
                <Button
                  variant="secondary"
                  title="Delete"
                  onClick={() => handleDelete(collection._id)}
                  className="bg-transparent link-secondary fs-5 border-0 px-1 py-0">
                  <FaTrashAlt />
                </Button>
              </Stack>
            )}
          </Stack>
        </Container>
      </section>
      <section className="py-lg-5 px-2 pb-4">
        <Container fluid="md">
          <Row className="justify-content-between align-items-start">
            <Col
              lg={{ span: 4, order: 'last' }}
              className="tags sticky-lg-top border-bottom py-lg-0 py-3"
              style={{ top: 'calc(var(--nav-height) + 2.5rem)' }}>
              <Tags callback={collectionService.getCollectionTags(id)} />
            </Col>
            <Col lg={{ span: 8, order: 'first' }} className="py-lg-0 py-3">
              <Items
                showUser={false}
                showCollection={false}
                query={itemQuery}
                callback={collectionService.getCollectionItems(id)}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
export default SingleCollection;
