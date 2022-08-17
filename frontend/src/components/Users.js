import { timeDiff, truncate } from '../helpers';
import AuthorInfo from './AuthorInfo';
import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';

function Users({ data = [], lastDataElement = null }) {
  return (
    <Stack gap="5">
      {data.map((user, index) => (
        <Stack
          key={user._id}
          ref={data.length === index + 1 ? lastDataElement : null}>
          <AuthorInfo
            fontSize="lg"
            picSize="md"
            weight="bolder"
            user={user}
            description={timeDiff(user.lastSeen, 'user', 'long')}
          />
          {user.bio && (
            <p className="fs-5 lh-sm text-break">
              {truncate(user.bio, 15, 180)}
            </p>
          )}
          <Stack gap="4" direction="horizontal" className="fs-5">
            <p>
              <Badge bg="primary">{user.numItems}</Badge> item
              {user.numItems > 1 ? 's' : ''}
            </p>
            <p>
              <Badge bg="warning" text="dark">
                {user.numCollections}
              </Badge>{' '}
              collection
              {user.numCollections > 1 ? 's' : ''}
            </p>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
export default Users;
