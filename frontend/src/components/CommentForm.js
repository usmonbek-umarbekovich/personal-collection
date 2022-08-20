import { useState, useRef, useEffect } from 'react';
import userService from '../services/userService';
import itemService from '../services/itemService';
import AuthorInfo from './AuthorInfo';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

function CommentForm({ action, userId, itemId, data, onSubmit }) {
  const [user, setUser] = useState();
  const [commentBody, setCommentBody] = useState('');
  const commentInputRef = useRef();

  useEffect(() => {
    userService.getSingleUser(userId).then(setUser);
  }, [userId]);

  useEffect(() => {
    if (!data.comment || !commentInputRef.current) return;
    setCommentBody(data.comment.body);
    commentInputRef.current.focus();
  }, [data.comment]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!commentBody.trim()) return;

    const { comment = {}, index = null } = data;
    const callback = {
      create: itemService.createComment,
      update: itemService.updateComment,
    };

    callback[action]({
      itemId,
      commentId: comment?._id,
      data: { ...comment, body: commentBody },
    })
      .then(newComment => onSubmit(newComment, index))
      .finally(() => setCommentBody(''));
  };

  if (user == null) return null;

  return (
    <Form id="comment-form" className="order-lg-last" onSubmit={handleSubmit}>
      <InputGroup className="border-top border-bottom">
        <div className="ps-3 pe-1">
          <AuthorInfo user={user} justPicture={true} />
        </div>
        <Form.Control
          ref={commentInputRef}
          className="ps-1"
          placeholder="Add a comment..."
          aria-label="Add a comment"
          aria-describedby="btn-comment"
          value={commentBody}
          onChange={e => setCommentBody(e.target.value)}
        />
        <Button
          type="submit"
          id="btn-comment"
          disabled={!commentBody}
          className="bg-white text-primary fw-bolder ps-0">
          post
        </Button>
      </InputGroup>
    </Form>
  );
}
export default CommentForm;
