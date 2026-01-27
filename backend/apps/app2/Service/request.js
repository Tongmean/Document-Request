//call database connection
const dbconnect = require('../../../Middleware/Dbconnect');
// const {user_id} = req.user[0];
// console.log("user_id from request service:", user_id);
const getNextRequest_no = async () =>{
    const mysql =
    `
        WITH YearlyCounts AS (
            SELECT 
                EXTRACT(YEAR FROM request_at) AS request_year,
                COUNT(*) + 1 AS next_val
            FROM "newDrawingrequest"."Request_Form"
            GROUP BY EXTRACT(YEAR FROM request_at)
        )
        SELECT 
            request_year,
            next_val AS "nextRequest",
            next_val || '/' || request_year AS "next_request_no"
        FROM YearlyCounts
        ORDER BY request_year;
    `;
    const result = await dbconnect.query(mysql);
    return result.rows
}

const postRequest = async (payload, next_request_no, user_id) => {
    const mysql = `
        INSERT INTO "newDrawingrequest"."Request_Form" (
            request_no,
            department,
            customer_name,
            part_no,
            detail,
            request_remark,
            request_status,
            request_by,
            request_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
    
    `
    const values = [
        next_request_no,
        payload.department,
        payload.customer_name,
        payload.part_no,
        payload.detail,
        payload.request_remark,
        1,
        user_id,
        (new Date())
    ]
    const result = await dbconnect.query(mysql, values);
    return result.rows
}


const getAllrequest = async () => {
    const mysql =`
        SELECT 
            id, request_no, department, customer_name, part_no, detail, request_remark, request_at, status_name, email, username,position
        FROM "newDrawingrequest"."Request_Form" rf
        LEFT JOIN public."User" u_request
        ON u_request.user_id = rf.request_by
        LEFT JOIN "newDrawingrequest"."Status" rf_status
        ON rf.request_status = rf_status.status_id
        ORDER BY -id
    `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getSinglerequest = async (payload) => {
    const mysql =`
        SELECT 
            id, request_no, department, customer_name, part_no, detail, request_remark, request_at, status_name, email, username,position
        FROM "newDrawingrequest"."Request_Form" rf
        LEFT JOIN public."User" u_request
        ON u_request.user_id = rf.request_by
        LEFT JOIN "newDrawingrequest"."Status" rf_status
        ON rf.request_status = rf_status.status_id
        WHERE rf.id = $1
        ORDER BY -id
    `
    const result = await dbconnect.query(mysql, [payload.id]);
    return result.rows
}

// const getHistorylog = async (payload) => {
//     console.log("payload in getHistorylog:", payload.request_no);
//     // const table = `"newDrawingrequest"."Request_Form"`
//     const mysql = `SELECT * FROM "newDrawingrequest".update_log WHERE record_id = $1 AND table_name = "newDrawingrequest"."Request_Form" `
//     const result = await dbconnect.query(mysql, [payload.request_no]);
//     result = result.rows 
// }
const getHistorylog = async (payload) => {
    const tableName = '"newDrawingrequest"."Request_Form"';
  
    const sql = `
      SELECT *
      FROM "newDrawingrequest".update_log
      LEFT JOIN "User" ri
      ON "newDrawingrequest".update_log .action_by = ri.user_id
      WHERE record_id = $1
        AND table_name = $2
    `;
  
    const { rows } = await dbconnect.query(sql, [
      payload.request_no,
      tableName,
    ]);
  
    return rows;
  };
  
module.exports = {
    getAllrequest,
    getSinglerequest,
    getNextRequest_no,
    postRequest,
    getHistorylog
}