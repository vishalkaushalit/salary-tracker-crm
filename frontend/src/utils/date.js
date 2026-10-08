export const MONTHS = [
  { value: 1, name: 'January', short: 'Jan' },
  { value: 2, name: 'February', short: 'Feb' },
  { value: 3, name: 'March', short: 'Mar' },
  { value: 4, name: 'April', short: 'Apr' },
  { value: 5, name: 'May', short: 'May' },
  { value: 6, name: 'June', short: 'Jun' },
  { value: 7, name: 'July', short: 'Jul' },
  { value: 8, name: 'August', short: 'Aug' },
  { value: 9, name: 'September', short: 'Sep' },
  { value: 10, name: 'October', short: 'Oct' },
  { value: 11, name: 'November', short: 'Nov' },
  { value: 12, name: 'December', short: 'Dec' },
];

export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatRelativeDate = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  const now = new Date();
  
  // Normalize to date boundary
  const dateYear = d.getFullYear();
  const dateMonth = d.getMonth();
  const dateDay = d.getDate();

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();
  const nowDay = now.getDate();

  if (dateYear === nowYear && dateMonth === nowMonth) {
    if (dateDay === nowDay) return 'Today';
    if (dateDay === nowDay - 1) return 'Yesterday';
  }

  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short'
  });
};
