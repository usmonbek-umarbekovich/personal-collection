import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import collectionService from '../services/collectionService';
import { formatTime } from '../helpers';
import AuthorInfo from './AuthorInfo';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import { FaCheckDouble } from 'react-icons/fa';

function Collections() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    collectionService
      .getCollections({
        limit: 6,
        'meta.numItems': 'desc',
      })
      .then(data => {
        setCollections(data);
      });
  }, []);

  return (
    <section className="border-bottom pt-lg-5 py-4 px-2">
      <Container fluid="md">
        <h2 className="fs-4">
          <FaCheckDouble className="fs-5" /> Top Largest Collections
        </h2>
        <Row as="ul" className="g-4 pt-3 pt-lg-4 px-0">
          {collections.map((col, index) => (
            <Col key={col._id} sm="6" lg="4" className="lh-1">
              <Stack direction="horizontal" className="align-items-start gap-3">
                <p className="fs-3 fw-bold text-secondary opacity-75 mt-1">
                  0{index + 1}
                </p>
                <Stack>
                  <AuthorInfo user={col.user} size="sm" />
                  <Stack>
                    <Link to={`collections/${col._id}`} className="text-reset">
                      <p className="fs-5 fw-bold">{col.name}</p>
                      {col.description && (
                        <p className="fs-5 lh-sm">{col.description}</p>
                      )}
                    </Link>
                  </Stack>
                  <Stack
                    gap="2"
                    direction="horizontal"
                    className="align-items-start text-muted">
                    <p>
                      <Badge bg="info">{col.meta.numItems}</Badge> item
                      {col.meta.numItems > 1 ? 's' : ''}
                    </p>
                    <p>-</p>
                    <p>{formatTime(col.createdAt, 'medium')}</p>
                  </Stack>
                </Stack>
              </Stack>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Collections;
