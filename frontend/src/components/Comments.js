import { useState, useEffect } from 'react';
import { timeDiff } from '../helpers';
import { useUserInfo } from '../contexts/userInfoContext';
import itemService from '../services/itemService';
import userService from '../services/userService';
import useObserver from '../hooks/useObserver';
import AuthorInfo from '../components/AuthorInfo';
import LoadingBalls from '../components/LoadingBalls';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

function Comments({ itemId, query, callback }) {
  const [currUser, setCurrUser] = useState();
  const [newComment, setNewComment] = useState('');
  const [comments, lastCommentElement, loading, setComments] = useObserver(
    query,
    callback
  );

  const { user } = useUserInfo();
  useEffect(() => {
    if (!user) return;
    userService.getSingleUser(user._id).then(setCurrUser);
  }, [user]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!newComment) return;

    itemService
      .createComment(itemId, { body: newComment })
      .then(response => {
        if (response.statusText !== 'OK') return;
        setComments(prevComments => [response.data, ...prevComments]);
      })
      .finally(() => setNewComment(''));
  };

  return (
    <>
      {currUser && (
        <Form
          id="comment-form"
          className="order-lg-last"
          onSubmit={handleSubmit}>
          <InputGroup className="border-top border-bottom">
            <div className="ps-3 pe-1">
              <AuthorInfo user={currUser} justPicture={true} />
            </div>
            <Form.Control
              className="ps-1"
              placeholder="Add a comment..."
              aria-label="Add a comment"
              aria-describedby="btn-comment"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <Button
              id="btn-comment"
              disabled={!newComment}
              className="bg-white text-primary fw-bolder ps-0">
              post
            </Button>
          </InputGroup>
        </Form>
      )}
      <Stack className="px-3 pt-2 overflow-auto order-lg-first">
        {comments.map((comment, index) => (
          <Stack
            key={comment._id}
            className="flex-grow-0"
            ref={comments.length === index + 1 ? lastCommentElement : null}>
            <AuthorInfo
              weight="bolder"
              user={comment.user}
              description={timeDiff(comment.date, 'item', 'short', true)}
              root="../.."
            />
            <p style={{ marginLeft: '2.35rem' }}>{comment.body}</p>
          </Stack>
        ))}
        {loading && <LoadingBalls />}
      </Stack>
    </>
  );
}
export default Comments;
