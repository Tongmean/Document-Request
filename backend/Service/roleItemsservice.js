const dbconnect = require('../Middleware/Dbconnect');
const postRoleitemsService = async (payload, user_id) =>{
    const mysql = `
        INSERT INTO public."Role_Item"
        (user_id, role_item, created_at, created_by)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const values = [
        payload.user_id,
        payload.role_item,
        new Date(),
        user_id
    ]
    const result = await dbconnect.query(mysql, values)
    return result.rows
} 
const getUserroleItemsService = async (payload) => {
    const mysql = `
        SELECT 
            DISTINCT
            u.user_id,
            u.email,
            u.username,
            ro.role_option_name
        FROM "User" u
        LEFT JOIN "Role_Item" ri
            ON u.user_id = ri.user_id
        LEFT JOIN "Role_Option" ro
          ON ri.role_item = ro.role_option_id
        WHERE u.user_id = $1
        ORDER BY u.user_id

        `
        const result = await dbconnect.query(mysql, [payload.user_id])
        return result.rows
}

const getRoleoptionService = async () =>{
    const sql = `
        SELECT * FROM public."Role_Option"
        ORDER BY role_option_id ASC 
    `
    const result = dbconnect.query(sql)
    return (await result).rows
}
module.exports = {
    postRoleitemsService,
    getUserroleItemsService,
    getRoleoptionService
}