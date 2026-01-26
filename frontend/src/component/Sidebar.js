import React, { memo, useMemo } from 'react';
import {
  HomeOutlined,
  ExceptionOutlined,
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hook/useAuthContext';

const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapse }) => {
  const { user } = useAuthContext();
  const location = useLocation();

  const { pathname } = location;
  const pathSegments = pathname.split('/').filter(Boolean);

  const firstSegment = pathSegments[0] ?? null;
  const lastSegment = pathSegments[pathSegments.length - 1];

  const userInfo = user?.data?.[0];

  const items = useMemo(() => {
    const baseItems = [
      {
        key: 'user-management',
        icon: <HomeOutlined />,
        label: <Link to="/user">User Management</Link>,
      },
      {
        key: 'Other-System',
        icon: <HomeOutlined />,
        label: <Link to="/homePage">Other System</Link>,
      },
    ];
  
    const existItems =
      firstSegment === 'exist'
        ? [
            {
              key: 'exist-home',
              icon: <HomeOutlined />,
              label: <Link to="/exist/home">Home</Link>,
            },
            {
              key: 'request-form',
              icon: <ExceptionOutlined />,
              label: <Link to="/exist/drawingrequest">Request Form</Link>,

              
            },
            {
              key: 'response-form',
              icon: <ExceptionOutlined />,
              label: <Link to="/exist/drawingresponse">Response Form</Link>,
              
            },
          ]
        : [];
  
    const newItems =
      firstSegment === 'new'
        ? [
            {
              key: 'new-home',
              icon: <HomeOutlined />,
              label: <Link to="/home">Home</Link>,
            },
            {
              key: 'request-form',
              icon: <ExceptionOutlined />,
            //   label: 'Request Form',
              label: <Link to="/new/drawingrequest">Request Form</Link>,
            },
            {
              key: 'resopnse-form',
              icon: <ExceptionOutlined />,
            //   label: 'Response Form',
              label: <Link to="/new/drawingresponse">Response Form</Link>,
            },
            // {
            //   key: 'process-form',
            //   icon: <ExceptionOutlined />,
            //   label: 'Process Form',
            // },
            // {
            //   key: 'Approve-form',
            //   icon: <ExceptionOutlined />,
            //   label: <Link to="/new/drawingapprove">Approve Form</Link>,

            // //   label: 'Approve Form',
            // },
            {
              key: 'Sender-form',
              icon: <ExceptionOutlined />,
              label: <Link to="/new/drawingsender">Sender Form</Link>,
            },
          ]
        : [];
  
    // ✅ base always visible + contextual items
    return [ ...existItems, ...newItems, ...baseItems];
  }, [firstSegment]);
  
  
  // 🔐 Early return AFTER hooks (✅ safe)
  if (!user) return null;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={200}
      style={{
        background: 'linear-gradient(180deg, #001529 0%, #0a3d62 100%)',
        boxShadow: '2px 0 6px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* 🔷 Logo / User Info */}
      <div
        style={{
          padding: '16px',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <div style={{ fontWeight: 600 }}>
          {collapsed ? 'Compact' : 'Compact Brake'}
        </div>

        {!collapsed && (
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            <p>({userInfo?.role_option_name ?? ''})</p>
            <p>({userInfo?.username ?? ''})</p>
            <p>({userInfo?.email ?? ''})</p>
          </div>
        )}
      </div>

      {/* 📌 Menu */}
      <Menu
        theme="dark"
        mode="inline"
        items={items}
        selectedKeys={[lastSegment]}
        defaultOpenKeys={['request-form']}
      />
    </Sider>
  );
};

export default memo(Sidebar);
