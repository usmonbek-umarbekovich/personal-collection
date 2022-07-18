import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatTime } from '../helpers';
import useLazyLoad from '../hooks/useLazyLoad';
import AuthorInfo from './AuthorInfo';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import { FaCheckDouble } from 'react-icons/fa';

function Collections({
  callback,
  showUser,
  indexes,
  fill,
  query,
  topCollections,
  root = '',
}) {
  // fill: true | false
  const columns = {
    true: { lg: 12 },
    false: { sm: 6, lg: 4 },
  };

  const [skip, setSkip] = useState(0);
  const params = useMemo(() => ({ skip, ...query }), [query, skip]);
  const [collections, loading, hasMore] = useLazyLoad(params, callback);

  useEffect(() => {
    if (loading) return;
    if (hasMore && !topCollections) setSkip(prevSkip => prevSkip + query.limit);
  }, [loading, hasMore, query.limit, topCollections]);

  return (
    <div>
      {topCollections && (
        <h2 className="fs-4 pb-3 pb-lg-4">
          <FaCheckDouble className="fs-5" /> Top Largest Collections
        </h2>
      )}
      <Row as="ul" className="g-4 px-0">
        {collections.map((col, index) => (
          <Col key={col._id} {...columns[fill]} className="lh-1">
            <Stack direction="horizontal" className="align-items-start gap-3">
              {indexes && (
                <p className="fs-3 fw-bold text-secondary opacity-75 mt-1">
                  0{index + 1}
                </p>
              )}
              <Stack>
                {showUser && (
                  <AuthorInfo user={col.user} weight="bolder" root={root} />
                )}
                <Stack>
                  <Link
                    className="text-reset"
                    to={`${root}/collections/${col._id}`}>
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
    </div>
  );
}

export default Collections;
