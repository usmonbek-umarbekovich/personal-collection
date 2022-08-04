import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import itemService from '../services/itemService';
import { useUserInfo } from '../contexts/userInfoContext';
import { timeDiff } from '../helpers';
import Tags from '../components/Tags';
import Comments from '../components/Comments';
import AuthorInfo from '../components/AuthorInfo';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import {
  FaPen,
  FaTrashAlt,
  FaHeart,
  FaComment,
  FaRegComment,
  FaRegHeart,
} from 'react-icons/fa';

function SingleItem() {
  const [item, setItem] = useState();
  const commentQuery = useMemo(() => ({ limit: 6 }), []);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserInfo();

  useEffect(() => {
    itemService.getSingleItem(id).then(setItem);
  }, [id]);

  useEffect(() => {
    if (!item) return;
    document.title = item.name;
  }, [item]);

  const handleDelete = id => {
    itemService.deleteItem(id).then(() => {
      navigate(-1);
    });
  };

  const handleCommentScroll = () => {
    document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' });
    document.querySelector('#comment-form input')?.focus();
  };

  const handleAddComment = () => {
    setItem(prevItem => ({
      ...prevItem,
      commentCount: prevItem.commentCount + 1,
    }));
  };

  const handleLikeOrUnlike = id => {
    if (!user) return navigate('/login');

    itemService.likeOrUnlikeItem(id).then(() => {
      setItem(prevItem => {
        if (prevItem.likes[user._id]) {
          delete prevItem.likes[user._id];
          prevItem.likeCount--;
        } else {
          prevItem.likes[user._id] = user._id;
          prevItem.likeCount++;
        }
        return { ...prevItem };
      });
    });
  };

  if (!item) return null;

  return (
    <main className="px-2 py-4 py-lg-0">
      <Container fluid="md">
        <Row as="section">
          <Col as="section" lg={7} className="py-lg-5 pe-lg-5">
            <AuthorInfo
              fontSize="lg"
              picSize="md"
              user={item.user}
              description={timeDiff(item.createdAt, 'item', 'long')}
            />
            <h1 className="lh-base">{item.name}</h1>
            <Stack gap="4" direction="horizontal" className="my-3">
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
                  onClick={handleCommentScroll}
                  style={{ boxShadow: 'none' }}
                  className="p-0 bg-transparent border-0">
                  <FaRegComment className="text-dark" fontSize={25} />
                </Button>
                {item.commentCount > 0 && (
                  <span className="text-dark fs-4">{item.commentCount}</span>
                )}
              </Stack>
              {user?._id === item.user._id && (
                <Stack gap="2" direction="horizontal">
                  <Button
                    as={Link}
                    to={`/items/edit/${item._id}`}
                    state={item}
                    size="sm"
                    variant="warning"
                    title="Edit"
                    className="fs-5 pt-0">
                    <FaPen />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    title="Delete"
                    onClick={() => handleDelete(item._id)}
                    className="fs-5 pt-0">
                    <FaTrashAlt />
                  </Button>
                </Stack>
              )}
            </Stack>
            {item.description && (
              <p className="text-secondary fs-4">{item.description}</p>
            )}
            <div
              style={{ height: '20rem' }}
              className="bg-secondary w-100 my-5">
              {item.picture && <Image src={item.picture} alt={item.name} />}
            </div>
            <Tags callback={itemService.getItemTags(id)} />
          </Col>
          <Col as="section" lg={5} id="comments" className="my-lg-0 mt-5">
            <Stack
              className="border sticky-lg-top"
              style={{
                top: 'calc(var(--nav-height) + 1.75rem)',
                minHeight: '10rem',
                maxHeight: 'calc(100vh - var(--nav-height) - 3rem)',
              }}>
              <Comments
                itemId={item._id}
                authorId={item.user._id}
                query={commentQuery}
                onAddComment={handleAddComment}
                callback={itemService.getItemComments(id)}
              />
            </Stack>
          </Col>
        </Row>
      </Container>
      <Button
        onClick={handleCommentScroll}
        className="position-fixed bottom-0 start-50 translate-middle-x rounded-pill mb-3 d-lg-none opacity-75">
        <FaComment className="me-1" /> Comments
      </Button>
    </main>
  );
}
export default SingleItem;
