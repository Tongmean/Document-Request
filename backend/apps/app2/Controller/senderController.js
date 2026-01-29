const senderService = require('../Service/sender');
const { logUpdate } = require('../../../utility/updateLog');
const approveService = require('../Service/approve');
const requestService = require('../Service/request');
//
const responseService = require('../Service/response');
const { sendpopupNotification } = require('../Ultility/popupEmailultility');
const requestDateitemService = require('../Service/requestDateitem');

const getAllsenderController = async (req, res) => {
    try {
        const result = await senderService.getAllsender();
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
const postSendercontroller = async (req, res) => {
    const {user_id, email, position} = req.user[0];
    const payload = req.body;
    // console.log("Payload received in postSendercontroller:", payload);
    try {
        const insertserd = []
        for (const item of payload.pathItems)  {            
            const senderPayload = {
                path: item.path
                
            };
            const insert_sender_result = await senderService.postSenderservice(senderPayload, payload.request_no);
            insertserd.push(insert_sender_result[0]);
        }
        // Update request status to "Completed"
        const updateRequestStatus = await requestService.updateStatusrequest(payload.request_no, 6);
        // update log
        const table_name = '"newDrawingrequest"."Request_Form"';
        const column = 'request_status';
        const id = payload.request_no
        const oldValue = null;
        const newValue = "Completed"
        const update_log_result =  await logUpdate(table_name, column, id, oldValue, newValue, "updated" , user_id)
        //email section
        const postTitle = `คำขอจัดทำ Drawing: ${payload.request_no}`;
        const requestData = await requestService.getSinglerequestbyrequest_no({request_no: payload.request_no});
        const responseData = await responseService.getSingleresponse({request_no: payload.request_no});
        const requestDateitemData = await requestDateitemService.getSinglerequestDateitem({request_no: payload.request_no});

        const sendEmailResult = await sendpopupNotification(postTitle, requestData, responseData, (req.user[0]), payload, requestDateitemData);
        res.status(200).json({
            success: true,
            msg: `คำขอของคุณ Request_No: ${payload.request_no} บันทึกสำเร็จแล้ว + ส่งอีเมลแจ้งเตือนไปยังผู้ขอเรียบร้อยแล้ว`,
            data: {
                insertserd: insertserd,
                update_log_result : update_log_result,
                updateRequestStatus: updateRequestStatus,
                sendEmailResult: sendEmailResult

            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        msg: 'An error occurred while processing the sender',
        error: error.message
        });
    }
}
module.exports = {
    getAllsenderController,
    postSendercontroller
};