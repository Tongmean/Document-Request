//call database connection
const dbconnect = require('../../../Middleware/Dbconnect');
const getAllprocess= async () => {
    const mysql =`
        SELECT 
            rf.id, rf.request_no, rf_status.status_name,
            u.email, u.username, u.position
        FROM "newDrawingrequest"."Process_Form" rf
        LEFT JOIN public."User" u
        ON u.user_id = rf.process_by
        LEFT JOIN "newDrawingrequest"."Status" rf_status
        ON rf.process_status = rf_status.status_id
        ORDER BY -id
    `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getSingleprocess = async (payload) => {
    const mysql =`
        SELECT 
            rf.id, rf.request_no, rf_status.status_name, rf.process_at,
            u.email, u.username, u.position
        FROM "newDrawingrequest"."Process_Form" rf
        LEFT JOIN public."User" u
        ON u.user_id = rf.process_by
        LEFT JOIN "newDrawingrequest"."Status" rf_status
        ON rf.process_status = rf_status.status_id
        WHERE rf.request_no = $1
        ORDER BY -id
    `
    const result = await dbconnect.query(mysql, [payload.request_no]);
    return result.rows
}
const postprocessForm = async (payload, user_id, resques_status) => {
    const sql = `
        INSERT INTO "newDrawingrequest"."Process_Form"
        (
            request_no,
            process_status,
            process_by,
            process_at
        )
        VALUES ($1, $2, $3 , $4)
        RETURNING *
    `;

    const result = await dbconnect.query(sql, [
        payload.request_no,
        resques_status,
        user_id,
        (new Date())
    ]);

    return result.rows;
}
module.exports = {  
    getAllprocess,
    getSingleprocess,
    postprocessForm
}