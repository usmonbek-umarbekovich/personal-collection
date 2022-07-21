import { useState } from 'react';
import { timeDiff } from '../helpers';
import itemService from '../services/itemService';
import useObserver from '../hooks/useObserver';
import AuthorInfo from '../components/AuthorInfo';
import LoadingBalls from '../components/LoadingBalls';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

function Comments({ itemId, query, callback }) {
  const [comment, setComment] = useState('');
  const [comments, lastCommentElement, loading, setComments] = useObserver(
    query,
    callback
  );

  const handleSubmit = e => {
    e.preventDefault();
    if (!comment) return;

    itemService
      .createComment(itemId, { body: comment })
      .then(response => {
        if (response.statusText !== 'OK') return;
        setComments(prevComments => [response.data, ...prevComments]);
      })
      .finally(() => setComment(''));
  };

  return (
    <div>
      <Stack className="ps-lg-3 overflow-auto" style={{ height: '70vh' }}>
        {comments.map((comment, index) => (
          <Stack
            key={comment._id}
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
      <Form id="comment-form" onSubmit={handleSubmit} className="mt-2">
        <InputGroup className="border-top py-1 ps-lg-3">
          <Form.Control
            placeholder="Add a comment..."
            aria-label="Add a comment"
            aria-describedby="btn-comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <Button
            id="btn-comment"
            disabled={!comment}
            className="bg-white text-primary fw-bolder ps-0">
            post
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}
export default Comments;
