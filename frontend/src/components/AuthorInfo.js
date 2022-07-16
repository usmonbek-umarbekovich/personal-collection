import { getFullName, formatTime } from '../helpers';
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';

function AuthorInfo({ user, createdAt, size }) {
  const pictureSize = { lg: '3rem', sm: '1.75rem' };
  const nameFont = { lg: 'fs-5', sm: 'fw-bolder' };

  return (
    <Stack gap="2" direction="horizontal" className="align-items-center py-2">
      <div
        style={{ width: pictureSize[size], height: pictureSize[size] }}
        className="bg-secondary rounded-circle">
        {user.picture && (
          <Image src={user.picture} alt={getFullName(user.name)} />
        )}
      </div>
      <Stack className="justify-content-center">
        <p className={`${nameFont[size]} m-0`}>{getFullName(user.name)}</p>
        {createdAt && (
          <p className="text-muted m-0">{formatTime(createdAt, 'long')}</p>
        )}
      </Stack>
    </Stack>
  );
}
export default AuthorInfo;
