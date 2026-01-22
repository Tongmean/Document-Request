import React, { useEffect } from 'react'
import { Layout, Button, Space } from 'antd'
import { LogoutOutlined, ReloadOutlined } from '@ant-design/icons'
import { useAuthContext } from '../hook/useAuthContext'
import { useLogout } from '../hook/useLogout'
import { useNavigate, useLocation } from 'react-router-dom'

const { Header } = Layout

const HeaderComponent = () => {
  const { user } = useAuthContext()
//   const navigate = useNavigate()
//   const location = useLocation()
//   const isAuthenticated = user && user.token
  const { logout } = useLogout()

  const onLogout = () => logout()
  const onRefresh = () => window.location.reload()

//   useEffect(() => {
//   const allowedPaths = ['/', '/apimonitor']
    // const currentPath = window.location.pathname
    // const firstSegment =
    // currentPath.split('/').filter(Boolean)[0] || null;
    // console.log(firstSegment);

    // console.log('currentPath', currentPath)

//     if (!isAuthenticated && !allowedPaths.includes(currentPath)) {
//       navigate('/login')
//     }
//   }, [isAuthenticated, navigate])

  if (!user) return null

  return (
    <Header
      style={{
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        justifyContent: 'flex-end', // ✅ RIGHT ALIGN
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        zIndex: 10,
      }}
    >
      <Space>
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          Refresh
        </Button>
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={onLogout}
        >
          Logout
        </Button>
      </Space>
    </Header>
  )
}

export default HeaderComponent
