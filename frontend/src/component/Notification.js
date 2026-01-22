// import React from 'react';

// const Notification = ({ message, type, onClose }) => {
//     console.log('message',message)
//     console.log('type',type)
//     const getNotificationStyles = () => {
//         switch (type) {
//             case 'success':
//                 return {
//                     backgroundColor: 'green',
//                     color: 'white',
//                 };
//             case 'fail':
//                 return {
//                     backgroundColor: 'red',
//                     color: 'white',
//                 };
//             case 'warning':
//                 return {
//                     backgroundColor: 'orange',
//                     color: 'white',
//                 };
//             default:
//                 return {};
//         }
//     };

//     return (
//         <div
//             style={{
//                 ...getNotificationStyles(),
//                 padding: '10px',
//                 borderRadius: '5px',
//                 position: 'fixed', // Changed from 'absolute' to 'fixed' for better floating behavior
//                 top: '10px',
//                 right: '10px',
//                 zIndex: 9999,
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 boxSizing: 'border-box', // Ensures padding is considered in width
//                 width: '300px', // FIXED HERE
//             }}
//         >
//             <span>{message}</span>
//             <button
//                 onClick={onClose}
//                 style={{
//                     background: 'none',
//                     border: 'none',
//                     color: 'white',
//                     fontSize: '16px',
//                     cursor: 'pointer',
//                 }}
//             >
//                 &#10005;
//             </button>
//         </div>
//     );
// };

// export default Notification;
import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose, duration = 3000 }) => {
  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: 'green', color: 'white' };
      case 'fail':
        return { backgroundColor: 'red', color: 'white' };
      case 'warning':
        return { backgroundColor: 'orange', color: 'white' };
      default:
        return {};
    }
  };

  // Auto close after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    // Cleanup to avoid memory leaks
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      style={{
        ...getNotificationStyles(),
        padding: '10px',
        borderRadius: '5px',
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '300px',
      }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        &#10005;
      </button>
    </div>
  );
};

export default Notification;
