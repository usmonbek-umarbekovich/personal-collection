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
    <Row className="g-3 row-cols-auto justify-content-lg-start justify-content-center">
      {tags.map(tag => (
        <Col key={tag._id}>
          <Button variant="secondary" className="fw-bolder">
            {tag.name}
          </Button>
        </Col>
      ))}
    </Row>
  );
}
export default Tags;
