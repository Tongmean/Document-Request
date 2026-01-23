import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const [systems] = useState([
    {
      id: 1,
      name: 'ใบขอ Drawing เพื่อใช้งาน',
      description: 'การขอใช้ File Drawing ต่าง ๆ ที่มีอยู่แล้ว เพื่อใช้งาน.',
      icon: '👥',
      status: 'Active',
      path: '/exist/drawingrequest'
    },
    {
      id: 2,
      name: 'ขอจัดทำ Drawing',
      description: 'การขอใช้ File Drawing ใหม่ที่ยังไม่มี.',
      icon: '📦',
      status: 'Active',
      path: '/new/drawingrequest'
    },
    {
      id: 3,
      name: 'Human Resources Portal',
      description: 'Employee management, payroll, attendance, and HR workflows.',
      icon: '🏢',
      status: 'Active',
      path: '/hr'   // 🔹 replaced '#hr'
    },
    {
      id: 4,
      name: 'Financial Management',
      description: 'Handle accounting, invoicing, expenses, and financial reporting.',
      icon: '💰',
      status: 'Active',
      path: '/finance'
    },
    {
      id: 5,
      name: 'Project Management',
      description: 'Plan, execute, and monitor projects with team collaboration tools.',
      icon: '📊',
      status: 'Active',
      path: '/projects'
    },
    {
      id: 6,
      name: 'Analytics Dashboard',
      description: 'Business intelligence and data visualization for informed decisions.',
      icon: '📈',
      status: 'Maintenance',
      path: '/analytics'
    }
  ]);

  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-vh-100 bg-light">
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      {/* Header */}
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            Drawing Request Systems Portal
          </span>
          <span className="text-white">Welcome, User</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col">
            <h2 className="fw-bold">Available Systems</h2>
            <p className="text-muted">
              Select a system to access its features and functionalities
            </p>
          </div>
        </div>

        {/* Systems Grid */}
        <div className="row g-4">
          {systems.map(system => (
            <div key={system.id} className="col-md-6 col-lg-4">
              <div
                className="card h-100 shadow-sm border-0"
                style={{
                  cursor: 'pointer',
                  transform:
                    hoveredCard === system.id
                      ? 'translateY(-5px)'
                      : 'translateY(0)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={() => setHoveredCard(system.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-start mb-3">
                    <div className="fs-1 me-3">{system.icon}</div>
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1">{system.name}</h5>
                      <span
                        className={`badge ${
                          system.status === 'Active'
                            ? 'bg-success'
                            : 'bg-warning'
                        }`}
                      >
                        {system.status}
                      </span>
                    </div>
                  </div>

                  <p className="card-text text-muted flex-grow-1">
                    {system.description}
                  </p>

                  {/* ✅ Navigate instead of anchor */}
                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => navigate(system.path)}
                  >
                    Access System →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-3 mt-5">
        <div className="container text-center">
          <p className="mb-0">
            © {new Date().getFullYear()} Compact Drawing Request Systems Portal.
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
