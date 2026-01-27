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
const postDrawingtypeItem = async (payload) => {   
    const mysql = `
        INSERT INTO "newDrawingrequest"."Drawing_Type_Item" (
            request_no,
            drawing_type_item
        )VALUES ($1, $2)
        RETURNING *
    `;
    const result = await dbconnect.query(mysql, [payload.request_no, payload.drawing_type]);
    return result.rows
}
module.exports = {
    getsingledrawingtypeitem,
    postDrawingtypeItem
};