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
