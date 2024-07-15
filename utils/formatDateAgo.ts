import dayjs from 'dayjs';

const formatDateAgo = (createdAt: string) => {
  const diffInDays = dayjs().diff(createdAt, 'day');

  if (diffInDays === 0) {
    return 'today';
  } else if (diffInDays === 1) {
    return 'yesterday';
  } else if (diffInDays <= 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays <= 31) {
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  } else {
    const diffInMonths = Math.floor(diffInDays / 31);
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
};

export default formatDateAgo;
