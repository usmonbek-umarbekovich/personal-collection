import { useState, useEffect, useMemo } from 'react';
import useLazyLoad from '../hooks/useLazyLoad';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function Tags({ callback }) {
  const [skip, setSkip] = useState(0);
  const params = useMemo(() => ({ limit: 10, skip }), [skip]);
  const [tags, loading, hasMore] = useLazyLoad(params, callback);

  useEffect(() => {
    if (loading) return;
    if (hasMore) setSkip(prevSkip => prevSkip + params.limit);
  }, [hasMore, loading, params.limit]);

  return (
    <Col
      lg={{ span: 4, order: 'last' }}
      className="tags position-lg-sticky sticky-lg-top border-bottom py-lg-0 py-3"
      style={{ top: 'calc(79px + 2.5rem)' }}>
      <Row className="g-3 row-cols-auto justify-content-lg-start justify-content-center">
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
