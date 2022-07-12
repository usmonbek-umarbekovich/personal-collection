export const getFullName = name => `${name.first} ${name.last}`;

export const formatTime = rawTime => {
  const parsed = new Date(rawTime);
  const intl = new Intl.DateTimeFormat([], {
    dateStyle: 'medium',
  });
  return intl.format(parsed);
};
