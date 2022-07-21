import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import itemService from '../services/itemService';
import { timeDiff } from '../helpers';
import Comments from '../components/Comments';
import AuthorInfo from '../components/AuthorInfo';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function SingleItem() {
  const [item, setItem] = useState();
  const commentQuery = useMemo(() => ({ limit: 6 }), []);
  const { id } = useParams();

  useEffect(() => {
    itemService.getSingleItem(id).then(setItem);
  }, [id]);

  if (!item) return null;

  return (
    <main className="px-2">
      <Container fluid="md">
        <Row as="section">
          <Col as="section" lg={7} className="py-lg-5">
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
          </Col>
          <Col as="section" lg={5} className="border my-lg-5 pt-lg-1 px-0">
            <Comments
              itemId={item._id}
              query={commentQuery}
              callback={itemService.getComments(id)}
            />
          </Col>
        </Row>
      </Container>
    </main>
  );
}
export default SingleItem;
