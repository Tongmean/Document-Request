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
///request File
const getRequestfilebyrequest_no = async (payload) => {
    const mysql =`
        SELECT * FROM "newDrawingrequest".request_uploaded_files
        WHERE request_no = $1
        ORDER BY id ASC 
    `
    const result = await dbconnect.query(mysql, [payload.request_no]);
    return result.rows
}

module.exports = {
    getUrlbyRequest_no,
    getRequestfilebyrequest_no
}