import { Link } from 'react-router-dom';
import { timeDiff, truncate } from '../helpers';
import useObserver from '../hooks/useObserver';
import AuthorInfo from './AuthorInfo';
import LoadingBalls from './LoadingBalls';
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
  maxWords = 15,
  maxChars = 180,
  root = '',
}) {
  const [collections, lastColElement, loading] = useObserver(query, callback, {
    once: topCollections,
  });

  // fill: true | false
  const columns = fill ? { lg: 12 } : { sm: 6, lg: 4 };

  return (
    <div>
      {topCollections && (
        <h2 className="fs-4 pb-3 pb-lg-4">
          <FaCheckDouble className="fs-5" /> Top Largest Collections
        </h2>
      )}
      <Stack>
        <Row as="ul" className="g-4 px-0">
          {collections.map((col, index) => (
            <Col
              key={col._id}
              {...columns}
              className="lh-1"
              ref={collections.length === index + 1 ? lastColElement : null}>
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
                      <p className="fs-5 fw-bold text-break">{col.name}</p>
                      {col.description && (
                        <p className="fs-5 lh-sm text-break">
                          {truncate(col.description, maxWords, maxChars)}
                        </p>
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
                    <p>
                      {timeDiff(
                        col.createdAt,
                        'item',
                        topCollections ? 'medium' : 'long',
                        true
                      )}
                    </p>
                  </Stack>
                </Stack>
              </Stack>
            </Col>
          ))}
        </Row>
        {!topCollections && loading && <LoadingBalls />}
      </Stack>
    </div>
  );
}

export default Collections;
