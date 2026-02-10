import React from 'react';
import { Calendar } from 'antd';
import {useDrawingData} from './requests';
import DateCell from './DateCell';
import { getRequestEventsByDate } from './calendarUtils';

const RequestCalendar = () => {
    const { rowData: requests } = useDrawingData();
    // console.log('Row Data in Calendar:', requests);
  const cellRender = (current, info) => {
    if (info.type !== 'date') {
      return info.originNode;
    }

    const events = getRequestEventsByDate(current, requests);
    // console.log('Events for date', current.format('YYYY-MM-DD'), events);
    return <DateCell events={events} />;
  };

  return <Calendar cellRender={cellRender} />;
};

export default RequestCalendar;
