import React from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';

export default function ResponseFormModal({ open, requestId, request_no, onClose }) {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const payload = {
      request_no: request_no,                  // ✅ key from parent
      assign_to_proccessor: values.processor,
      assign_to_approver: values.approver,
      response_status: values.response_status,
      response_by: values.response_by,
      response_at: new Date(),                  // or backend handle
    };

    try {
      await axios.post('/api/response-form', payload);
      message.success('Response submitted');
      form.resetFields();
      onClose();
    } catch (err) {
      message.error('Submit failed');
    }
  };

  return (
    <Modal
      title={`Response Form : ${request_no}`}
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Assign to Processor"
          name="processor"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Assign to Approver"
          name="approver"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Response Status"
          name="response_status"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: 'Pending', label: 'Pending' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Rejected', label: 'Rejected' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Response By"
          name="response_by"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit Response
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
