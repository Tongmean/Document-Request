import { Usefetch } from '../../๊Ultility/new/Usefetch'
import React, {useEffect, useState } from 'react';
import { Spin, Button, Input } from 'antd';
import Tablecomponent from './../../component/Talecomponent';
import UserModal from './UserModal';
import UserViewModal from './UserViewModal';
import UpdateUserModal from './UpdatedUserModal';
const User = () =>{
    const [open, setOpen] = useState(false);
    const [openUserview, setOpenuserView] = useState(false);
    const [openUserupdated, setOpenuserUpdated] = useState(false);
    const [sellectedUserId, setSellectedUserId] = useState(null);
    const {data, loading, error, refetch} = Usefetch('/user')
    const [quickFilter, setQuickFilter] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    // console.log('data, loading, error}',data, loading, error)
    const columnDefs = [
        { headerName: 'No', field: 'user_id', checkboxSelection: true, headerCheckboxSelection: true, cellDataType: 'number', width: 30 },
        { headerName: 'email', field: 'email'},
        { headerName: 'Username', field: 'username'},
        { headerName: 'password', field: 'password'},
        { headerName: 'position', field: 'position'},
        {
            headerName: 'Created Date',
            field: 'created_at',
            valueFormatter: (params) => {
                if (!params.value) return '';
            
                const date = new Date(params.value);
            
                return date.toLocaleString('en-GB', {
                    timeZone: 'Asia/Bangkok', // UTC+7
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });
                }
        },
        { headerName: 'Created BY', field: 'created_by'},
        {
        headerName: 'Actions',
        field: 'actions',
        pinned: 'right',
        width: 250,
        cellRenderer: (params) => {
            return (
                <div>
                    <Button className="btn btn-warning btn-sm" style={{ marginRight: 5 }}
                        // onClick={() => handleOpen(params.data.id)}
                        onClick={() => {
                            setSellectedUserId(params.data.user_id);
                            setOpenuserView(true);
                        }}
                    >
                        
                        D
                    </Button>
                    <Button className="btn btn-danger btn-sm" style={{ marginRight: 5 }}
                        // onClick={() => handleOpen(params.data.id)}
                        onClick={() => {
                            setSellectedUserId(params.data.user_id);
                            setOpenuserUpdated(true);
                            setModalVisible(true);
                            console.log('params.data.user_id', params.data.user_id);
                        }}
                    >
                        
                        Edit
                    </Button>
                </div>
            );
            }
            
        }
    ]
    return(
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                }}
                >
                <Button type="primary" onClick={() => setOpen(true)}>
                    Create User
                </Button>

                <Input
                    placeholder="Search all..."
                    allowClear
                    value={quickFilter}
                    onChange={(e) => setQuickFilter(e.target.value)}
                    style={{ width: 250 }}
                />
            </div>


            {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
            ) : error ? (
                <div style={{ color: 'red' }}>{`Error: ${error}`}</div>
            ) : (
                <Tablecomponent
                    columnDefs={columnDefs}
                    rowData={data}
                    quickFilterText={quickFilter}
                />
            )}
            <UserModal
                open={open}
                onCancel={() => setOpen(false)}
                onSuccess={() => {
                    setOpen(false);
                    refetch()
                }}
            />
            <UserViewModal
                open={openUserview}
                onCancel={() => setOpenuserView(false)}
                onSuccess={() => {
                    setOpenuserView(false);
                    refetch()
                }}
                userId = {sellectedUserId}
            />
            <UpdateUserModal
                // open={openUserupdated}
                userId={sellectedUserId}
                onClose={() => {
                    setOpenuserUpdated(false)
                    setSellectedUserId(null)
                    setModalVisible(false);
                }}
                onSuccess={() => {
                    setOpenuserUpdated(false);
                    refetch()
                    setModalVisible(false);
                }}
                visible={modalVisible}
            />
        </>
    )
}

export default User;