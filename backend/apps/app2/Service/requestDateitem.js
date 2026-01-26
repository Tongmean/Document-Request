const dbconnect = require('../../../Middleware/Dbconnect');
const getSinglerequestDateitem = async (payload) => {
        const mysql =`
        SELECT * FROM "newDrawingrequest"."Request_Date_Item"
        WHERE "newDrawingrequest"."Request_Date_Item".request_no = $1
        ORDER BY id ASC 
        `
        const result = await dbconnect.query(mysql, [payload.request_no]);
        return result.rows
}

module.exports = {
    getSinglerequestDateitem
};