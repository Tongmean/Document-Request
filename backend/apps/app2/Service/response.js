//call database connection
const dbconnect = require('../../../Middleware/Dbconnect');
const getAllresponse = async () => {
    const mysql =`
    SELECT 
        rff.id, rf.request_no, rf_status.status_name, rf.response_at,
        rff.department, rff.customer_name, rff.part_no, rff.detail, rff.request_remark,
        u_response.email AS "response_by", u_response.username AS "response_username", u_response.position AS "response_position",
        u_responeassignropro.email AS "assign_processor_email", u_responeassignropro.username AS "assign_processor_username",
        u_responeassignropro.position AS "assign_processor_position",
        u_responessigntoapp.email AS "assign_approver_email", u_responessigntoapp.username AS "assign_approver_username",
        u_responessigntoapp.position AS "assign_approver_position"
        
        
    FROM "newDrawingrequest"."Response_Form" rf
    LEFT JOIN "newDrawingrequest"."Request_Form" rff
    ON rff.request_no = rf.request_no
    LEFT JOIN public."User" u_response
    ON u_response.user_id = rf.response_by

    LEFT JOIN "newDrawingrequest"."Status" rf_status
    ON rff.request_status = rf_status.status_id
    LEFT JOIN public."User" u_responeassignropro
    ON u_responeassignropro.user_id = rf.assign_to_proccessor
    LEFT JOIN public."User" u_responessigntoapp
    ON u_responessigntoapp.user_id = rf.assign_to_approver

    ORDER BY -rf.id
    `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getSingleresponse = async (payload) => {
    const mysql =`
        SELECT 
            rf.id, rf.request_no, rf_status.status_name, rf.response_at,
            u_response.email AS "response_by", u_response.username AS "response_username", u_response.position AS "response_position",
            u_responeassignropro.email AS "assign_processor_email", u_responeassignropro.username AS "assign_processor_username",
            u_responeassignropro.position AS "assign_processor_position",
            u_responessigntoapp.email AS "assign_approver_email", u_responessigntoapp.username AS "assign_approver_username",
            u_responessigntoapp.position AS "assign_approver_position"
            
            
        FROM "newDrawingrequest"."Response_Form" rf
        LEFT JOIN public."User" u_response
        ON u_response.user_id = rf.response_by
        -- LEFT JOIN "Role_Item" ri
        --   ON rf.response_by = ri.user_id
        -- LEFT JOIN "Role_Option" ro
        --   ON ri.role_item = ro.role_option_id
        LEFT JOIN "newDrawingrequest"."Status" rf_status
        ON rf.response_status = rf_status.status_id
        --Assign processor
        LEFT JOIN public."User" u_responeassignropro
        ON u_responeassignropro.user_id = rf.assign_to_proccessor
        
        -- LEFT JOIN "Role_Item" riprocessor
        --   ON u_responeassignropro.user_id = riprocessor.user_id
        -- LEFT JOIN "Role_Option" rorocessor
        --   ON riprocessor.role_item = rorocessor.role_option_id
        --Assign Approver
        LEFT JOIN public."User" u_responessigntoapp
        ON u_responessigntoapp.user_id = rf.assign_to_approver
        
        -- LEFT JOIN "Role_Item" riapp
        --   ON u_responessigntoapp.user_id = riapp.user_id
        -- LEFT JOIN "Role_Option" roapp
        --   ON riapp.role_item = roapp.role_option_id
        WHERE rf.request_no = $1
        ORDER BY -id
    `
    const result = await dbconnect.query(mysql, [payload.request_no]);
    return result.rows
}


const postResponse = async (payload) => {
    const query = `
    INSERT INTO "newDrawingrequest"."Response_Form" (
      request_no,
      assign_to_proccessor,
      assign_to_approver,
      response_status,
      response_by,
      response_at
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
    const values = [
      payload.request_no,
      payload.assign_to_proccessor,
      payload.assign_to_approver,
      payload.response_status,
      payload.response_by,
      payload.response_at
    ];
  
    const result = await dbconnect.query(query, values);
    return result.rows;
  
}
module.exports = {  
    getAllresponse,
    getSingleresponse,
    postResponse
}