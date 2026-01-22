const dbconnect = require('../../../Middleware/Dbconnect');
const getDocumentitems = async (req, res) => {  
    const mysql =`
        SELECT * FROM public."Drawing_Document_Type"
        ORDER BY document_no ASC 
    `
    try {
        const result = await dbconnect.query(mysql);
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        msg: 'มีปัญหาเกิดขึ้นระหว่างการสร้างคำขอ',
        error: error.message
        });
    }
}

module.exports = {
    getDocumentitems
};