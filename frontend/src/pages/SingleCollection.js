import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserInfo();

  useEffect(() => {
    collectionService.getSingleCollection(id).then(setCollection);
  }, [id]);

  const handleDelete = id => {
    collectionService.deleteCollection(id).then(() => {
      navigate(-1);
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
            {user?._id === collection.user._id && (
              <Stack gap="2" direction="horizontal" className="my-3">
                <Button
                  as={Link}
                  to="/items/create"
                  state={{
                    collectionId: {
                      _id: collection._id,
                      name: collection.name,
                    },
                  }}
                  size="sm"
                  variant="info"
                  title="Add Item"
                  className="fs-5 pt-0">
                  <FaPlus />
                </Button>
                <Button
                  as={Link}
                  to={`/collections/edit/${collection._id}`}
                  state={collection}
                  size="sm"
                  variant="warning"
                  title="Edit"
                  className="fs-5 pt-0">
                  <FaPen />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  title="Delete"
                  onClick={() => handleDelete(collection._id)}
                  className="fs-5 pt-0">
                  <FaTrashAlt />
                </Button>
              </Stack>
            )}
            {collection.description && (
              <p className="text-secondary fs-4">{collection.description}</p>
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
                state={{
                  collectionId: {
                    _id: collection._id,
                    name: collection.name,
                  },
                }}
                showUser={false}
                showCollection={false}
                query={itemQuery}
                isUserAuthorized={user?._id === collection.user._id}
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
