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

module.exports = {  
    getAlloverdue,
    getSingleoverdue
}