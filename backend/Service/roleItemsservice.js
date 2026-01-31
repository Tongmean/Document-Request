const dbconnect = require('../Middleware/Dbconnect');
const postRoleitemsService = async (payload, user_id) =>{
    const mysql = `
        INSERT INTO public."Role_Item"
        (user_id, role_item, created_at, created_by)
        VALUES ($1, $2, $3, $4);
        returning *
    `;
    const values = [
        payload.user_id,
        payload.role_item,
        new Date(),
        user_id
    ]
    const result = await dbconnect(mysql, values)
    return result.rows
} 


module.exports = {
    postRoleitemsService
}