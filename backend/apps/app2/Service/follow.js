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

module.exports = {
    getSinglefollowForm
};