//call database connection
const dbconnect = require('../../../Middleware/Dbconnect');
const getAlloverdue = async () => {
    const mysql =`
    SELECT 
        *
    FROM "newDrawingrequest"."OverDue_Form" rf
    LEFT JOIN public."User" u
    ON u.user_id = rf.follow_by
    ORDER BY -id
    `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getSingleoverdue = async (payload) => {
    const mysql =`
    SELECT 
        *
    FROM "newDrawingrequest"."OverDue_Form" rf
    LEFT JOIN public."User" u
    ON u.user_id = rf.follow_by
    WHERE rf.request_no = $1
    ORDER BY -id
    `
    const result = await dbconnect.query(mysql, [payload.request_no]);
    return result.rows
}
const postoverdueForm = async (payload, user_id) => {
    const sql = `
        INSERT INTO "newDrawingrequest"."OverDue_Form"
        (
            request_no,
            expect_date,
            isneed,
            Overdue_remark,
            follow_by,
            follow_at
        )
        VALUES ($1, $2, $3 , $4, $5, $6)
        RETURNING *
    `;

    const result = await dbconnect.query(sql, [
        payload.request_no,
        payload.expected_date,
        payload.isneed,
        payload.Overdue_remark,
        user_id,
        (new Date())
    ]);

    return result.rows;
}
module.exports = {  
    getAlloverdue,
    getSingleoverdue,
    postoverdueForm
}