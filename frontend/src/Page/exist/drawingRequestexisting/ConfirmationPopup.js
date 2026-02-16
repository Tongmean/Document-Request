// ConfirmationPopup.jsx
import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
// import { postdrawingFollowup } from '../../../๊Ultility/new/overdueApi';
import {Requestapprove} from '../../../๊Ultility/exist/drawingResponse';
const ConfirmationPopup = ({ 
  open, 
  onClose, 
  requestNo, 
  onSubmitSuccess 
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!requestNo) {
      message.error('Request number is required');
      return;
    }

    setLoading(true);
    
    try {
        const result  = await Requestapprove({request_no: requestNo});
        // console.log('Submitting request number:', requestNo);
      
        message.success(result.msg || 'Submitted successfully');
            //   onSubmitSuccess?.(data); // Call parent callback if provided
        onClose(); // Close modal
        onSubmitSuccess()
    } catch (error) {
      console.error('Submission error:', error);
      message.error(error.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <span>
          <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
          Confirm Submission
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Yes, Submit
        </Button>,
      ]}
      width={400}
    >
      <div style={{ padding: '20px 0' }}>
        <p>Are you sure you want to Alert to Approve Confirm?</p>
        <p><strong>Request No:</strong> {requestNo}</p>
      </div>
    </Modal>
  );
};

export default ConfirmationPopup;