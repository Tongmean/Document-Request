const dbconnect = require('../../../Middleware/Dbconnect');
const getSinglefollowForm = async (payload) => {
        const mysql =`
            SELECT * FROM "newDrawingrequest"."Follow_Form"
            LEFT JOIN public."User" u
            ON u.user_id = "newDrawingrequest"."Follow_Form".follow_by
            WHERE "newDrawingrequest"."Follow_Form".request_no = $1
            ORDER BY id ASC 
        `
        const result = await dbconnect.query(mysql, [payload.request_no]);
        return result.rows
}
const postFollowForm = async (payload, user_id) => {
    const sql = `
        INSERT INTO "newDrawingrequest"."Follow_Form"
        (
            request_no,
            follow_by,
            follow_at
        )
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    const result = await dbconnect.query(sql, [
        payload.request_no,
        user_id,
        (new Date())
    ]);

    return result.rows;
}
module.exports = {
    getSinglefollowForm,
    postFollowForm
};