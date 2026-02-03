import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Checkbox, Spin, Alert } from 'antd';
import { getUserbyuser_id } from '../../๊Ultility/userApi';

const UserViewModal = ({ open, onCancel, userId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const fetchUserDetail = async () => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear previous errors
      
      const res = await getUserbyuser_id({ user_id: userId });
    //   console.log('Fetched user data:', res.data);
      
      // Validate response structure
      if (!res || !res.data) {
        throw new Error('Invalid response from server');
      }
      
      const userObj = Array.isArray(res.data.user) ? res.data.user[0] : res.data.user;
      if (!userObj) {
        throw new Error('User data not found');
      }
      
      setUserData(res.data);
      
      // Handle user as array (take first item) or object
      
    //   console.log('User object:', userObj);
    //   console.log('Role items:', res.data.roleItems);
      
      // Set form values immediately after setting userData
      const formValues = {
        email: userObj?.email || '',
        username: userObj?.username || '',
        position: userObj?.position || '',
        roleItems: res.data.roleItems?.map(r => r.role_option_name) || [],
      };
      
    //   console.log('Setting form values:', formValues);
      form.setFieldsValue(formValues);
      
    } catch (err) {
      console.error('Fetch user failed:', err);
      setError(err.message || 'Failed to load user data. Please try again.');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when modal opens
  useEffect(() => {
    if (open && userId) {
      fetchUserDetail();
    }
    
    // Reset when modal closes
    if (!open) {
      setUserData(null);
      setError(null);
      form.resetFields();
    }
  }, [open, userId]);

  // Generate role options safely
  const roleOptions = React.useMemo(() => {
    if (!userData?.roleItems || userData.roleItems.length === 0) {
      return [];
    }
    return userData.roleItems.map(role => ({
      label: role.role_option_name,
      value: role.role_option_name,
    }));
  }, [userData]);

  return (
    <Modal
      title="User Detail"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Spin spinning={loading}>
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        
        {!error && userData && (Array.isArray(userData.user) ? userData.user[0] : userData.user) ? (
          <Form
            form={form}
            layout="vertical"
            preserve={false}
          >
            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Username" name="username">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Position" name="position">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Roles" name="roleItems">
              <Checkbox.Group
                disabled
                options={roleOptions}
              />
            </Form.Item>
          </Form>
        ) : (
          !loading && !error && <div>No data available</div>
        )}
      </Spin>
    </Modal>
  );
};

export default UserViewModal;