// import React from 'react';
// import { Badge } from 'antd';

// const RequestItem = ({ event }) => {
//   const { type, label, request } = event;
//     console.log('RequestItem event:', request);
//   return (
//     <Badge
//       status={type}
//       text={
//         <>
//           <strong>{request.request_no}</strong>
//           <br />
//           <small>{label}</small>
//           {/* <small>{request.id} sdfasd</small> */}
//           {/* <small>{request.status_name}</small> */}
//         </>
//       }
//     />
//   );
// };

// export default RequestItem;
import React from 'react';
import { Badge } from 'antd';
import { Link } from 'react-router-dom';

const RequestItem = ({ event }) => {
  const { type, label, request } = event;

  return (
    <Badge
      status={type}
      text={
        <>
          <strong>
              <Link to={`/new/drawingrequest/${request.id}`}>
              {request.request_no}
              </Link>
          </strong>       
          <br />
          <small>{label}</small>
        </>
      }
    />
  );
};

export default RequestItem;
