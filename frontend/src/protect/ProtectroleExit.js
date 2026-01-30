import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuthContext } from '../hook/useAuthContext';
import Notification from '../component/Notification';

const ProtectedRoleRouteExit = ({ allowedRoles = [] }) => {
  const { user } = useAuthContext();
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  console.log('location', location)
  console.log('allowedRoles', allowedRoles)
  useEffect(() => {
    // 1. No user → redirect to login
    if (!user) {
      navigate('/login', { replace: true , state:{ from: location }});
      return;
      // <Navigate
      //   to="/login"
      //   replace
      //   // 🔴 THIS IS THE MOST IMPORTANT LINE
      //   state={{ from: location }}
      // />
    }
    // console.log('user in ProtectedRoleRouteExit',user.data)
    // 2. Normalize user roles (handle multiple roles safely)
    const userRoles = Array.isArray(user.data)
      ? [...new Set(
          user.data
            .map(item => item.role_option_name)
            .filter(role => role && role !== '-')
        )]
      : [];
    // console.log('userRoles',userRoles)
    // 3. Superadmin bypass
    if (userRoles.includes('superadmin')) {
      setNotification(null);
      return;
    }

    // 4. Check allowed roles
    const hasAccess = userRoles.some(role =>
      allowedRoles.includes(role)
    );

    // 5. Handle access result
    if (!hasAccess) {
      setNotification({
        message: 'Access Denied: กรุณาติดต่อ admin เพื่อตำเนินการ.',
        type: 'warning',
      });
    } else {
      setNotification(null);
    }

  }, [user, allowedRoles, navigate]);

  const handleNotificationClose = () => {
    setNotification(null);
    navigate(-1);
  };

  // Block rendering if access denied
  if (notification) {
    return (
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={handleNotificationClose}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoleRouteExit;
