const approveService = require('../Service/approve');
const requestService = require('../Service/request');
//
const { logUpdate } = require('../../../utility/updateLog');
const responseService = require('../Service/response');
const { sendpopupNotification } = require('../Ultility/popupEmailultility');
const requestDateitemService = require('../Service/requestDateitem');

const approveController = async (req, res) => {
    try {
        const result = await approveService.getAllapprove();
        res.status(200).json({
            success: true,
            msg: 'Request processed successfully',
            data: result
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        msg: 'An error occurred while processing the request',
        error: error.message
        });
    }
}

const postApprovecontroller = async (req, res) => {
    const payload = req.body;
    const request_status = 4 ; // Set the desired request status for overdue
    const {user_id, email, position} = req.user[0];
    try {
        const result = await approveService.postapproveForm(payload, user_id, request_status);
        const updateRequestStatus = await requestService.updateStatusrequest(payload.request_no, request_status);
        // update log
        const table_name = '"newDrawingrequest"."Request_Form"';
        const column = 'request_status';
        const id = payload.request_no
        const oldValue = null;
        const newValue = "Approved"
        const update_log_result =  await logUpdate(table_name, column, id, oldValue, newValue, "updated" , user_id)
        //email section
        const postTitle = `คำขอจัดทำ Drawing: ${payload.request_no}`;
        const requestData = await requestService.getSinglerequestbyrequest_no({request_no: payload.request_no});
        const responseData = await responseService.getSingleresponse({request_no: payload.request_no});
        const requestDateitemData = await requestDateitemService.getSinglerequestDateitem({request_no: payload.request_no});

        const sendEmailResult = await sendpopupNotification(postTitle, requestData, responseData, (req.user[0]), payload, requestDateitemData);
  
        res.status(200).json({
            success: true,
            msg: `คำขอของคุณ: ${payload.request_no} บันทึกสำเร็จแล้ว + ส่งอีเมลแจ้งเตือนไปยังผู้ขอเรียบร้อยแล้ว`,
            data: {
                approveData: result,
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
}
module.exports = {
    approveController,
    postApprovecontroller
};