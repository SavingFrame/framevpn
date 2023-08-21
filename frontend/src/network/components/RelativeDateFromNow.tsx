import React, { useState, useEffect } from 'react';

interface LastOnlineProps {
  lastOnline: Date; // Specify the type as number for the timestamp
}

const RelativeDateFromNow: React.FC<LastOnlineProps> = ({ lastOnline }) => {
  const [lastOnlineString, setLastOnlineString] = useState('');

  useEffect(() => {
    const updateLastOnlineString = () => {
      const now = new Date();
      const diffInMilliseconds = now.getTime() - lastOnline.getTime();
      const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
      const minutes = Math.floor(
        (diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((diffInMilliseconds % (1000 * 60)) / 1000);

      let formattedString = '';
      if (hours > 0) {
        formattedString += `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
      }
      if (minutes > 0) {
        if (formattedString.length > 0) {
          formattedString += ' ';
        }
        formattedString += `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
      }
      if (seconds > 0 || formattedString === '') {
        if (formattedString.length > 0) {
          formattedString += ' ';
        }
        formattedString += `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
      }

      formattedString += ' ago';
      setLastOnlineString(formattedString);
    };

    updateLastOnlineString(); // Initial update

    const intervalId = setInterval(updateLastOnlineString, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastOnline]);
  console.log(lastOnlineString, lastOnline);
  return <span>{lastOnlineString}</span>;
};

export default RelativeDateFromNow;
