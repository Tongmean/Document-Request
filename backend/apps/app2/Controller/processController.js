const processService = require('../Service/process');
const requestService = require('../Service/request');
const { logUpdate } = require('../../../utility/updateLog');
//
const responseService = require('../Service/response');
const { sendpopupNotification } = require('../Ultility/popupEmailultility');
const requestDateitemService = require('../Service/requestDateitem');
const postProcessform = async (req, res) => {
    const payload = req.body;
    console.log("Payload received in postProcessform:", payload);
    const request_status = 3 ; // Set the desired request status for overdue
    const {user_id, email, position} = req.user[0];
    try {
        const result = await processService.postprocessForm(payload, user_id, request_status);
        const updateRequestStatus = await requestService.updateStatusrequest(payload.request_no, request_status);
        // update log
        const table_name = '"newDrawingrequest"."Request_Form"';
        const column = 'Processed';
        const id = payload.request_no
        const oldValue = null;
        const newValue = "Processed"
        const update_log_result =  await logUpdate(table_name, column, id, oldValue, newValue, "updated" , user_id)
        //email section
        const postTitle = `คำขอจัดทำ Drawing: ${payload.request_no}`;
        const requestData = await requestService.getSinglerequestbyrequest_no({request_no: payload.request_no});
        const responseData = await responseService.getSingleresponse({request_no: payload.request_no});
        const requestDateitemData = await requestDateitemService.getSinglerequestDateitem({request_no: payload.request_no});

        const sendEmailResult = await sendpopupNotification(postTitle, requestData, responseData, (req.user[0]), payload, requestDateitemData);

        res.status(200).json({
            success: true,
            msg: 'ได้บันทึกการประมวลผลแบบฟอร์มเรียบร้อยแล้ว + ส่งอีเมลแจ้งเตือนไปยังผู้ขอเรียบร้อยแล้ว',
            data: {
                processData: result,
                updateRequestStatus: updateRequestStatus,
                update_log_result: update_log_result,
                sendEmailResult : sendEmailResult
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        msg: 'An error occurred while starting the process',
        error: error.message
        });
    }
 }

 module.exports = {
    postProcessform
 }