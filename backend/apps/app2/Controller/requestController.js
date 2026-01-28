const requestService = require('../Service/request');
const { logUpdate } = require('../../../utility/updateLog');
const dbconnect = require('../../../Middleware/Dbconnect');
const documentItemService = require('../Service/documentTypeitem');
const drawingDocumenttypeItem = require('../Service/drawingDocumenttypeItem');
const drawingTypeitemService = require('../Service/drawingTypeitem');
const productTypeitemService = require('../Service/productTypeitem');
const dateItemService = require('../Service/requestDateitem');
const requestDateitemService = require('../Service/requestDateitem');

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
const postRequest = async (req, res) => {  
    const {user_id, email, position} = req.user[0];
    const payload = req.body;
    // console.log('Payload:', payload);
    const requestPayload = payload.requestItems[0]
    try {
        await dbconnect.query('BEGIN');
        //01 Get next request no
        const next_request_no_result = await requestService.getNextRequest_no();
        // console.log('Next Request No:', next_request_no[0].nextrequest);
        const next_request_no = next_request_no_result[0].next_request_no;
        //02 Insert into request table
        const insert_request_result = await requestService.postRequest(requestPayload, next_request_no, user_id);
        //03 Insert into document type item table
        const insert_documenttypeitems = []
        for (const item of (payload.documenttypeitems)) {
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
        for (const item of (payload.drawingDocumenttypeitems)) {
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
        for (const item of (payload.drawingtypeitems)) {
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
        for(const item of payload.productTypeitems){
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
        for(const item of (payload.requestDateitems)){
            const requestdateitemPayload = {
                request_no: next_request_no,
                request_date: item.request_date,
                expected_date: item.expected_date
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
        await dbconnect.query('COMMIT');
        res.status(200).json({
            success: true,
            msg: 'Request processed successfully',
            data: {
                next_request_no: next_request_no,
                insert_request_result: insert_request_result,
                insert_documenttypeitems: insert_documenttypeitems,
                insert_drawingdocumenttypeitems: insert_drawingdocumenttypeitems,
                inserted_drawingtypeitems: inserted_drawingtypeitems,
                inserted_producttypeitems: inserted_producttypeitems,
                inserted_dateitems: inserted_dateitems,
                update_log_result: update_log_result
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
    requestController,
    postRequest,
    getRequest_no,
    getRequestdateItems
};