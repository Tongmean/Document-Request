//call database connection
const dbconnect = require('../../../Middleware/Dbconnect');

const getalldrawingresponse_existing = async () => {
        const mysql =`
        SELECT 	
                "Request_Utility_Existing_Drawing_Form".request_id,
                "Request_Utility_Existing_Drawing_Form".department,
                "Request_Utility_Existing_Drawing_Form".detail,
                "Request_Utility_Existing_Drawing_Form".reason,
                "Request_Utility_Existing_Drawing_Form".request_at,
                "Request_Utility_Existing_Drawing_Form".request_by,
            
                "Sender_Utility_Existing_Drawing_Form".Sender_id,
                "Sender_Utility_Existing_Drawing_Form".request_no,
                "Sender_Utility_Existing_Drawing_Form".created_at_sender_person,
                
                "Status".status_name,
            
                -- Use the Aliases here to get the correct data
                "SenderUser".username AS sender_username,
                "SenderUser".position AS sender_position,
                "RequestUser".username AS requester_username,
                "RequestUser".position AS requester_position
                
            FROM "Sender_Utility_Existing_Drawing_Form"
            -- Join 1: For the person who SENT/Processed the response
            LEFT JOIN "User" AS "SenderUser"
                ON "SenderUser".user_id = "Sender_Utility_Existing_Drawing_Form".sender_person
            
            -- Join 2: For the person who REQUESTED the drawing
            LEFT JOIN "Request_Utility_Existing_Drawing_Form"
                ON "Request_Utility_Existing_Drawing_Form".request_no = "Sender_Utility_Existing_Drawing_Form".request_no
            
            LEFT JOIN "User" AS "RequestUser"
                ON "RequestUser".user_id = "Request_Utility_Existing_Drawing_Form".request_by
            
            LEFT JOIN "Status" 
                ON "Status".status_no = "Sender_Utility_Existing_Drawing_Form".status
            
            ORDER BY "Sender_Utility_Existing_Drawing_Form".Sender_id DESC;
        `
        const result = await dbconnect.query(mysql);
        return result.rows
}
const getdrawingresponse_existingbyid = async (payload) => {
        const mysql =`
        SELECT 	
            "Request_Utility_Existing_Drawing_Form".request_id,
            "Sender_Utility_Existing_Drawing_Form".Sender_id,
            "Sender_Utility_Existing_Drawing_Form".request_no,
            "Sender_Utility_Existing_Drawing_Form".created_at_sender_person,
            "Status".status_name,
            "User".email,
            "User".username,
            "User".position
            
        FROM "Sender_Utility_Existing_Drawing_Form"
            LEFT JOIN "User"
            ON "User".user_id = "Sender_Utility_Existing_Drawing_Form".sender_person
            LEFT JOIN "Request_Utility_Existing_Drawing_Form"
            ON "Request_Utility_Existing_Drawing_Form".request_no = "Sender_Utility_Existing_Drawing_Form".request_no
            LEFT JOIN "Status" 
            ON "Status".status_no = "Sender_Utility_Existing_Drawing_Form".status
        WHERE "Request_Utility_Existing_Drawing_Form".request_id = $1

        `
        const result = await dbconnect.query(mysql,[ payload.request_id]);
        return result.rows
}

const createdrawingresponse_existing = async (payload, user_id) => {
    const sql = `
        INSERT INTO "Sender_Utility_Existing_Drawing_Form"
        (
            request_no,
            sender_person,
            status,
            created_at_sender_person
        )
        VALUES ($1, $2, $3,$4 )
        RETURNING *
    `;

    const result = await dbconnect.query(sql, [
        payload.request_no,
        user_id,
        payload.status,
        (new Date())
    ]);

    return result.rows;
};

module.exports = {
    getalldrawingresponse_existing,
    getdrawingresponse_existingbyid,
    createdrawingresponse_existing
}