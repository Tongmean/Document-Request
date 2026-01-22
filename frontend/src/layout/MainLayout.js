// layout/MainLayout.jsx
import { Layout } from 'antd'
import Sidebar from '../component/Sidebar'
import HeaderComponent from '../component/Header'
import FooterComponent from '../component/Footer'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'

const { Content } = Layout

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      />

      {/* Right side layout */}
      <Layout>
        {/* Header */}
        <HeaderComponent />

        {/* Main Content */}
        <Content
          style={{
            margin: '16px',
            padding: '16px',
            background: '#fff',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>

        {/* Footer */}
        <FooterComponent />
      </Layout>
    </Layout>
  )
}
