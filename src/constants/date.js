const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const formatDate = (d) => {
  const year = d.getFullYear();
  const date = d.getDate();
  const monthIndex = d.getMonth();
  const dayIndex = d.getDay();
  const dayName = days[dayIndex];
  const monthName = months[monthIndex];
  return `${dayName}, ${date} ${monthName} ${year}`;
};
