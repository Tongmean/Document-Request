import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hook/useAuthContext';
import { Alert } from 'antd';

const ProtectedroleRoute = ({ allowedRoles }) => {
    const { user } = useAuthContext(); // Get the current user from the AuthContext
    const [notification, setNotification] = useState(null); // State to manage notifications
    const navigate = useNavigate(); // For navigation control, in case you need to redirect

    useEffect(() => {
        // If no user exists, navigate to login
        console.log('ProtectedRoute user', user.data[0].role_option_name)
        if (!user) {
            navigate('/login');
            return;
        }
        // Bypass all checks for the 'superadmin' role
        if (user.data[0].role_option_name === 'superadmin') {
            setNotification(null); // Clear any existing notifications
            return; // Exit the useEffect early since superadmin has full access
        }

        const userPermissions = [
            user.data[0].role_option_name
            
        ].filter(permission => permission && permission !== '-'); // Filter out invalid permissions

        const hasValidRole = allowedRoles?.includes(user.data[0].role_option_name);
        console.log('hasValidPermission', hasValidPermission)
        console.log('hasValidRole', hasValidRole)
        console.log('User Role:', user.data.role);
        console.log('User Permissions:', userPermissions);
        console.log('Allowed Roles:', allowedRoles);
        console.log('Allowed Permissions:', allowedPermissions);

        // If the user role and permissions do not match, show notification
        if (!hasValidRole) {
            // setNotification({
            //     message: 'Access Denied: กรุณาติดต่อ admin เพื่อตำเนินการ.',
            //     type: 'warning',
            // });
            <Alert
                title="Permission Authorization"   
                description="Access Denied: กรุณาติดต่อ admin เพื่อตำเนินการ.."
                type="info"
                showIcon
            />
        } else {
            setNotification(null); // Clear notification if access is granted
        }

        
    }, [user, allowedRoles, navigate]);

    // Function to close the notification and navigate back
    const handleNotificationClose = () => {
        setNotification(null);
        navigate(-1); // Navigate back one step in the history
    };

    // Prevent rendering child routes if notification exists (indicating denied access)
    if (notification) {
        return (
            <>
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={handleNotificationClose}
                />
            </>
        );
    }

    // Render the child routes (protected content) if access is granted
    return <Outlet />;
};

export default ProtectedroleRoute;
