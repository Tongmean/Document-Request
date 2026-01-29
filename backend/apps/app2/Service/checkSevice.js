const dbconnect = require('../../../Middleware/Dbconnect');
const postFollowForm = async (payload, user_id) => {
    const sql = `
        INSERT INTO "newDrawingrequest"."Check_Form"
        (
            request_no,
            Check_by,
            Check_at
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
    postFollowForm
};