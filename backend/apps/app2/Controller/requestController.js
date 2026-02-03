const requestService = require('../Service/request');
const { logUpdate } = require('../../../utility/updateLog');
const dbconnect = require('../../../Middleware/Dbconnect');
const documentItemService = require('../Service/documentTypeitem');
const drawingDocumenttypeItem = require('../Service/drawingDocumenttypeItem');
const drawingTypeitemService = require('../Service/drawingTypeitem');
const productTypeitemService = require('../Service/productTypeitem');
const dateItemService = require('../Service/requestDateitem');
const requestDateitemService = require('../Service/requestDateitem');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const {printRequestController} = require('./printRequestcontroller');
const { sendRequestNotification } = require('../Ultility/requestEmailutility');
const getRequest_no = async (req, rees) => {
    try {
        const result = await requestService.getNextRequest_no();
        rees.status(200).json({
            success: true,
            msg: 'Request No fetched successfully',
            data: result
        });
    } catch (error) {
        console.error(error);

        rees.status(500).json({
        success: false,
        msg: 'An error occurred while fetching the Request No',
        error: error.message
        });
    }
};
const requestController = async (req, res) => {
    try {
        const result = await requestService.getAllrequest();
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
//Middleware upload file use multer

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../Assets/RequestFiles');
fs.mkdirSync(uploadDir, { recursive: true });

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save files to 'Assets/Drawing' folder
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/\s+/g, '_').replace(/[^\w\-_.ก-๙]/g, '');        
        // const uniqueSuffix = `${Date.now()}`;
        cb(null, `${sanitizedFilename}`);
    }
});


// Multer configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
}).array('files', 10); // Accept up to 10 files

// Middleware for handling single file upload
// const uploadDrawingMiddleware = upload.single('file');
const uploadDrawingMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ msg: 'File size exceeds 10MB limit.' });
            }
            if (file.mimetype !== "application/pdf") {
                cb(new Error("Only PDF files allowed"));
              }
            return res.status(400).json({ msg: 'File upload failed.', error: err.message });
        }
        next(); // Proceed to the next middleware or route handler
    });
};

