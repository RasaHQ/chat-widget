import { CustomErrorClass, ErrorSeverity } from '@vortexwest/chat-widget-sdk';

export const formatDateTime = (date: Date) => {
  if (!date) {
    throw new CustomErrorClass(ErrorSeverity.Error, 'Date not found');
  }

  try {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const timePart = date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });

    return `${day} ${month} ${year}, ${timePart}`;
  } catch (error) {
    throw new CustomErrorClass(ErrorSeverity.LogError, `formatDateTime: Invalid time object - arg:${date}, ${error}`);
  }
};
