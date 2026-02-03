//call database connection
const dbconnect = require('../../../Middleware/Dbconnect');
// const {user_id} = req.user[0];
// console.log("user_id from request service:", user_id);
const getNextRequest_no = async () =>{
    const mysql =
    `   SELECT 
            COALESCE(MAX(next_val), 1) AS "nextRequest",
            COALESCE(MAX(next_val), 1) || '/' || EXTRACT(YEAR FROM CURRENT_DATE) AS "next_request_no"
        FROM (
            SELECT COUNT(*) + 1 AS next_val
            FROM "newDrawingrequest"."Request_Form"
            WHERE EXTRACT(YEAR FROM request_at) = EXTRACT(YEAR FROM CURRENT_DATE)
        ) AS current_year_data;
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

const getSinglerequestbyrequest_no = async (payload) => {
    const mysql =`
        SELECT 
            id, request_no, department, customer_name, part_no, detail, request_remark, request_at, status_name, email, username,position
        FROM "newDrawingrequest"."Request_Form" rf
        LEFT JOIN public."User" u_request
        ON u_request.user_id = rf.request_by
        LEFT JOIN "newDrawingrequest"."Status" rf_status
        ON rf.request_status = rf_status.status_id
        WHERE rf.request_no = $1
        ORDER BY -id
    `
    const result = await dbconnect.query(mysql, [payload.request_no]);
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
  
const updateStatusrequest = async (request_no, request_status) => {   
    const mysql = `
        UPDATE "newDrawingrequest"."Request_Form"
        SET request_status = $1
        WHERE request_no = $2
        RETURNING *;
    `;
    const values = [
        request_status,
        request_no
    ];
    const result = await dbconnect.query(mysql, values);
    return result.rows;
}

module.exports = {
    getAllrequest,
    getSinglerequest,
    getNextRequest_no,
    postRequest,
    getHistorylog,
    updateStatusrequest,
    getSinglerequestbyrequest_no
}