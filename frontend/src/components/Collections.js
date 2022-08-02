import { Link } from 'react-router-dom';
import { timeDiff, truncate } from '../helpers';
import { useUserInfo } from '../contexts/userInfoContext';
import useObserver from '../hooks/useObserver';
import collectionService from '../services/collectionService';
import classNames from 'classnames';
import AuthorInfo from './AuthorInfo';
import CollapseContent from './CollapseContent';
import LoadingBalls from './LoadingBalls';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import { FaCheckDouble, FaPlus, FaPen, FaTrashAlt } from 'react-icons/fa';

function Collections({
  callback,
  showUser,
  indexes,
  fill,
  query,
  topCollections,
  isUserAuthorized,
  maxWords = 15,
  maxChars = 180,
}) {
  const [collections, lastColElement, loading] = useObserver(query, callback, {
    once: topCollections,
  });
  const { user } = useUserInfo();

  // fill: true | false
  const columns = fill ? { lg: 12 } : { sm: 6, lg: 4 };

  const handleDelete = id => {
    collectionService.deleteCollection(id).then(() => {
      window.location.reload();
    });
  };

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
              <Stack direction="horizontal" className="align-items-start">
                {indexes && (
                  <p className="fs-3 fw-bold text-secondary opacity-75 mt-1 me-3">
                    0{index + 1}
                  </p>
                )}
                <Stack>
                  {showUser && <AuthorInfo user={col.user} weight="bolder" />}
                  <Stack>
                    <Link className="text-reset" to={`/collections/${col._id}`}>
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
                    className="align-items-center text-muted">
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
                {(user?._id === col.user._id || user?._id === col.user) && (
                  <CollapseContent
                    controlId="collection-control"
                    iconSize={2}
                    btnProps={{
                      variant: 'outline-secondary',
                      style: { width: '2rem', height: '2rem' },
                      className: 'border-0',
                    }}
                    listProps={{
                      className: classNames(
                        { 'mt-1': topCollections },
                        'end-0'
                      ),
                    }}>
                    <ListGroup.Item
                      action
                      variant="dark"
                      className="text-nowrap p-0">
                      <Link
                        to="/items/create"
                        state={{
                          collectionId: { _id: col._id, name: col.name },
                        }}
                        className="d-flex text-reset px-4 py-2 ps-3 fw-bolder">
                        <FaPlus className="me-2" /> Add Item
                      </Link>
                    </ListGroup.Item>
                    <ListGroup.Item
                      action
                      variant="dark"
                      className="text-nowrap p-0">
                      <Link
                        to={`/collections/edit/${col._id}`}
                        state={col}
                        className="d-flex text-reset px-4 py-2 ps-3 fw-bolder">
                        <FaPen className="me-2" /> Edit
                      </Link>
                    </ListGroup.Item>
                    <ListGroup.Item
                      action
                      variant="dark"
                      onClick={() => handleDelete(col._id)}
                      className="text-nowrap px-4 ps-3 fw-bolder">
                      <FaTrashAlt className="me-1" /> Delete
                    </ListGroup.Item>
                  </CollapseContent>
                )}
              </Stack>
            </Col>
          ))}
        </Row>
        {!topCollections && loading && <LoadingBalls />}
        {!topCollections && !loading && collections.length === 0 && (
          <Stack gap="2">
            <h2 className="display-6">There is no collection yet</h2>
            {isUserAuthorized && (
              <p className="fs-3">
                Go ahead and
                <Link to="/collections/create" className="mx-2">
                  create
                </Link>
                one!
              </p>
            )}
          </Stack>
        )}
      </Stack>
    </div>
  );
}

export default Collections;
