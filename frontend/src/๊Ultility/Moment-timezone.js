import moment from 'moment-timezone';

export function convertToUTCPlus7(date) {
  return moment.utc(date)
    .tz('Asia/Bangkok')
    .format('YYYY-MM-DD');
}
