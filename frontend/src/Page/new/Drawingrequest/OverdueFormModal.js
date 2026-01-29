import React, { useState } from 'react';
import {
  Modal,
  Form,
  DatePicker,
  Checkbox,
  Input,
  Button,
  message,
  Spin
} from 'antd';
import dayjs from 'dayjs';

import { postdrawingOverdueform } from '../../../๊Ultility/new/overdueApi'; // Adjust import path

export default function OverdueFormModal({
  overdueOpen,
  request_no,
  onClose,
  onSuccess
}) {
  const [form] = Form.useForm();
  const [loadingpage, setLoading] = useState(false);

  /* ------------------ Submit ------------------ */
  const handleSubmit = async (values) => {
    const payload = {
      request_no,
      expected_date: values.expected_date
        ? values.expected_date.format('YYYY-MM-DD')
        : null,
      isneed: values.isneed || false,
      Overdue_remark: values.Overdue_remark || ''
    };

    try {
      setLoading(true);
      console.log('Submitting payload:', payload);
      const result = await postdrawingOverdueform(payload);
      message.success(result?.msg);
      form.resetFields();
      onClose();
      onSuccess();
    } catch (err) {
      message.error(err.msg || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (loadingpage) return <Spin />;

  return (
    <Modal
      title={`Overdue Form : ${request_no}`}
      open={overdueOpen}
      onCancel={onClose}
      footer={null}
      width={500}
      destroyOnClose
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          isneed: false
        }}
      >
        {/* ---------------- Expected Date ---------------- */}
        <Form.Item
          label="Expected Date"
          name="expected_date"
          rules={[{ required: true, message: 'Please select expected date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        {/* ---------------- Is Need (Checkbox) ---------------- */}
        <Form.Item name="isneed" valuePropName="checked">
          <Checkbox>Is Need</Checkbox>
        </Form.Item>

        {/* ---------------- Overdue Remark ---------------- */}
        <Form.Item
          label="Overdue Remark"
          name="Overdue_remark"
          rules={[{ required: true, message: 'Please enter overdue remark' }]}
        >
          <Input.TextArea rows={4} placeholder="Enter overdue remark..." />
        </Form.Item>

        {/* ---------------- Submit ---------------- */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loadingpage}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}