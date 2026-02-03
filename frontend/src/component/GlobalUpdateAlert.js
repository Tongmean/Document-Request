// GlobalUpdateAlert.jsx
import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/SocketContext';
import { Button, notification, Space } from 'antd';
import { useAuthContext } from '../hook/useAuthContext';
import { convertToUTCPlus7 } from '../๊Ultility/Moment-timezone';
import {
    InfoCircleOutlined,
    CheckCircleOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    ReloadOutlined,
} from '@ant-design/icons';

const GlobalUpdateAlert = () => {
    const { lastEvent } = useContext(SocketContext);
    const [seen, setSeen] = useState(null);
    const [api, contextHolder] = notification.useNotification();
    const { user } = useAuthContext();
    const [notificationCount, setNotificationCount] = useState(1);

    // mapping route names
    const routeLabels = {
        new: 'ขอจัดทำ Drawing',
        exit: 'ขอใช้ Drawing ที่มีอยู่',
    };

    // icons by event type
    const icons = {
        post: <CheckCircleOutlined style={{ color: '#52c41a' }} />, // green
        put: <EditOutlined style={{ color: '#1890ff' }} />, // blue
        delete: <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />, // orange
        default: <InfoCircleOutlined style={{ color: '#1677ff' }} />,
    };

    useEffect(() => {
        // console.log('GlobalUpdateAlert lastEvent:', lastEvent);
        if (lastEvent && lastEvent !== seen) {
            const { type, route, userEmail, time } = lastEvent;
            const rawData = lastEvent.data; 
            const normalizedData =
                type === "post" && Array.isArray(rawData) ? rawData[0] : rawData;

            const data = normalizedData; // ✅ always one object now
            // console.log('lastEvent',lastEvent, "normalizedData", data)

            const action =
                type === 'post'
                    ? 'สร้างใหม่'
                    : type === 'put'
                    ? 'อัปเดต'
                    : 'เปลี่ยนแปลง';

            // ✅ define identifier outside condition
            let identifier = '[ไม่ทราบ ID]';
            if (route === 'new') {
                identifier = `เลขทีขอ : ${data?.request_no}` || '[]';
            } else if (route === 'exist') {
                identifier = `$เลขทีขอ : ${data?.request_no}` || '[]';
            }

            // const identifier = data?.id || '[ไม่ทราบ ID]';
            const routeName = routeLabels[route] || route;
            const key = `open${Date.now()}`;
            if(user?.data[0].email && user.data[0].email !== userEmail){
                api.open({
                    message: (
                        <span style={{ fontWeight: 600, fontSize: 16 }}>
                            {icons[type] || icons.default} มีการ{action} ข้อมูล{' '}
                            <span style={{ color: '#1677ff' }}>({routeName})</span>
                        </span>
                    ),
                    description: (
                        <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                            <p>
                                (เลขทีขอ):{' '}
                                <b style={{ color: '#d4380d' ,marginLeft: 4}}>{identifier}</b>
                            </p>
                            <p style={{ marginTop: 4, color: '#595959' }}>
                                สถานะการตรวจสอบ:
                                <b style={{ color: '#d4380d' }}>: {data?.request_status ?? ""}</b>
                            </p>
                            <p style={{ marginTop: 4, color: '#595959' }}>
                                โดย
                                <b style={{ color: '#1677ff' }}>: {userEmail}</b>
                            </p>
                            <p style={{ marginTop: 4, color: '#595959' }}>
                                เมื่อ
                                <b style={{ color: '#1677ff' }}>: {convertToUTCPlus7(time)}</b>
                            </p>
                            <p style={{ marginTop: 4, color: '#595959' }}>
                                กรุณา <b>Refresh</b> เพื่อให้ได้ข้อมูลล่าสุด
                            </p>
                        </div>
                    ),
                    btn: (
                        <Space>
                            <Button
                                type="default"
                                size="middle"
                                icon={<ReloadOutlined />}
                                style={{
                                    backgroundColor: '#faad14',
                                    color: '#fff',
                                    borderRadius: 6,
                                    fontWeight: 500,
                                }}
                                onClick={() => window.location.reload()}
                            >
                                Refresh
                            </Button>
                            <Button
                                type="primary"
                                size="middle"
                                style={{ borderRadius: 6, fontWeight: 500 }}
                                onClick={() => {
                                    api.destroy(key);                  // close this notification
                                    setNotificationCount((prev) => 
                                        prev > 0 ? prev - 1 : 0        // decrease count (but not below 0)
                                    );
                                }}
                            >
                                รับทราบ 👍
                            </Button>
                            🔔 Notifications: {notificationCount}
                        </Space>
                    ),
                    key,
                    duration: 0, // stays until acknowledged
                    style: {
                        borderRadius: 10,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        padding: '12px 16px',
                    },
                });
    
                setSeen(lastEvent); // prevent repeat alerts
                setNotificationCount((prev) => prev + 1); // ✅ increase count

            }

        }
    }, [lastEvent]);

    // return <>{contextHolder}</>;
    return (
        <>
            {/* {contextHolder} */}
            {/* <div style={{ position: 'fixed', overflow: 'visible' , top: 10, center: 10, background: '#fff', padding: 8, borderRadius: 6 , marginTop: 30}}>
                🔔 Notifications: {notificationCount}
            </div> */}
        </>
    );
};

export default GlobalUpdateAlert;
