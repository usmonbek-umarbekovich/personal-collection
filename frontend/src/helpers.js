export const getFullName = name => `${name.first} ${name.last}`;

export const capitalize = str => {
  if (!str) return str;
  
  return str
    .split(' ')
    .map(word => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ');
};

export const formatTime = rawTime => {
  const parsed = new Date(rawTime);
  const intl = new Intl.DateTimeFormat([], {
    dateStyle: 'medium',
  });
  return intl.format(parsed);
};
