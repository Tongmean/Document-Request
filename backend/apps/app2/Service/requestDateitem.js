const dbconnect = require('../../../Middleware/Dbconnect');
const getSinglerequestDateitem = async (payload) => {
        const mysql =`
        SELECT * FROM "newDrawingrequest"."Request_Date_Item"
        WHERE "newDrawingrequest"."Request_Date_Item".request_no = $1
        ORDER BY id ASC 
        `
        const result = await dbconnect.query(mysql, [payload.request_no]);
        return result.rows
}

// const postDateitem = async (payload) => {
//     const mysql = `
//         INSERT INTO "newDrawingrequest"."Request_Date_Item"(
//             request_no,
//             request_date,
//             expect_date
//         ) VALUES ($1, $2, $3)
//     `
//     const result = await dbconnect.query(mysql, [
//         payload.request_no,
//         new Date(payload.request_date),
//         new Date(payload.expect_date)
//     ]);
//     return result.rows
// }

// const postDateitem = async (payload) => {
//     // Use the global date constructor to be safe
//     const requestDate = payload.request_date
//     // const expectDate = new Date(payload.expected_date);
//     console.log(requestDate, requestDate);
//     if (isNaN(requestDate)) {
//       throw new Error('Invalid request_date or expect_date');
//     }
  
//     const sql = `
//       INSERT INTO "newDrawingrequest"."Request_Date_Item" (
//         request_no,
//         request_date
//       )
//       VALUES ($1, $2)
//       RETURNING *;
//     `;
//     const result = await dbconnect.query(sql, [
//       payload.request_no,
//       payload.request_date
//     ]);
  
//     return result.rows;
// };


const updateDateitems = async (payload) => {
    const sql = `
      UPDATE "newDrawingrequest"."Request_Date_Item"
      SET
        expected_date = $1
      WHERE id = $2
      RETURNING *;
    `;
  
    const result = await dbconnect.query(sql, [
      payload.expected_date,
      payload.id
    ]);
  
    return result.rows;
}

const postDateitem = async (payload) => {
  const requestDate = new Date(payload.request_date);

  if (isNaN(requestDate.getTime())) {
    throw new Error('Invalid request_date');
  }

  const sql = `
    INSERT INTO "newDrawingrequest"."Request_Date_Item" (
      request_no,
      request_date
    )
    VALUES ($1, $2)
    RETURNING *;
  `;

  const result = await dbconnect.query(sql, [
    payload.request_no,
    requestDate,
  ]);

  return result.rows;
};

module.exports = {
    getSinglerequestDateitem,
    postDateitem,
    updateDateitems
};