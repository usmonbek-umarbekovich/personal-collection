import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useLazyLoad from '../hooks/useLazyLoad';
import LoadingBalls from '../components/LoadingBalls';
import { timeDiff, truncate } from '../helpers';
import AuthorInfo from './AuthorInfo';
import Stack from 'react-bootstrap/Stack';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

function Items({
  query,
  callback,
  span,
  showUser,
  showCollection,
  maxWords = 15,
  maxChars = 180,
  root = '',
}) {
  const [skip, setSkip] = useState(0);
  const params = useMemo(() => ({ skip, ...query }), [skip, query]);
  const [items, loading, hasMore, setItems] = useLazyLoad(params, callback);

  useEffect(() => {
    setSkip(0);
    setItems([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const observer = useRef();
  const lastItemElement = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setSkip(prevSkip => prevSkip + query.limit);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, query.limit]
  );

  return (
    <Col lg={{ span, order: 'first' }} className="py-lg-0 py-3">
      <Stack gap="5" className="lh-1">
        {items.map((item, index) => (
          <Stack
            gap="5"
            key={item._id}
            direction="horizontal"
            className="align-items-center"
            ref={items.length === index + 1 ? lastItemElement : null}>
            <Stack className="justify-content-center">
              {showUser && (
                <AuthorInfo user={item.user} root={root} weight="bolder" />
              )}
              <p className="fs-4 fw-bold text-break">{item.name}</p>
              {item.description && (
                <p className="fs-5 lh-sm text-break">
                  {truncate(item.description, maxWords, maxChars)}
                </p>
              )}
              <Stack
                gap="2"
                direction="horizontal"
                className="align-items-start text-muted">
                <p>{timeDiff(item.createdAt, 'item', 'long', true)}</p>
                {showCollection && (
                  <>
                    <p>-</p>
                    <Link
                      className="text-reset"
                      to={`${root}/collections/${item.collectionId._id}`}>
                      <p>{item.collectionId.name}</p>
                    </Link>
                  </>
                )}
              </Stack>
              <Stack
                gap="2"
                direction="horizontal"
                className="align-items-center">
                {item.tags.map(tag => (
                  <Button
                    key={tag._id}
                    variant="secondary"
                    className="fw-bolder">
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
      </Stack>
    </Col>
  );
}
export default Items;
