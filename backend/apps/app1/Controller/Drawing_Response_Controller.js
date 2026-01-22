const dbconnect = require('../../../Middleware/Dbconnect');
const drawingresponseservice = require('../Service/Drawing_response_Service');
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
    console.log('Received response_id:', req.body);
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

module.exports = {
    getalldrawingresponse_existing,
    getalldrawingresponse_existingbyid
}