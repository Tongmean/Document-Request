//call database connection
const dbconnect = require('../../../Middleware/Dbconnect');

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

module.exports = {
    getAllrequest,
    getSinglerequest
}