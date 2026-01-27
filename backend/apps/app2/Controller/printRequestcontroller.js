const requestService = require('../Service/request');
const responseService = require('../Service/response');
const approveService = require('../Service/approve');
const processService = require('../Service/process');
const overdueService = require('../Service/overdue');
const documentTypeitemService = require('../Service/documentTypeitem');
const drawingTypeitemService = require('../Service/drawingTypeitem');
const drawingDocumenttypeItemService = require('../Service/drawingDocumenttypeItem');
const productTypeitemService = require('../Service/productTypeitem');
const requestDateitemService = require('../Service/requestDateitem');
const followService = require('../Service/follow');
const printRequestController = async (req, res) => {
    // const payload = req.body;
    console.log('Received payload:', req.body);
    try {
        const requestData = await requestService.getSinglerequest(req.body);
        // console.log('Request Data:', requestData[0]);
        const payload = requestData[0];

        const responseData = await responseService.getSingleresponse(payload);
        const approveData = await approveService.getSingleapprove(payload);
        const processData = await processService.getSingleprocess(payload);
        const overdueData = await overdueService.getSingleoverdue(payload);
        const followData = await followService.getSinglefollowForm(payload);
        const documenttypeitemData = await documentTypeitemService.getsingledocumenttypeitem(payload);
        const drawingtypeitemData = await drawingTypeitemService.getsingledrawingtypeitem(payload);
        const drawingDocumenttypeitemData = await drawingDocumenttypeItemService.getsingledrawingDocumenttypeitem(payload);
        const productTypeitemData = await productTypeitemService.getSingleproductTypeitem(payload);
        const requestDateitemData = await requestDateitemService.getSinglerequestDateitem(payload);
        const historyLogData = await requestService.getHistorylog(payload);
        res.status(200).json({
            success: true,
            msg: 'Print request processed successfully',
            data: {
                requestData: requestData,
                responseData: responseData,
                approveData: approveData,
                processData: processData,
                overdueData: overdueData,
                documenttypeitemData : documenttypeitemData,
                drawingtypeitemData : drawingtypeitemData,
                drawingDocumenttypeitemData : drawingDocumenttypeitemData,
                productTypeitemData : productTypeitemData,
                requestDateitemData : requestDateitemData,
                followData : followData,
                historyLogData : historyLogData

            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        msg: 'An error occurred while processing the print request',
        error: error.message
        });
    }
}

module.exports = {
    printRequestController
};