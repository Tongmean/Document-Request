const dbconnect = require('../../../Middleware/Dbconnect');

const getAllsender = async () => {
    const mysql =`
        SELECT *
        FROM "newDrawingrequest"."Request_Form" rf
        LEFT JOIN public."User" u_request
            ON u_request.user_id = rf.request_by
        LEFT JOIN "newDrawingrequest"."Status" rf_status
            ON rf.request_status = rf_status.status_id
        WHERE EXISTS (
            SELECT 1
            FROM "newDrawingrequest"."Process_Form" pf
            WHERE pf.request_no = rf.request_no
            AND pf.process_status = 3
        )
        AND EXISTS (
            SELECT 1
            FROM "newDrawingrequest"."Approve_Form" af
            WHERE af.request_no = rf.request_no
            AND af.approve_status = 4
        )
        ORDER BY -rf.id
    `
    const result = await dbconnect.query(mysql);
    return result.rows
}


const postSenderservice = async (payload, request_no) => {
    const sql = `
        INSERT INTO "newDrawingrequest"."Url_Form"
        (
            request_no,
            path
        )
        VALUES ($1, $2)
        RETURNING *
    `;

    const result = await dbconnect.query(sql, [
        request_no,
        payload.path,
    ]);

    return result.rows;
}
module.exports = {
    getAllsender,
    postSenderservice

}