
import { format } from 'date-fns';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'dd/MM/yyyy');
};

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'HH:mm');
};
