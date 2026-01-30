const dbconnect = require('../../../Middleware/Dbconnect');

const getUrlbyRequest_no = async (payload) => {
    const mysql =`
        SELECT * FROM "newDrawingrequest"."Url_Form"
        WHERE request_no = $1
        ORDER BY id ASC 
    `
    const result = await dbconnect.query(mysql, [payload.request_no]);
    return result.rows
}

module.exports = {
    getUrlbyRequest_no
}