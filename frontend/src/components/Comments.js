import { useState, useEffect, useRef } from 'react';
import { useUserInfo } from '../contexts/userInfoContext';
import itemService from '../services/itemService';
import userService from '../services/userService';
import useObserver from '../hooks/useObserver';
import { timeDiff } from '../helpers';
import AuthorInfo from '../components/AuthorInfo';
import CollapseContent from '../components/CollapseContent';
import LoadingBalls from '../components/LoadingBalls';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { FaPen, FaTrashAlt } from 'react-icons/fa';

function Comments({ itemId, authorId, query, callback, onAddComment }) {
  const [currUser, setCurrUser] = useState();
  const [newComment, setNewComment] = useState('');
  const [action, setAction] = useState('create');
  const [comments, lastCommentElement, loading, setComments] = useObserver(
    query,
    callback
  );

  const commentInputRef = useRef();
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
      .then(data => {
        setComments(prevComments => {
          const isAuthor = data.user._id === authorId;
          if (isAuthor) return [data, ...prevComments];

          const authorHasComment =
            prevComments.length > 0 && prevComments[0].user._id === authorId;
          if (!authorHasComment) {
            return [data, ...prevComments];
          }

          return [prevComments[0], data, ...prevComments.slice(1)];
        });
      })
      .finally(() => {
        setNewComment('');
        onAddComment();
      });
  };

  const handleEdit = comment => {
    setComments(prevComments =>
      prevComments.filter(c => c._id !== comment._id)
    );
    setNewComment(comment.body);
    setAction('edit');
    commentInputRef.current.focus();

    // TODO edit the comment

    setAction('create');
  };

  const handleDelete = comment => {
    setComments(prevComments =>
      prevComments.filter(c => c._id !== comment._id)
    );

    // TODO delete the comment
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
              ref={commentInputRef}
              className="ps-1"
              placeholder="Add a comment..."
              aria-label="Add a comment"
              aria-describedby="btn-comment"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <Button
              type="submit"
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
            <Stack
              direction="horizontal"
              className="align-items-center justify-content-between">
              <AuthorInfo
                weight="bolder"
                user={comment.user}
                description={timeDiff(comment.date, 'item', 'long', true)}
              />
              {currUser?._id === comment.user._id && (
                <CollapseContent
                  controlId="collection-control"
                  iconSize={2}
                  listProps={{ className: 'top-0 end-100 me-2' }}
                  btnProps={{
                    variant: 'outline-secondary',
                    style: { width: '2rem', height: '2rem' },
                    className: 'border-0',
                  }}>
                  <ListGroup.Item
                    action
                    variant="dark"
                    onClick={() => handleEdit(comment)}
                    className="text-nowrap px-4 ps-3 fw-bolder">
                    <FaPen className="me-1" /> Edit
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    variant="dark"
                    onClick={() => handleDelete(comment)}
                    className="text-nowrap px-4 ps-3 fw-bolder">
                    <FaTrashAlt className="me-1" /> Delete
                  </ListGroup.Item>
                </CollapseContent>
              )}
            </Stack>
            <p style={{ marginLeft: '2.35rem' }}>{comment.body}</p>
          </Stack>
        ))}
        {loading && <LoadingBalls />}
        {!loading && comments.length === 0 && (
          <p className="fs-4 m-auto">No Comments</p>
        )}
      </Stack>
    </>
  );
}
export default Comments;
