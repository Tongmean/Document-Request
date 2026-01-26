const dbconnect = require('../../../Middleware/Dbconnect');
const getsingledocumenttypeitem = async (payload) => {
        const mysql =`
            SELECT * FROM "newDrawingrequest"."Document_Type_Item" dti
            LEFT JOIN "newDrawingrequest"."Document_Type" dt
                ON dti.document_type = dt.document_type_id
            WHERE dti.request_no = $1
            ORDER BY id ASC
        `
        const result = await dbconnect.query(mysql, [payload.request_no]);
        return result.rows
}

module.exports = {
    getsingledocumenttypeitem
};