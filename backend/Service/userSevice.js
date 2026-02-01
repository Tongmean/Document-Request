const dbconnect = require('../Middleware/Dbconnect');
const getAlluserService = async () =>{
    const mysql =`
        SELECT 
            DISTINCT
            u.user_id,
            u.email,
            u.username,
            u.password,
            u.position,
            u.created_at,
            u.created_by
            -- ro.role_option_name
        FROM "User" u
        LEFT JOIN "Role_Item" ri
            ON u.user_id = ri.user_id
        -- LEFT JOIN "Role_Option" ro
        --   ON ri.role_item = ro.role_option_id
        ORDER BY u.user_id

    `;
    const result = await dbconnect.query(mysql);
    return result.rows
     
}
const postUserservice = async (payload, user_id) =>{
    const query = `
      INSERT INTO public."User"
      (email, username, password, "position", created_at, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      payload.email,
      payload.username,
      payload.password,
      payload.position,
      new Date(),
      user_id
    ];

    const result = await dbconnect.query(query, values)
    return result.rows

}
module.exports = {
    getAlluserService,
    postUserservice
}