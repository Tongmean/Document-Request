const followUpService = require('../Service/follow');
const overdueService = require('../Service/overdue');
const requestService = require('../Service/request');
const { logUpdate } = require('../../../utility/updateLog');
const responseService = require('../Service/response');
const { overdueConfirmEmailultility } = require('../Ultility/overdueConfirmEmailultility');
const requestDateitemService = require('../Service/requestDateitem');
const postFollowFormController = async (req, res) => {
    const payload = req.body;
    const {user_id, email, position} = req.user[0];

    try {
        const result = await followUpService.postFollowForm(payload, user_id);
        const resultRequest_no = result[0].request_no;
        const request_status = 7 ; // Set the desired request status for follow-up
        const updateRequestStatus = await requestService.updateStatusrequest(resultRequest_no, request_status);
        // update log
        const table_name = '"newDrawingrequest"."Request_Form"';
        const column = 'request_status';
        const id = resultRequest_no
        const oldValue = null;
        const newValue = "Overdue"
        const update_log_result =  await logUpdate(table_name, column, id, oldValue, newValue, "updated" , user_id)
        //
        //email section
        const postTitle = `คำขอจัดทำ Drawing: ${payload.request_no}`;
        const requestData = await requestService.getSinglerequestbyrequest_no({request_no: payload.request_no});
        const responseData = await responseService.getSingleresponse({request_no: payload.request_no});
        const requestDateitemData = await requestDateitemService.getSinglerequestDateitem({request_no: payload.request_no});

        const sendEmailResult = await sendpopupNotification(postTitle, requestData, responseData, (req.user[0]), payload, requestDateitemData);
        res.status(200).json({
            success: true,
            msg: 'Request processed successfully',
            data: {
                followData: result,
                updateRequestStatus: updateRequestStatus,
                update_log_result: update_log_result,
                sendEmailResult:sendEmailResult
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        msg: 'An error occurred while processing the request',
        error: error.message
        });
    }
};

const postOverdueController = async (req, res) => {
    const payload = req.body;
    const {user_id, email, position} = req.user[0];

    try {
        
        // let request_status = 8 ; // Set the desired request status for overdue
        // if(payload.isneed === false){
        //     let request_status = 5 ; // Set the desired request status for not need
        //     const updateRequestStatus = await requestService.updateStatusrequest(resultRequest_no, request_status);
        // }
        // default status = overdue
        let request_status = null; 
        const result = await overdueService.postoverdueForm(payload, user_id);
        const resultRequest_no = result[0].request_no;
        // if not need → change status
        if (payload.isneed === false) {
            request_status = 5;
            
        }else{
            request_status = 8
        }
        const updateRequestStatus  = await requestService.updateStatusrequest(
            resultRequest_no,
            request_status
        )
        // update log
        const table_name = '"newDrawingrequest"."Request_Form"';
        const column = 'request_status';
        const id = resultRequest_no
        const oldValue = null;
        
        let newValue;

        if (payload.isneed === false) {
            newValue = "Cancelled";
        } else {
            newValue = "Isneed";
        }
        const update_log_result =  await logUpdate(table_name, column, id, oldValue, newValue, "updated" , user_id)

        //email section
        const postTitle = `คำขอจัดทำ Drawing: ${payload.request_no}`;
        const requestData = await requestService.getSinglerequestbyrequest_no({request_no: payload.request_no});
        const responseData = await responseService.getSingleresponse({request_no: payload.request_no});
        const requestDateitemData = await requestDateitemService.getSinglerequestDateitem({request_no: payload.request_no});

        const sendEmailResult = await overdueConfirmEmailultility(postTitle, requestData, responseData, (req.user[0]), payload, requestDateitemData, payload);


        res.status(200).json({
            success: true,
            msg:   `คำขอของคุณ Request_no: ${payload.request_no} ได้รับแล้ว + แจ้งเตือนทางแมลเรียบร้อย ครับ`,
            data: {
                overdueData: result,
                updateRequestStatus: updateRequestStatus,
                update_log_result: update_log_result,
                sendEmailResult: sendEmailResult
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        msg: 'An error occurred while processing the request',
        error: error.message
        });
    }
};

module.exports = {
    postFollowFormController,
    postOverdueController
}