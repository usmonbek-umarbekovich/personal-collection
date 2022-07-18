export const getFullName = name => `${name.first} ${name.last}`;

export const capitalize = str => {
  if (!str) return str;

  return str
    .split(' ')
    .map(word => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ');
};

export const formatTime = (rawTime, dateStyle) => {
  const parsed = new Date(rawTime);
  const intl = new Intl.DateTimeFormat([], { dateStyle });
  return intl.format(parsed);
};

export const lastSeen = time => {
  if (!time) return 'Blocked';

  const timeDiff = new Date() - new Date(time);

  const minutes = Math.trunc(timeDiff / 1000 / 60);
  if (minutes === 0) return 'Online';
  if (minutes === 1) return 'Last Seen a minute ago';
  if (minutes < 60) return `Last Seen ${minutes} minutes ago`;

  const hours = Math.trunc(timeDiff / 1000 / 3600);
  if (hours === 1) return 'Last Seen an hour ago';
  if (hours < 24) return `Last Seen ${hours} hours ago`;

  const days = Math.trunc(timeDiff / 1000 / 3600 / 24);
  if (days === 1) return 'Last Seen a day ago';
  if (days < 7) return `Last Seen ${days} days ago`;
  if (days === 7) return 'Last Seen a week ago';

  const date = formatTime(time, 'long');
  return `Last seen on ${date}`;
};
