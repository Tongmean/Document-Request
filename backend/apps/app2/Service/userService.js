const dbconnect = require('../../../Middleware/Dbconnect');
const getAlluser = async () => {
    const mysql =`
            SELECT 
            u.user_id,
            u.email,
            u.username,
            u.password,
            u.position
            -- ro.role_option_name
        FROM "User" u
        LEFT JOIN "Role_Item" ri
            ON u.user_id = ri.user_id
        -- LEFT JOIN "Role_Option" ro
        --   ON ri.role_item = ro.role_option_id
        ORDER BY u.user_id
    `
    const result = await dbconnect.query(mysql);
    return result.rows
}

module.exports = {
    getAlluser
}