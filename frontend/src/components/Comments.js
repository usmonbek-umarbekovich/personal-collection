import { useState } from 'react';
import { useUserInfo } from '../contexts/userInfoContext';
import { timeDiff } from '../helpers';
import itemService from '../services/itemService';
import useObserver from '../hooks/useObserver';
import CommentForm from './CommentForm';
import AuthorInfo from './AuthorInfo';
import CollapseContent from './CollapseContent';
import LoadingBalls from './LoadingBalls';
import Stack from 'react-bootstrap/Stack';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaPen, FaTrashAlt } from 'react-icons/fa';

function Comments({
  itemId,
  authorId,
  query,
  callback,
  onAddComment,
  onDeleteComment,
}) {
  const [action, setAction] = useState('create');
  const [data, setData] = useState({});
  const [comments, lastCommentElement, loading, setComments] = useObserver(
    query,
    callback
  );

  const { user } = useUserInfo();

  const handleSubmit = (newComment, index) => {
    setComments(prevComments => {
      if (action === 'update') {
        return [
          ...prevComments.slice(0, index),
          newComment,
          ...prevComments.slice(index),
        ];
      }

      const isAuthor = newComment.user._id === authorId;
      if (isAuthor) return [newComment, ...prevComments];

      const authorHasComment =
        prevComments.length > 0 && prevComments[0].user._id === authorId;
      if (!authorHasComment) {
        return [newComment, ...prevComments];
      }

      return [prevComments[0], newComment, ...prevComments.slice(1)];
    });

    if (action === 'create') onAddComment();
    else {
      setAction('create');
      setData({});
    }
  };

  const handleEdit = (comment, index) => {
    setComments(prevComments =>
      prevComments.filter(c => c._id !== comment._id)
    );
    setAction('update');
    setData({ comment, index });
  };

  const handleDelete = commentId => {
    itemService.deleteComment({ itemId, commentId }).then(() => {
      setComments(prev => prev.filter(c => c._id !== commentId));
      onDeleteComment();
    });
  };

  return (
    <>
      <CommentForm
        action={action}
        data={data}
        itemId={itemId}
        userId={user._id}
        onSubmit={handleSubmit}
      />
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
              {user?._id === comment.user._id && (
                <CollapseContent
                  controlId="collection-control"
                  iconSize={2}
                  listProps={{ className: 'top-0 end-100 me-2' }}
                  btnProps={{
                    variant: 'outline-secondary',
                    style: { width: '2rem', height: '2rem' },
                    className: 'border-0 p-1',
                  }}>
                  <ListGroup.Item
                    action
                    variant="dark"
                    onClick={() => handleEdit(comment, index)}
                    className="text-nowrap px-4 ps-3 fw-bolder">
                    <FaPen className="me-1" /> Edit
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    variant="dark"
                    onClick={() => handleDelete(comment._id)}
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
