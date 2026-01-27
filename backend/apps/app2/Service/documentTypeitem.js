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
const postDocumenttypeitem = async (payload) => {
    const sql = `
        INSERT INTO "newDrawingrequest"."Document_Type_Item"
        (
            request_no,
            document_type
        )
        VALUES ($1, $2)
        RETURNING *
    `;

    const result = await dbconnect.query(sql, [
        payload.request_no,
        payload.document_type
    ]);

    return result.rows;
};
module.exports = {
    getsingledocumenttypeitem,
    postDocumenttypeitem
};