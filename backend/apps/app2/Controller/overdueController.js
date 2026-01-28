const followUpService = require('../Service/follow');
const overdueService = require('../Service/overdue');
const requestService = require('../Service/request');
const postFollowFormController = async (req, res) => {
    const payload = req.body;
    const {user_id, email, position} = req.user[0];

    try {
        const result = await followUpService.postFollowForm(payload, user_id);
        const resultRequest_no = result[0].request_no;
        const request_status = 7 ; // Set the desired request status for follow-up
        const updateRequestStatus = await requestService.updateStatusrequest(resultRequest_no, request_status);
        res.status(200).json({
            success: true,
            msg: 'Request processed successfully',
            data: {
                followData: result,
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
};

const postOverdueController = async (req, res) => {
    const payload = req.body;
    const {user_id, email, position} = req.user[0];

    try {
        const result = await overdueService.postoverdueForm(payload, user_id);
        const resultRequest_no = result[0].request_no;
        const request_status = 8 ; // Set the desired request status for overdue
        const updateRequestStatus = await requestService.updateStatusrequest(resultRequest_no, request_status);
        res.status(200).json({
            success: true,
            msg: 'Request processed successfully',
            data: {
                overdueData: result,
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
};

module.exports = {
    postFollowFormController,
    postOverdueController
}