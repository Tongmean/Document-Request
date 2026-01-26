const senderService = require('../Service/sender');
const getAllsenderController = async (req, res) => {
    try {
        const result = await senderService.getAllsender();
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
    getAllsenderController
};