import { Link } from 'react-router-dom';
import useObserver from '../hooks/useObserver';
import { timeDiff, truncate } from '../helpers';
import LoadingBalls from './LoadingBalls';
import AuthorInfo from './AuthorInfo';
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

function Items({
  query,
  callback,
  showUser,
  showCollection,
  maxWords = 15,
  maxChars = 180,
  root = '',
}) {
  const [items, lastItemElement, loading] = useObserver(query, callback);

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
            {showUser && (
              <AuthorInfo user={item.user} root={root} weight="bolder" />
            )}
            <Stack className="flex-grow-0">
              <Link className="text-reset" to={`${root}/items/${item._id}`}>
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
    </Stack>
  );
}
export default Items;
