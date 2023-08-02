export const getTimeString = (seconds: number, msg: string = ''): string => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * (24 * 60 * 60);
  
    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * (60 * 60);
  
    const minutes = Math.floor(seconds / 60);
  
    let timeString = '';
    if (days > 0) {
      timeString += `${days} ${days === 1 ? 'day, ' : 'days, '}`;
    }
  
    if (hours > 0) {
      timeString += `${hours} ${hours === 1 ? 'hour, ' : 'hours, '}`;
    }
  
    if (minutes > 0) {
      timeString += `${minutes} ${minutes === 1 ? 'minute, ' : 'minutes, '}`;
    }
  
    if (minutes === 0 && hours === 0 && days === 0) {
      timeString += `A few seconds`;
    }

    // Replace multiple consecutive "and" with a single comma, except for the last one
    timeString = timeString.replace(/(, )+/g, ', ').replace(/(, )$/, '');
  
    timeString += ' ' + msg;
  
    return timeString.trim();
  }