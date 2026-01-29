const responseService = require('../Service/response');
const requestService = require('../Service/request');
const requestDateservice = require('../Service/requestDateitem')
const {postFollowForm} = require('../Service/checkSevice');
const { logUpdate } = require('../../../utility/updateLog');
const dbconnect = require('../../../Middleware/Dbconnect');
const { sendResponseNotification } = require('../Ultility/ResponseEmailultility');
const requestDateitemService = require('../Service/requestDateitem');
//
const { sendpopupNotification } = require('../Ultility/popupEmailultility');


const getAllresponseController = async (req, res) => {
    try {
        const result = await responseService.getAllresponse();
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
const postResponsecontrroller = async (req, res) => {
    const {user_id, email, position} = req.user[0];
    const payload = req.body;
    // console.log("Payload received in postResponsecontrroller:", payload);
    try {
        await dbconnect.query('BEGIN');
        //00check request_no duplicate
        const exists = await responseService.checkDuplicate(payload);
        // console.log('Exists:', exists);
        if (exists.length > 0) {
            return res.status(400).json({
              msg: 'request_no already exists (Assigned response before)',
              data: exists
            });
        }
        //01 post response
        const result = await responseService.postResponse(payload, user_id);
        // console.log('Posted Response:', result);
        // console.log("payload.requestDateitems:", payload);
        // console.log("payload.request_no", payload.request_no);
        const resultRequest_no = payload.request_no;
        const updateRequestStatus = await requestService.updateStatusrequest(resultRequest_no, 2);
        const updateDateitems = [];
        for (const item of payload.requestDateitems)  {            
            const Dateitems = {
                id: item.id,
                expected_date: item.expected_date
                
            };
            await requestDateservice.updateDateitems(Dateitems);
            updateDateitems.push(Dateitems[0]);
        }
        // update log
        const table_name = '"newDrawingrequest"."Request_Form"';
        const column = 'request_status';
        const id = resultRequest_no
        const oldValue = null;
        const newValue = "Accepted"
        const update_log_result =  await logUpdate(table_name, column, id, oldValue, newValue, "updated" , user_id)
        //email section
        const postTitle = `คำขอจัดทำ Drawing: ${resultRequest_no}`;
        const requestData = await requestService.getSinglerequestbyrequest_no({request_no: resultRequest_no});
        const responseData = await responseService.getSingleresponse({request_no: resultRequest_no});
        const requestDateitemData = await requestDateitemService.getSinglerequestDateitem({request_no: resultRequest_no});

        const sendEmailResult = await sendResponseNotification(postTitle, requestData, responseData, (req.user[0]), payload, requestDateitemData);
        await dbconnect.query('COMMIT');
        res.status(200).json({
            success: true,
            msg: 'คำขอของคุณบันทึกสำเร็จแล้ว + ส่งอีเมลแจ้งเตือนไปยังผู้ขอเรียบร้อยแล้ว',
            data: {
                response: result,
                updateRequestStatus: updateRequestStatus,
                updateDateitems: updateDateitems,
                update_log_result,
                sendEmailResult: sendEmailResult
            }
        });
    } catch (error) {
        console.error(error);
        await dbconnect.query('ROLLBACK')
        res.status(500).json({
        success: false,
        msg: 'An error occurred while processing the request',
        error: error.message
        });
    }
}

const postCheckformController = async (req, res) => {
    const {user_id, email, position} = req.user[0];
    const payload = req.body;
    // console.log("Payload received in postCheckform:", payload);
    try {
        const result = await postFollowForm(payload, user_id);
        const updateRequestStatus = await requestService.updateStatusrequest(payload.request_no, 9);
        // update log
        const table_name = '"newDrawingrequest"."Request_Form"';
        const column = 'request_status';
        const id = payload.request_no
        const oldValue = null;
        const newValue = "Checked"
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
                checkForm: result,
                updateRequestStatus: updateRequestStatus,
                update_log_result: update_log_result,
                sendEmailResult : sendEmailResult
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        msg: 'An error occurred while processing the check form',
        error: error.message
        });
    }
}
module.exports = {
    getAllresponseController,
    postResponsecontrroller,
    postCheckformController
};