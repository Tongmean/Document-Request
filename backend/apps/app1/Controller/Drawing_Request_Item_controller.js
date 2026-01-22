const drawingitemService = require('../Service/Drawing_Rquest_Item_Service');
const getitemdrawingrequest_existing = async (req, res) => {
    const {request_no} = req.body;
    try {
        const result = await drawingitemService.getitemdrawingrequest_existing({request_no});
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
    getitemdrawingrequest_existing
};