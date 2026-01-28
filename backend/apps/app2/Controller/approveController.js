const approveService = require('../Service/approve');
const requestService = require('../Service/request');
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

const postApprovecontroller = async (req, res) => {
    const payload = req.body;
    const request_status = 4 ; // Set the desired request status for overdue
    const {user_id, email, position} = req.user[0];
    try {
        const result = await approveService.postapproveForm(payload, user_id, request_status);
        const updateRequestStatus = await requestService.updateStatusrequest(payload.request_no, request_status);
        res.status(200).json({
            success: true,
            msg: 'Request Approve successfully',
            data: {
                approveData: result,
                updateRequestStatus: updateRequestStatus
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
    approveController,
    postApprovecontroller
};