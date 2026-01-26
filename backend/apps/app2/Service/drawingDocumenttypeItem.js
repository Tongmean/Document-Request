const dbconnect = require('../../../Middleware/Dbconnect');
const getsingledrawingDocumenttypeitem = async (payload) => {
        const mysql =`
        SELECT * FROM "newDrawingrequest"."Drawing_Ducument_Type_Item" ddti
        LEFT JOIN "newDrawingrequest"."Drawing_Ducument_Type" ddt
            ON ddti.drawing_document_type = ddt.drawing_document_type_id
        WHERE ddti.request_no = $1
        ORDER BY id ASC 
        `
        const result = await dbconnect.query(mysql, [payload.request_no]);
        return result.rows
}

module.exports = {
    getsingledrawingDocumenttypeitem
};