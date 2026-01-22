const dbconnect = require('../../../Middleware/Dbconnect');

const getdrawingresponseurl_existingbyid = async (payload, request_no) => {
    const mysql =`
        INSERT INTO "Url_Form"
        (
            request_no,
            path
        )
        VALUES ($1, $2)
        RETURNING *
    `
    const result = await dbconnect.query(mysql, [
        request_no,
        payload.path
    ]);

    return result.rows;
}

const getUrlbyid = async (request_id) => {
    // console.log(payload);
    const mysql =`
        SELECT "Request_Utility_Existing_Drawing_Form".request_id, "Sender_Utility_Existing_Drawing_Form".request_no, "Url_Form".path FROM "Sender_Utility_Existing_Drawing_Form"
        LEFT JOIN "Url_Form"
            ON "Sender_Utility_Existing_Drawing_Form".request_no = "Url_Form".request_no
        LEFT JOIN "Request_Utility_Existing_Drawing_Form"
            ON "Request_Utility_Existing_Drawing_Form".request_no = "Sender_Utility_Existing_Drawing_Form".request_no
        WHERE "Request_Utility_Existing_Drawing_Form".request_id = $1
    `
    const result = await dbconnect.query(mysql,[request_id]);
    return result.rows
}

module.exports = {
    getdrawingresponseurl_existingbyid,
    getUrlbyid
}
