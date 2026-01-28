const processService = require('../Service/process');
const requestService = require('../Service/request');

const postProcessform = async (req, res) => {
    const payload = req.body;
    console.log("Payload received in postProcessform:", payload);
    const request_status = 3 ; // Set the desired request status for overdue
    const {user_id, email, position} = req.user[0];
    try {
        const result = await processService.postprocessForm(payload, user_id, request_status);
        const updateRequestStatus = await requestService.updateStatusrequest(payload.request_no, request_status);
        res.status(200).json({
            success: true,
            msg: 'Process started successfully',
            data: {
                processData: result,
                updateRequestStatus: updateRequestStatus
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        msg: 'An error occurred while starting the process',
        error: error.message
        });
    }
 }

 module.exports = {
    postProcessform
 }