import React, { useState } from 'react';
import { Modal, Form, Input, Checkbox, Button, message } from 'antd';
import { Usefetch } from '../../๊Ultility/new/Usefetch'
import { postUserapi } from '../../๊Ultility/userApi';

const UserModal = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const {data, loading: loadingRole, error} = Usefetch('/user/roleitems')
  const roleOptions = (data || []).map(item =>({
    id: item.role_option_id,
    role_item: item.role_option_name
  }))
  const handleSubmit = async (values) => {
    const payload = {
      email: values.email,
      username: values.username,
      password: values.password,
      position: values.position,
      roleItems: values.roleItems.map((id) => {
        const role = roleOptions.find(r => r.id === id);
        return {
          role_id: role.id,
          role_item: role.role_item
        };
      })
    };

    try {
      setLoading(true);
      console.log('/api/users', payload);
        const result = await postUserapi(payload)
      message.success(result.msg);
      form.resetFields();
      onSuccess(); // close modal
    } catch (error) {
      message.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create User"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Position"
          name="position"
          rules={[{ required: true }]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="Roles"
          name="roleItems"
          rules={[{ required: true, message: 'Please select at least one role' }]}
        >
          <Checkbox.Group>
            {roleOptions.map(role => (
              <Checkbox key={role.id} value={role.id}>
                {role.role_item}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading || loadingRole}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
