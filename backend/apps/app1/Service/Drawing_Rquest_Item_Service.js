//call database connection
const dbconnect = require('../../../Middleware/Dbconnect');
const getitemdrawingrequest_existing = async (payload) => {
        const mysql =`
            SELECT 
                r.request_no,
                i.request_item_id,
                d.document_name
            FROM "Request_Utility_Existing_Drawing_Document_Type_Item_Form" i
            LEFT JOIN "Request_Utility_Existing_Drawing_Form" r
                ON i.request_no = r.request_no
            LEFT JOIN "Drawing_Document_Type" d
                ON i.document_no = d.document_no
            WHERE r.request_no = $1
        `
        const result = await dbconnect.query(mysql, [payload.request_no]);
        return result.rows
}
const createdrawingitemrequest_existing = async (payload) => {
    const sql = `
        INSERT INTO "Request_Utility_Existing_Drawing_Document_Type_Item_Form"
        (
            request_no,
            document_no
        )
        VALUES ($1, $2)
        RETURNING *
    `;

    const result = await dbconnect.query(sql, [
        payload.request_no,
        payload.document_no
    ]);

    return result.rows;
};

module.exports = {
    getitemdrawingrequest_existing,
    createdrawingitemrequest_existing
};