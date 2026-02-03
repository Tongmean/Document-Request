// UpdateUserModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Checkbox, message, Spin } from 'antd';
import axios from 'axios';
import { getUserbyuser_id, updatedUserapi} from '../../๊Ultility/userApi';
import { Usefetch } from '../../๊Ultility/new/Usefetch'

const UpdateUserModal = ({ visible, onClose, onSuccess, userId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [UserItem, setUseritem] = useState([]);
//   const [availableRoles, setAvailableRoles] = useState([]);
  const {data, loading: loadingRole, error} = Usefetch('/user/roleitems')
  const Roleopstions = (data || []).map(item =>({
    id: item.role_option_id,
    label: item.role_option_name
  }))
  // Fetch user data and available roles when modal opens
  useEffect(() => {
    if (visible && userId) {
      fetchUserData();
    }
  }, [visible, userId]);

  // Fetch user data from database
  const fetchUserData = async () => {
    setFetching(true);
    try {
      const response = await getUserbyuser_id({ user_id: userId });
      const userData = response.data;
      setUseritem(userData.roleItems)
      console.log('Fetched user data for update:', userData);
      const availableRoles = (userData.roleItems || []).map(item =>({
        role_item: item.role_option_id,
        role_name: item.role_option_name,
        role_option_id: item.role_option_id,
        role_id: item.role_id
      }))
      // Extract role_item values from roleItems array
    const roleItemValues = availableRoles?.map(item => ({
        role_id: item.role_id,
        role_item: item.role_item,
    })) || [];

      console.log('Role item values for form:', roleItemValues);
      // Set form values
      form.setFieldsValue({
        email: userData.user[0].email,
        username: userData.user[0].username,
        position: userData.user[0].position,
        password: '', // Leave password empty for update
        role_items: roleItemValues, // Array of integers for checkboxes
      });
    } catch (error) {
      message.error('Failed to fetch user data');
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Transform role_items array into roleItems format
      const roleItems = values.role_items.map(role_item => ({
        role_id: UserItem.role_id,
        role_item: role_item,
      }));
   

      const requestBody = {
        user_id: userId,
        email: values.email,
        username: values.username,
        password: values.password || undefined, // Only include if provided
        position: values.position,
        roleItems: roleItems,
      };
      console.log('Update request body:', requestBody);
      await updatedUserapi(requestBody);
    //   await axios.post(`/api/users/${userId}`, requestBody);
      
      message.success('User updated successfully');
      form.resetFields();
      onSuccess();
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || 'Failed to update user');
      } else if (error.errorFields) {
        message.error('Please check the form fields');
      } else {
        message.error('Failed to update user');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle modal cancel
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Update User"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Spin spinning={fetching}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please input valid email!' },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input username!' }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            extra="Leave blank to keep current password"
          >
            <Input.Password placeholder="Enter new password (optional)" />
          </Form.Item>

          <Form.Item
            label="Position"
            name="position"
            rules={[{ required: true, message: 'Please input position!' }]}
          >
            <Input placeholder="Enter position" />
          </Form.Item>

          <Form.Item
            label="Roles"
            name="role_items"
            rules={[{ required: true, message: 'Please select at least one role!' }]}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Roleopstions.map((role) => (
                  <Checkbox key={role.id} value={role.id}>
                    {role.label}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default UpdateUserModal;