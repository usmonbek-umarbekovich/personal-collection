import { useState, useEffect } from 'react';
import collectionService from '../services/collectionService';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import { FaCheckDouble } from 'react-icons/fa';

function Collections() {
  const [collections, setCollections] = useState([]);

  const getFullName = name => `${name.first} ${name.last}`;
  const formatTime = rawTime => {
    const parsed = new Date(rawTime);
    const intl = new Intl.DateTimeFormat([], {
      dateStyle: 'medium',
    });
    return intl.format(parsed);
  };

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
    <section className="border-bottom mb-3 py-5">
      <Container>
        <h2 className="fs-4">
          <FaCheckDouble className="fs-5" /> Top Largest Collections
        </h2>
        <Row as="ul" className="g-4 pt-4 px-0">
          {collections.map((col, index) => (
            <Col key={col._id} md="6" lg="4" className="lh-1">
              <Stack direction="horizontal" className="align-items-start gap-3">
                <p className="fs-3 fw-bold text-secondary opacity-75 mt-1">
                  0{index + 1}
                </p>
                <Stack>
                  <Stack
                    gap="2"
                    direction="horizontal"
                    className="align-items-end py-2">
                    <div
                      style={{ width: '1.75rem', height: '1.75rem' }}
                      className="bg-secondary rounded-circle">
                      {col.user.picture && (
                        <Image
                          src={col.user.picture}
                          alt={getFullName(col.user.name)}
                        />
                      )}
                    </div>
                    <p className="fw-bolder" style={{ lineHeight: 0 }}>
                      {getFullName(col.user.name)}
                    </p>
                  </Stack>
                  <p className="fs-5 fw-bold">{col.name}</p>
                  <Stack
                    gap="2"
                    direction="horizontal"
                    className="align-items-start text-muted">
                    <p>
                      <Badge bg="info">{col.meta.numItems}</Badge> item
                      {col.meta.numItems > 1 ? 's' : ''}
                    </p>
                    <p>-</p>
                    <p>{formatTime(col.createdAt)}</p>
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
