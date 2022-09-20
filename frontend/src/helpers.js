const getFullName = name => `${name.first} ${name.last}`;

/**
 * @desc Capitalize first letter of every word
 */
const capitalize = str => {
  if (!str) return str;

  return str
    .split(' ')
    .map(word => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ');
};

const formatTime = (rawTime, dateStyle) => {
  const parsed = new Date(rawTime);
  const intl = new Intl.DateTimeFormat([], { dateStyle });
  return intl.format(parsed);
};

/**
 * @desc Truncate words
 */
const truncate = (text, maxWords, maxChars) => {
  const words = text.split(/\s+/);
  const newText = words.slice(0, maxWords).join(' ');
  if (newText.length <= maxChars) {
    if (words.length <= maxWords) return newText;
    else return `${newText}...`;
  }

  return `${newText.slice(0, maxChars)}...`;
};

/**
 * @desc Information about time difference from now
 * @param time String
 * @param type user | item
 * @param dataStyle short | medium | long | full
 */
const timeDiff = (time, type, dateStyle = 'short', noPrefix = false) => {
  const calculateTimeDIff = () => {
    let prefix;
    if (noPrefix) {
      prefix = '';
    } else {
      prefix = type === 'user' ? 'Last seen ' : 'Created ';
    }

    if (time === 'blocked') return 'Blocked';

    const timeDiff = new Date() - new Date(time);

    const minutes = Math.trunc(timeDiff / 1000 / 60);
    if (minutes === 0) return 'Just now';
    if (minutes === 1) return `${prefix}a minute ago`;
    if (minutes < 60) return `${prefix}${minutes} minutes ago`;

    const hours = Math.trunc(timeDiff / 1000 / 3600);
    if (hours === 1) return `${prefix}an hour ago`;
    if (hours < 24) return `${prefix}${hours} hours ago`;

    const days = Math.trunc(timeDiff / 1000 / 3600 / 24);
    if (days === 1) return `${prefix}a day ago`;
    if (days < 7) return `${prefix}${days} days ago`;
    if (days === 7) return `${prefix}a week ago`;

    const date = formatTime(time, dateStyle);
    if (noPrefix) return date;

    return `${prefix} on ${date}`;
  };

  const result = calculateTimeDIff();
  return result[0].toUpperCase() + result.slice(1);
};

const handleLastSeen = user => {
  if (!user.active) return 'Last seen a long time ago';
  if (user.onlineDevices.length > 0) return 'Online';
  return timeDiff(user.lastSeen, 'user', 'long');
};

export { getFullName, capitalize, truncate, timeDiff, handleLastSeen };
