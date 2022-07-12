import { useState, useEffect } from 'react';
import useLazyLoad from '../hooks/useLazyLoad';
import itemService from '../services/itemService';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function Tags() {
  const [skip, setSkip] = useState(0);
  const [tags, loading, hasMore] = useLazyLoad(10, skip, itemService.getTags);

  useEffect(() => {
    if (loading) return;
    if (hasMore) setSkip(prevSkip => prevSkip + 10);
  }, [hasMore, loading]);

  return (
    <Col
      lg={{ span: 4, order: 'last' }}
      className="position-lg-sticky sticky-lg-top border-bottom pb-4 mb-4"
      style={{ top: 'calc(76px + 2.5rem)' }}>
      <Row className="g-2 align-items-start justify-content-start">
        {tags.map(tag => (
          <Col key={tag._id}>
            <Button variant="secondary" className="fw-bolder">
              {tag.name}
            </Button>
          </Col>
        ))}
      </Row>
    </Col>
  );
}
export default Tags;
