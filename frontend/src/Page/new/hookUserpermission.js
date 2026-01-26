// hook/usePermission.js
import { useAuthContext } from '../../hook/useAuthContext';

export const UsePermission = (requiredRole) => {
  const { user } = useAuthContext();

  if (!user || !Array.isArray(user.data)) return false;

  const roles = [
    ...new Set(
      user.data
        .map(r => r.role_option_name)
        .filter(role => role && role !== '-')
    )
  ];

  // superadmin always allowed
  if (roles.includes('superadmin')) return true;

  return roles.includes(requiredRole);
};

export const UseUserPermission = (requiredUserId) => {
    const { user } = useAuthContext();
    // console.log('user in UseUserPermission', requiredUserId);
    if (!user || !Array.isArray(user.data)) return false;
  
    const userId = user.data[0]?.email;
    // console.log('userId', userId);

    const roles = [
      ...new Set(
        user.data
          .map(r => r.role_option_name)
          .filter(role => role && role !== '-')
      )
    ];
  
    // superadmin bypass
    if (roles.includes('superadmin')) return true;
  
    // owner check
    return userId === requiredUserId;
};
