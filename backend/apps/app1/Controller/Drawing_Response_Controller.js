const dbconnect = require('../../../Middleware/Dbconnect');
const drawingService = require('../Service/Drawing_Request_Service');
const emailService = require('../Service/emailService');
const drawingresponseservice = require('../Service/Drawing_response_Service');
const urlResponseService = require('../Service/Drawing_Resopnse_Url_Service');
const getalldrawingresponse_existing = async (req, res) => {
    try {
        const result = await drawingresponseservice.getalldrawingresponse_existing();
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: result
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        msg: 'มีปัญหาเกิดขึ้นระหว่างการดึงข้อมูล',
        error: error.message
        });
    }
};
const getalldrawingresponse_existingbyid = async (req, res) => {
    const {request_id} = req.body;
    // console.log('Received response_id:', req.body);
    try {
        const result = await drawingresponseservice.getdrawingresponse_existingbyid({request_id});
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: result
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        msg: 'มีปัญหาเกิดขึ้นระหว่างการดึงข้อมูล',
        error: error.message
        });
    }
};

const createDrawingresponse = async (req, res) => {
    // const user_id = req.user[0].user_id;
    const {user_id, email, position, username} = req.user[0];
    const payload = req.body;
    console.log('payload:', payload);
    // console.log('response:', response);
    try {
        await dbconnect.query('BEGIN');
        //1. Insert to Drawing_Response
        const result = await drawingresponseservice.createdrawingresponse_existing(payload, user_id);
        const response = result.rows;

        //2. Insert to Drawing_Response_URL
        const insertedItems = [];
        for (const url of payload.urls) {
            const itemsUrl = {
                path: url
            } 
            const urlResult = await urlResponseService.getdrawingresponseurl_existingbyid(itemsUrl, payload.request_no);
            insertedItems.push(urlResult[0]);
        }
        //3 change request status to Approved
        const updateStatus = await drawingService.changeStatusrequest_existing(payload);
        const emailNotification = await emailService.sendApproverNotification(email, 'ใบขอ Drawing เพื่อใช้งาน', payload, position, username);

        await dbconnect.query('COMMIT');

        res.status(200).json({
            success: true,
            msg: 'สร้างคำขอใหม่สำเร็จ + ส่งอีเมลแจ้งเตือนไปยังผู้ขอเรียบร้อยแล้ว',
            data :{
                respone: response,
                urlItem: insertedItems,
                statusRequest: updateStatus.rows
            }
            
        });
    } catch (error) {
        await dbconnect.query('ROLLBACK');
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'มีปัญหาเกิดขึ้นระหว่างการสร้างคำขอ',
            error: error.message
        });
    }
}

const getUrlbyid = async (req, res) => {
    const {request_id} = req.body;
    // console.log('Received response_id:', request_id);
    try {
        const result = await urlResponseService.getUrlbyid(request_id);
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: result
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        msg: 'มีปัญหาเกิดขึ้นระหว่างการดึงข้อมูล',
        error: error.message
        });
    }
}
module.exports = {
    getalldrawingresponse_existing,
    getalldrawingresponse_existingbyid,
    createDrawingresponse,
    getUrlbyid
}