//call database connection
const dbconnect = require('../../../Middleware/Dbconnect');
const getAllapprove = async () => {
    //Status reques.status
    const mysql =`
        SELECT 
            rf.id, rf.request_no, rf.approve_at, rf_status.status_name,
            u.email, u.username, u.position,
            rff.department, rff.customer_name, rff.part_no, rff.detail, rff.request_remark
        FROM "newDrawingrequest"."Approve_Form" rf
        LEFT JOIN public."User" u
            ON u.user_id = rf.approve_by
        LEFT JOIN "newDrawingrequest"."Request_Form" rff
            ON rff.request_no = rf.request_no
        LEFT JOIN "newDrawingrequest"."Status" rf_status
            ON rff.request_status = rf_status.status_id
        ORDER BY -rf.id
    `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getSingleapprove = async (payload) => {
    const mysql =`
        SELECT 
            rf.id, rf.request_no, rf.approve_at, rf_status.status_name,
            u.email, u.username, u.position
        FROM "newDrawingrequest"."Approve_Form" rf
        LEFT JOIN public."User" u
        ON u.user_id = rf.approve_by
        -- LEFT JOIN "Role_Item" ri
        --   ON rf.approve_by = ri.user_id
        -- LEFT JOIN "Role_Option" ro
        --   ON ri.role_item = ro.role_option_id
        LEFT JOIN "newDrawingrequest"."Status" rf_status
        ON rf.approve_status = rf_status.status_id
        WHERE rf.request_no = $1
        ORDER BY -id
    `
    const result = await dbconnect.query(mysql, [payload.request_no]);
    return result.rows
}

module.exports = {  
    getAllapprove,
    getSingleapprove
}