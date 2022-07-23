import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import itemService from '../services/itemService';
import { timeDiff } from '../helpers';
import Tags from '../components/Tags';
import Comments from '../components/Comments';
import AuthorInfo from '../components/AuthorInfo';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { FaComment } from 'react-icons/fa';

function SingleItem() {
  const [item, setItem] = useState();
  const commentQuery = useMemo(() => ({ limit: 6 }), []);
  const { id } = useParams();

  useEffect(() => {
    itemService.getSingleItem(id).then(setItem);
  }, [id]);

  if (!item) return null;

  return (
    <main className="px-2 py-4 py-lg-0">
      <Container fluid="md">
        <Row as="section">
          <Col as="section" lg={7} className="py-lg-5 pe-lg-5">
            <AuthorInfo
              fontSize="lg"
              picSize="md"
              user={item.user}
              description={timeDiff(item.createdAt, 'item', 'long')}
              root="../.."
            />
            <h1 className="lh-base">{item.name}</h1>
            {item.description && (
              <p className="text-secondary fs-4">{item.description}</p>
            )}
            <div
              style={{ height: '20rem' }}
              className="bg-secondary w-100 my-5">
              {item.picture && <Image src={item.picture} alt={item.name} />}
            </div>
            <Tags callback={itemService.getItemTags(id)} />
          </Col>
          <Col as="section" lg={5} className="my-lg-0 mt-5">
            <Stack
              className="border sticky-lg-top"
              style={{
                top: 'calc(var(--nav-height) + 1.75rem)',
                maxHeight: 'calc(100vh - var(--nav-height) - 3rem)',
              }}>
              <Comments
                itemId={item._id}
                query={commentQuery}
                callback={itemService.getItemComments(id)}
              />
            </Stack>
          </Col>
        </Row>
      </Container>
      <Button
        onClick={() => document.querySelector('#comment-form input').focus()}
        className="position-fixed bottom-0 start-50 translate-middle-x rounded-pill mb-3 d-lg-none opacity-75">
        <FaComment className="me-1" /> Comments
      </Button>
    </main>
  );
}
export default SingleItem;
