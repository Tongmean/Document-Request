import React from 'react';
import RequestItem from './RequestItem';

const DateCell = ({ events }) => {
  if (!events.length) return null;

  return (
    <ul className="events">
      {events.map((event) => (
        <li key={event.key}>
          <RequestItem event={event} />
        </li>
      ))}
    </ul>
  );
};

export default DateCell;