const postRequest = async (req, res) => {  
    const {user_id, email, position} = req.user[0];
    const payload = req.body
    const files = req.files;
    // console.log('Payload:', payload);
    // console.log('typeof:', typeof(payload));
    // console.log('req.files:', req.files);
    const requestPayload = JSON.parse(payload.requestItems)[0]
    try {
        await dbconnect.query('BEGIN');
        //01 Get next request no
        const next_request_no_result = await requestService.getNextRequest_no();
        // console.log('Next Request No:', next_request_no[0].nextrequest);
        const next_request_no = next_request_no_result[0].next_request_no;
        //02 Insert into request table
        const insert_request_result = await requestService.postRequest(requestPayload, next_request_no, user_id);
        console.log('insert_request_result', insert_request_result)
        //03 Insert into document type item table
        const insert_documenttypeitems = []
        for (const item of JSON.parse(payload.documenttypeitems)) {
            const documenttypeitemPayload = {
                request_no: next_request_no,
                document_type: item.document_type_id
                
            };
            const documenttypeitemResult =
                await documentItemService.postDocumenttypeitem(documenttypeitemPayload);
            // console.log('Document Type Item Result:', documenttypeitemResult);
            insert_documenttypeitems.push(documenttypeitemResult[0]);
        }
        //04 Insert into drawing document type item table
        const insert_drawingdocumenttypeitems = []
        for (const item of JSON.parse(payload.drawingDocumenttypeitems)) {
            const drawingdocumenttypeitemPayload = {
                request_no: next_request_no,
                drawing_document_type: item.drawing_document_type_id
                
            };
            const drawingdocumenttypeitemResult =
                await drawingDocumenttypeItem.postDrawingdocumentitem(drawingdocumenttypeitemPayload);

            insert_drawingdocumenttypeitems.push(drawingdocumenttypeitemResult[0]);
        }
        //05 Insert into drawing type item table
        const inserted_drawingtypeitems = []
        for (const item of JSON.parse(payload.drawingtypeitems)) {
            const drawingtypeitemPayload = {
                request_no: next_request_no,
                drawing_type: item.drawing_type_id
                
            };
            const drawingtypeitemResult =
                await drawingTypeitemService.postDrawingtypeItem(drawingtypeitemPayload);

            inserted_drawingtypeitems.push(drawingtypeitemResult[0]);
        }
        //06 Insert into product type item table
        const inserted_producttypeitems = []
        // console.log('payload.productTypeitems', payload.productTypeitems)
        for(const item of JSON.parse(payload.productTypeitems)){
            const producttypeitemPayload = {
                request_no: next_request_no,
                product_type_item: item.product_type_id
            };
            const producttypeitemResult =
                await productTypeitemService.postProductTypeitem(producttypeitemPayload);
                // console.log('Product Type Item Result:', producttypeitemResult);
            inserted_producttypeitems.push(producttypeitemResult[0]);
        }
        //07 Insert into date item table
        const inserted_dateitems = [];
        for(const item of JSON.parse(payload.requestDateitems)){
            const requestdateitemPayload = {
                request_no: next_request_no,
                request_date: item.request_date,
                // expected_date: item.expected_date
            };
            const dateitemResult =
                await dateItemService.postDateitem(requestdateitemPayload);
            inserted_dateitems.push(dateitemResult[0]);
        }
        //08 update log
        const table_name = '"newDrawingrequest"."Request_Form"';
        const column = 'request_status';
        const id = next_request_no
        const oldValue = null;
        const newValue = "Submitted"
        const update_log_result =  await logUpdate(table_name, column, id, oldValue, newValue, "updated" , user_id)
        //File post
        const insertFiles =[]
        for (const file of files) {
            const { filename, originalname, path } = file;
            // const uniqueSuffix = `${Date.now()}-${originalname}`;
            const relativeFilePath = `RequestFiles/${filename}`
            // const FilePath = path.join(__dirname, '../app/app2/Assets', relativeFilePath);
            const result = await dbconnect.query(
                `INSERT INTO "newDrawingrequest".request_uploaded_files (request_no, original_name, file_path)
                VALUES ($1, $2, $3)`,
                [next_request_no, originalname, relativeFilePath]
            )
            insertFiles.push(result.rows[0]);
        }
        //Query Detail for mail
        const emailData = await requestService.getSinglerequest({id: insert_request_result[0].id});
        const documenttypeitemData = await documentItemService.getsingledocumenttypeitem({request_no: next_request_no});
        const drawingtypeitemData = await drawingTypeitemService.getsingledrawingtypeitem({request_no: next_request_no});
        const drawingDocumenttypeitemData = await drawingDocumenttypeItem.getsingledrawingDocumenttypeitem({request_no: next_request_no});
        const productTypeitemData = await productTypeitemService.getSingleproductTypeitem({request_no: next_request_no});

        await dbconnect.query('COMMIT');
        // Email Notifiaction
        // console.log('Preparing to send email notification...', emailData);
        const postTitle = `คำขอจัดทำ Drawing: ${next_request_no}`;
        const emailResult = await sendRequestNotification(payload, postTitle, emailData, documenttypeitemData, drawingtypeitemData, drawingDocumenttypeitemData, productTypeitemData, (req.user[0]));
        res.status(200).json({
            success: true,
            msg: 'คำขอของคุณบันทึกสำเร็จแล้ว + ส่งอีเมลแจ้งเตือนไปยังผู้ขอเรียบร้อยแล้ว',
            data: {
                next_request_no: next_request_no,
                insert_request_result: insert_request_result,
                insert_documenttypeitems: insert_documenttypeitems,
                insert_drawingdocumenttypeitems: insert_drawingdocumenttypeitems,
                inserted_drawingtypeitems: inserted_drawingtypeitems,
                inserted_producttypeitems: inserted_producttypeitems,
                inserted_dateitems: inserted_dateitems,
                update_log_result: update_log_result,
                emailResult: emailResult,
                insertFiles: insertFiles
            }
        });
        
    } catch (error) {
        await dbconnect.query('ROLLBACK');
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'An error occurred while processing the print request',
            error: error.message
        });
    }
} 

const getRequestdateItems = async (req, res) => {
    const payload = req.body;
    try {
        const result = await requestDateitemService.getSinglerequestDateitem(payload);
        res.status(200).json({
            success: true,
            msg: 'Request date items fetched successfully',
            data: result
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        msg: 'An error occurred while fetching the request date items',
        error: error.message
        });
    }
}
module.exports = {
    uploadDrawingMiddleware,
    requestController,
    postRequest,
    getRequest_no,
    getRequestdateItems,
    
};