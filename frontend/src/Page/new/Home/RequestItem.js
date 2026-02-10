import React from 'react';
import { Badge } from 'antd';

const RequestItem = ({ event }) => {
  const { type, label, request } = event;
    // console.log('RequestItem event:', event);
  return (
    <Badge
      status={type}
      text={
        <>
          <strong>{request.request_no}</strong>
          <br />
          <small>{label}</small>
          {/* <small>{request.status_name}</small> */}
        </>
      }
    />
  );
};

export default RequestItem;
