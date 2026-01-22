//call database connection
const dbconnect = require('../../../Middleware/Dbconnect');

const getalldrawingrequest_existing = async () => {
        const mysql =`
        SELECT 
            "Request_Utility_Existing_Drawing_Form".request_id,
            "Request_Utility_Existing_Drawing_Form".request_no,
            "Request_Utility_Existing_Drawing_Form".department,
            "Request_Utility_Existing_Drawing_Form".detail,
            "Request_Utility_Existing_Drawing_Form".reason,
            "Status".status_name,
            "User".email,
            "Request_Utility_Existing_Drawing_Form".request_at,
            "User".username,
            "User".position
        
        FROM "Request_Utility_Existing_Drawing_Form"
        LEFT JOIN "User"
        ON "User".user_id = "Request_Utility_Existing_Drawing_Form".request_by
        LEFT JOIN "Status" 
        ON "Status".status_no = "Request_Utility_Existing_Drawing_Form".status
        ORDER BY -request_id ASC 

        `
        const result = await dbconnect.query(mysql);
        return result.rows
}
const getalldrawingrequest_existingbyid = async (payload) => {
        const mysql =`
        SELECT 
            "Request_Utility_Existing_Drawing_Form".request_id,
            "Request_Utility_Existing_Drawing_Form".request_no,
            "Request_Utility_Existing_Drawing_Form".department,
            "Request_Utility_Existing_Drawing_Form".detail,
            "Request_Utility_Existing_Drawing_Form".reason,
            "Status".status_name,
            "User".email,
            "Request_Utility_Existing_Drawing_Form".request_at,
            "User".username,
            "User".position
        
        FROM "Request_Utility_Existing_Drawing_Form"
        LEFT JOIN "User"
        ON "User".user_id = "Request_Utility_Existing_Drawing_Form".request_by
        LEFT JOIN "Status" 
        ON "Status".status_no = "Request_Utility_Existing_Drawing_Form".status
        WHERE "Request_Utility_Existing_Drawing_Form".request_id = $1

        `
        const result = await dbconnect.query(mysql, [payload.request_id]);
        return result.rows
}
const getrquestno_existing = async () => {  
    const mysql =`
        WITH last_no AS (
            SELECT
                EXTRACT(YEAR FROM request_at)::int AS year,
                MAX(split_part(request_no, '/', 1)::int) AS max_no
            FROM "Request_Utility_Existing_Drawing_Form"
            GROUP BY EXTRACT(YEAR FROM request_at)
        ),
        numbered AS (
            SELECT
                r.request_at,
                r.request_no,
                ROW_NUMBER() OVER (
                    PARTITION BY EXTRACT(YEAR FROM r.request_at)
                    ORDER BY r.request_at
                ) AS rn
            FROM "Request_Utility_Existing_Drawing_Form" r
        )
        SELECT
            n.request_at,
            (COALESCE(l.max_no, 0) + n.rn)::text
            || '/' ||
            EXTRACT(YEAR FROM n.request_at)::text AS next_request_no
        FROM numbered n
        LEFT JOIN last_no l
            ON l.year = EXTRACT(YEAR FROM n.request_at)
        ORDER BY n.request_at;
    
    `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const createdrawingrequest_existing = async (payload, user_id, resultRequestno) => {
    const sql = `
        INSERT INTO "Request_Utility_Existing_Drawing_Form"
        (
            request_no,
            department,
            detail,
            reason,
            status,
            request_by,
            request_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;

    const result = await dbconnect.query(sql, [
        resultRequestno,
        payload.department,
        payload.detail,
        payload.reason,
        payload.status,
        user_id,
        payload.request_at
    ]);

    return result.rows;
};

const changeStatusrequest_existing = async (payload) => {
    const sql = `
        UPDATE "Request_Utility_Existing_Drawing_Form"
        SET
            status = $1
        WHERE request_no = $2
        RETURNING *
    `;

    const result = await dbconnect.query(sql, [
        payload.status,
        payload.request_no
    ]);

    return result.rows;
};
module.exports = {
    getalldrawingrequest_existing,
    getalldrawingrequest_existingbyid,
    createdrawingrequest_existing,
    getrquestno_existing,
    changeStatusrequest_existing
};