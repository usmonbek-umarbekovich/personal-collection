import { Link } from 'react-router-dom';
import { getFullName } from '../helpers';
import classNames from 'classnames';
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';

function AuthorInfo({
  user,
  description,
  justPicture = false,
  linkDisabled = false,
  fontSize = 'sm',
  picSize = 'sm',
  weight = 'normal',
  direction = 'horizontal',
}) {
  const pictureSize = { lg: '4.5rem', md: '3rem', sm: '1.75rem' };
  const nameSize = { lg: 'fs-5', sm: 'fs-6' };
  const alignItems = {
    vertical: 'align-items-start',
    horizontal: 'align-items-center',
  };

  return (
    <Stack
      gap="2"
      direction={direction}
      className={`${alignItems[direction]} py-2`}>
      <div
        style={{ width: pictureSize[picSize], height: pictureSize[picSize] }}
        className="bg-secondary rounded-circle">
        {user.avatar && (
          <Image src={user.avatar} alt={getFullName(user.name)} />
        )}
      </div>
      {justPicture || (
        <Stack className="justify-content-center align-items-start">
          <Link
            to={`/users/${user._id}`}
            className={classNames('text-reset', { 'pe-none': linkDisabled })}>
            <p className={`${nameSize[fontSize]} fw-${weight} m-0`}>
              {getFullName(user.name)}
            </p>
          </Link>
          {description && <p className="text-muted m-0">{description}</p>}
        </Stack>
      )}
    </Stack>
  );
}
export default AuthorInfo;
