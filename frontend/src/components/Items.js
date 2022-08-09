import { Link, useNavigate } from 'react-router-dom';
import useObserver from '../hooks/useObserver';
import { timeDiff, truncate } from '../helpers';
import { useUserInfo } from '../contexts/userInfoContext';
import itemService from '../services/itemService';
import LoadingBalls from './LoadingBalls';
import AuthorInfo from './AuthorInfo';
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import {
  FaPen,
  FaTrashAlt,
  FaHeart,
  FaRegHeart,
  FaRegComment,
} from 'react-icons/fa';

function Items({
  query,
  callback,
  showUser,
  showCollection,
  isUserAuthorized,
  state = null,
  maxWords = 15,
  maxChars = 180,
}) {
  const navigate = useNavigate();
  const { user } = useUserInfo();
  const [items, lastItemElement, loading, setItems] = useObserver(
    query,
    callback
  );

  const handleDelete = id => {
    itemService.deleteItem(id).then(() => {
      window.location.reload();
    });
  };

  const handleLikeOrUnlike = id => {
    if (!user) return navigate('/login');

    itemService.likeOrUnlikeItem(id).then(() => {
      setItems(prevItems =>
        prevItems.map(item => {
          if (item._id === id) {
            if (item.likes[user._id]) {
              delete item.likes[user._id];
              item.likeCount--;
            } else {
              item.likes[user._id] = user._id;
              item.likeCount++;
            }
          }
          return item;
        })
      );
    });
  };

  return (
    <Stack gap="5" className="lh-1">
      {items.map((item, index) => (
        <Stack
          gap="5"
          key={item._id}
          direction="horizontal"
          className="align-items-center"
          ref={items.length === index + 1 ? lastItemElement : null}>
          <Stack className="justify-content-center">
            {showUser && <AuthorInfo user={item.user} weight="bolder" />}
            <Stack className="flex-grow-0">
              <Link className="text-reset" to={`/items/${item._id}`}>
                <p className="fs-4 fw-bold text-break">{item.name}</p>
                {item.description && (
                  <p className="fs-5 lh-sm text-break">
                    {truncate(item.description, maxWords, maxChars)}
                  </p>
                )}
              </Link>
            </Stack>
            <Stack
              gap="2"
              direction="horizontal"
              className="align-items-center text-muted">
              <p>{timeDiff(item.createdAt, 'item', 'long', true)}</p>
              {showCollection && (
                <>
                  <p>-</p>
                  <Link
                    className="text-reset"
                    to={`/collections/${item.collectionId._id}`}>
                    <p>{item.collectionId.name}</p>
                  </Link>
                </>
              )}
            </Stack>
            <Stack gap="4" direction="horizontal" className="mb-3">
              <Stack
                gap="2"
                direction="horizontal"
                className="align-items-center">
                <Button
                  size="sm"
                  variant="dark"
                  style={{ boxShadow: 'none' }}
                  onClick={() => handleLikeOrUnlike(item._id)}
                  className="p-0 bg-transparent border-0">
                  {item.likes[user?._id] ? (
                    <FaHeart className="text-danger" fontSize={25} />
                  ) : (
                    <FaRegHeart className="text-dark" fontSize={25} />
                  )}
                </Button>
                {item.likeCount > 0 && (
                  <span className="text-dark fs-4">{item.likeCount}</span>
                )}
              </Stack>
              <Stack
                gap="2"
                direction="horizontal"
                className="align-items-center">
                <Button
                  size="sm"
                  variant="dark"
                  style={{ boxShadow: 'none' }}
                  className="p-0 bg-transparent border-0">
                  <Link to={`/items/${item._id}#comments`}>
                    <FaRegComment className="text-dark" fontSize={25} />
                  </Link>
                </Button>
                {item.commentCount > 0 && (
                  <span className="text-dark fs-4">{item.commentCount}</span>
                )}
              </Stack>
              {(user?._id === item.user._id || user?._id === item.user) && (
                <Stack gap="2" direction="horizontal">
                  <Button
                    size="sm"
                    variant="warning"
                    title="Edit"
                    className="p-0">
                    <Link
                      to={`/items/edit/${item._id}`}
                      state={item}
                      className="d-flex text-reset px-2 py-2">
                      <FaPen />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    title="Delete"
                    onClick={() => handleDelete(item._id)}>
                    <FaTrashAlt />
                  </Button>
                </Stack>
              )}
            </Stack>
            <Stack
              gap="2"
              direction="horizontal"
              className="align-items-center">
              {item.tags.map(tag => (
                <Button key={tag._id} variant="secondary" className="fw-bolder">
                  {tag.name}
                </Button>
              ))}
            </Stack>
          </Stack>
          <div
            style={{ width: '12rem', height: '9rem' }}
            className="bg-secondary d-none d-sm-block flex-shrink-0">
            {item.picture && <Image src={item.picture} alt={item.name} />}
          </div>
        </Stack>
      ))}
      {loading && <LoadingBalls />}
      {!loading && items.length === 0 && (
        <Stack gap="2">
          <h2 className="display-6 mx-auto">There is no item</h2>
          {isUserAuthorized && (
            <p className="fs-3">
              Let's
              <Link to="/items/create" state={state} className="mx-2">
                create
              </Link>
              one!
            </p>
          )}
        </Stack>
      )}
    </Stack>
  );
}
export default Items;
