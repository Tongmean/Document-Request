const approveService = require('../Service/approve');
const approveController = async (req, res) => {
    try {
        const result = await approveService.getAllapprove();
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
    approveController
};