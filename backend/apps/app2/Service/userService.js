const dbconnect = require('../../../Middleware/Dbconnect');
const getAlluser = async () => {
    const mysql =`
            SELECT * FROM public."User"
            ORDER BY user_id ASC 
    `
    const result = await dbconnect.query(mysql);
    return result.rows
}

module.exports = {
    getAlluser
}