// import dayjs from 'dayjs';

// /**
//  * Returns request events for a given calendar cell
//  */
// export const getRequestEventsByDate = (value, requests) => {
//   const date = value.format('YYYY-MM-DD');
//     // console.log('Formatted date:', date);
//     console.log('Getting events for date:', requests);
//   return requests.flatMap((req) => {
//     const events = [];

//     if (dayjs(req.request_date).format('YYYY-MM-DD') === date) {
//       events.push({
//         key: `${req.request_no}-request`,
//         type: 'processing',
//         label: `Request Date (${req.status_name})`,
//         request: req,
//       });
//     }

//     if (dayjs(req.expected_date).format('YYYY-MM-DD') === date) {
//       events.push({
//         key: `${req.request_no}-expected`,
//         type: 'warning',
//         label: `Expected Date (${req.status_name})`,
//         request: req,
//       });
//     }

//     return events;
//   });
// };
import dayjs from 'dayjs';

/**
 * Returns request events for a given calendar cell
 */
export const getRequestEventsByDate = (value, requests) => {
  const date = value.format('YYYY-MM-DD');

  return requests.flatMap((req) => {
    // 🔒 Hide completed requests
    if (req.status_name === 'Completed') {
      return [];
    }

    const events = [];

    if (dayjs(req.request_date).format('YYYY-MM-DD') === date) {
      events.push({
        key: `${req.request_no}-request`,
        type: 'processing',
        label: `Request Date (${req.status_name})`,
        request: req,
      });
    }

    if (dayjs(req.expected_date).format('YYYY-MM-DD') === date) {
      events.push({
        key: `${req.request_no}-expected`,
        type: 'warning',
        label: `Expected Date (${req.status_name})`,
        request: req,
      });
    }

    return events;
  });
};
