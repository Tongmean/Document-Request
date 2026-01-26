// export function isOverSixMonths(requestAt) {
//     const requestDate = new Date(requestAt);
//     const now = new Date();
  
//     const sixMonthsLater = new Date(requestDate);
//     sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
  
//     return now >= sixMonthsLater;
// }
export function checkSixMonths(requestAt) {
  const requestDate = new Date(requestAt);
  const now = new Date();

  const sixMonthsLater = new Date(requestDate);
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

  // difference in ms
  const diffMs = sixMonthsLater - now;

  // convert to days
  const remainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    isOverSixMonths: now >= sixMonthsLater,
    remainingDays: remainingDays > 0 ? remainingDays : 0,
    overdueDays: remainingDays < 0 ? Math.abs(remainingDays) : 0,
    sixMonthsDate: sixMonthsLater
  };
}
