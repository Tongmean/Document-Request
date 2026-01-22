//call database connection
const dbconnect = require('../../../Middleware/Dbconnect');

const getalldrawingresponse_existing = async () => {
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
        ORDER BY "Sender_Utility_Existing_Drawing_Form".Sender_id DESC
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

module.exports = {
    getalldrawingresponse_existing,
    getdrawingresponse_existingbyid
}