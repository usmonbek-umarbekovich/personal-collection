import { useState, useRef, useCallback } from 'react';
import useItemGet from '../hooks/useItemGet';
import LoadingBalls from '../components/LoadingBalls';
import { getFullName, formatTime } from '../helpers';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

function Items() {
  const [skip, setSkip] = useState(0);
  const { loading, items, hasMore } = useItemGet(5, skip);

  const observer = useRef();
  const lastItemElement = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setSkip(prevSkip => prevSkip + 5);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <Col lg={6}>
      <Stack gap="5" className="lh-1">
        {items.map((item, index) => (
          <Row
            key={item._id}
            className="align-items-center"
            ref={items.length === index + 1 ? lastItemElement : null}>
            <Col md={10}>
              <Stack>
                <Stack
                  gap="2"
                  direction="horizontal"
                  className="align-items-end py-2">
                  <div
                    style={{ width: '1.75rem', height: '1.75rem' }}
                    className="bg-secondary rounded-circle">
                    {item.collectionId.user.picture && (
                      <Image
                        src={item.collectionId.user.picture}
                        alt={getFullName(item.collectionId.user.name)}
                      />
                    )}
                  </div>
                  <p className="fw-bolder" style={{ lineHeight: 0 }}>
                    {getFullName(item.collectionId.user.name)}
                  </p>
                </Stack>
                <p className="fs-4 fw-bold">{item.name}</p>
                {item.description && <p className="fs-5">{item.description}</p>}
                <Stack
                  gap="2"
                  direction="horizontal"
                  className="align-items-start text-muted">
                  <p>{formatTime(item.createdAt)}</p>
                  <p>-</p>
                  <p>{item.collectionId.name}</p>
                </Stack>
                <Stack
                  gap="2"
                  direction="horizontal"
                  className="align-items-center">
                  {item.tags.slice(0, 3).map(tag => (
                    <Button
                      key={tag._id}
                      variant="secondary"
                      className="fw-bolder">
                      {tag.name}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Col>
            <Col md={2}>
              <div
                style={{ width: '12rem', height: '9rem' }}
                className="bg-secondary">
                {item.picture && <Image src={item.picture} alt={item.name} />}
              </div>
            </Col>
          </Row>
        ))}
        {loading && <LoadingBalls />}
      </Stack>
    </Col>
  );
}
export default Items;
