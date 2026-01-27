const dbconnect = require('../../../Middleware/Dbconnect');
const getSingleproductTypeitem = async (payload) => {
        const mysql =`
        SELECT * FROM "newDrawingrequest"."Product_Type_Item" pti
        LEFT JOIN "newDrawingrequest"."Product_Type" pt
            ON pti.product_type_item = pt.product_type_id
        WHERE pti.request_no = $1
        ORDER BY id ASC 
        `
        const result = await dbconnect.query(mysql, [payload.request_no]);
        return result.rows
}
const postProductTypeitem = async (payload) => {
    const sql = `
        INSERT INTO "newDrawingrequest"."Product_Type_Item"
        (
            request_no,
            product_type_item
        )
        VALUES ($1, $2)
        RETURNING *
    `;

    const result = await dbconnect.query(sql, [
        payload.request_no,
        payload.product_type_item
    ]);

    return result.rows;
};

module.exports = {
    getSingleproductTypeitem,
    postProductTypeitem
};