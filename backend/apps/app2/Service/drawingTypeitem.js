const dbconnect = require('../../../Middleware/Dbconnect');
const getsingledrawingtypeitem = async (payload) => {
        const mysql =`
            SELECT * FROM "newDrawingrequest"."Drawing_Type_Item" dti
            LEFT JOIN "newDrawingrequest"."Drawing_Type" dt
                ON dti.drawing_type_item = dt.drawing_type_id
            WHERE dti.request_no = $1
            ORDER BY id ASC 
        `
        const result = await dbconnect.query(mysql, [payload.request_no]);
        return result.rows
}

module.exports = {
    getsingledrawingtypeitem
};