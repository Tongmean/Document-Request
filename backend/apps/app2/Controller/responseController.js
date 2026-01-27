const responseService = require('../Service/response');
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
    const payload = req.body;
    try {
        const result = await responseService.postResponse(payload);
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
module.exports = {
    getAllresponseController,
    postResponsecontrroller
};