
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  message
} from 'antd';
import {
  PlusOutlined,
  CloseOutlined
} from '@ant-design/icons';

import { postdrawingSender } from '../../../๊Ultility/new/senderApi';

export default function SenderModal({
  open,
  request_no,
  onClose,
  onSuccess
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  /* ------------------ Reset when open ------------------ */
  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        pathItems: [{ path: '' }]
      });
    }
  }, [open, form]);

  /* ------------------ Submit ------------------ */
  const handleSubmit = async (values) => {
    const payload = {
      request_no,
      pathItems: values.pathItems
    };

    try {
      setLoading(true);
        //   console.log('Submitting:', payload);

      const result = await postdrawingSender(payload);

      message.success(result?.msg);
      onClose();
      onSuccess?.();
    } catch (err) {
      message.error(err?.msg || 'Submit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Sender Form : ${request_no}`}
      open={open}
      onCancel={onClose}   // ✅ modal X works
      footer={null}
      destroyOnClose
      width={900}
      closable              // ✅ explicit close button
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* ---------------- Request No ---------------- */}
        <Form.Item label="Request No">
          <Input value={request_no} disabled />
        </Form.Item>

        {/* ---------------- Path Items ---------------- */}
        <Form.Item label="Paths">
          <Form.List name="pathItems">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      gap: 8,
                      marginBottom: 8
                    }}
                  >
                    {/* index */}
                    <div style={{ width: 28, fontWeight: 600 }}>
                      {index + 1}.
                    </div>

                    {/* FULL WIDTH INPUT */}
                    <Form.Item
                      {...restField}
                      name={[name, 'path']}
                      rules={[
                        { required: true, message: 'Please input path' }
                      ]}
                      style={{
                        flex: 1,
                        marginBottom: 0
                      }}
                    >
                      <Input placeholder="Enter path" />
                    </Form.Item>

                    {/* remove X */}
                    {fields.length > 1 && (
                      <CloseOutlined
                        onClick={() => remove(name)}
                        style={{
                          color: '#ff4d4f',
                          fontSize: 16,
                          cursor: 'pointer'
                        }}
                      />
                    )}
                  </div>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add({ path: '' })}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Path
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>

        {/* ---------------- Submit ---------------- */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
