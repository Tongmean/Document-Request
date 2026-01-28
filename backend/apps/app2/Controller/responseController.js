const responseService = require('../Service/response');
const requestService = require('../Service/request');
const requestDateservice = require('../Service/requestDateitem')
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
        const result = await responseService.postResponse(payload);
        const resultRequest_no = result[0].request_no;
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

        res.status(200).json({
            success: true,
            msg: 'Request processed successfully',
            data: {
                response: result,
                updateRequestStatus: updateRequestStatus,
                updateDateitems: updateDateitems
            }
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
module.exports = {
    getAllresponseController,
    postResponsecontrroller
};