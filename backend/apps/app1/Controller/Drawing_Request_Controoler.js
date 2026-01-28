const drawingService = require('../Service/Drawing_Request_Service');
const drawingitemService = require('../Service/Drawing_Rquest_Item_Service');
const dbconnect = require('../../../Middleware/Dbconnect');
const emailService = require('../Service/emailService');
const getalldrawingrequest_existing = async (req, res) => {
    try {
        const result = await drawingService.getalldrawingrequest_existing();
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
const getalldrawingrequest_existingbyid = async (req, res) => {
    const {request_id} = req.body;
    // console.log('Received request_id:', req.body);
    try {
        const result = await drawingService.getalldrawingrequest_existingbyid({request_id});
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
const getrquestno_existing = async (req, res) => {
    try {
        const result = await drawingService.getrquestno_existing();
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลรหัสคำขอสำเร็จ',
            data: result
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        msg: 'มีปัญหาเกิดขึ้นระหว่างการดึงข้อมูลรหัสคำขอ',
        error: error.message
        });
    }
}

const createdrawingrequest_existing = async (req, res) => {
    const {user_id, email, position, username} = req.user[0];
    // console.log('user_id, email, position, username', user_id, email, position, username)
    const payload = req.body;

    try {
        await dbconnect.query('BEGIN');
        // 0 get request no
        const result = await drawingService.getrquestno_existing();
        const resultRequestno = result[0].next_request_no
        
        // console.log('result[0].row.next_request_no', resultRequestno)
        // 1️⃣ Create request
        const requestResult = await drawingService.createdrawingrequest_existing(payload, user_id, resultRequestno);
        const insertedRequest = requestResult[0]; // rows already returned
        const request_no = insertedRequest.request_no;

        // 2️⃣ Create request items
        const insertedItems = [];
        for (const item of payload.request_item) {
            const itemPayload = {
                request_no,
                document_no: item.document_no
            };

            const itemResult =
                await drawingitemService.createdrawingitemrequest_existing(itemPayload);

            insertedItems.push(itemResult[0]);
        }

        await dbconnect.query('COMMIT');
        //Email Notifiction
        const emailNotification = await emailService.sendRequesterNotification(email, 'ใบขอ Drawing เพื่อใช้งาน', payload, insertedRequest, email, position, username);
        // console.log('Email notification sent:', emailNotification);
        res.status(200).json({
            success: true,
            msg: 'สร้างคำขอใหม่สำเร็จ + ส่งอีเมลแจ้งเตือนไปยังผู้ขอเรียบร้อยแล้ว',
            data :{
                request: insertedRequest,
                requestItems: insertedItems
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
};
const getRequestDateitems = async (request_no) => {
    const dateitems = await drawingitemService.getDateitemsByRequestNo(request_no);
    try {
        const result = await drawingService.getalldrawingrequest_existing();
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
    getalldrawingrequest_existing,
    getalldrawingrequest_existingbyid,
    createdrawingrequest_existing,
    getrquestno_existing
};