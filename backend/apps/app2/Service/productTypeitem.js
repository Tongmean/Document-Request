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

module.exports = {
    getSingleproductTypeitem
};