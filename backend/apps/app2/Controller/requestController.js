const requestService = require('../Service/request');
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

module.exports = {
    requestController
};