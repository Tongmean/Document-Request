import { Usefetch } from '../../๊Ultility/new/Usefetch'
import React, {useEffect, useState } from 'react';
import { Spin, Button, Input } from 'antd';
import Tablecomponent from './../../component/Talecomponent';
import UserModal from './UserModal';
const User = () =>{
    const [open, setOpen] = useState(false);
    const {data, loading, error, refetch} = Usefetch('/user')
    const [quickFilter, setQuickFilter] = useState('');

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
        // { headerName: 'Remark', field: 'request_remark'},
        // { headerName: 'Status', field: 'status_name'},
        // { headerName: 'Request BY', field: 'username'},
        // {
        // headerName: 'Actions',
        // field: 'actions',
        // pinned: 'right',
        // width: 250,
        // cellRenderer: (params) => {
            

        //     return (
        //         <div>
        //         <Button className="btn btn-warning btn-sm" style={{ marginRight: 5 }}
        //             // onClick={() => handleOpen(params.data.id)}
        //         >
                    
        //             D
        //         </Button>
            
                
            
        //         </div>
        //     );
        //     }
            
        // }
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
                    // onGridReady={onGridReady}
                    // onSelectionChanged={onSelectionChanged}
                    // // getRowClass={getRowClass}
                    // getRowId={(params) => params.data.No.toString()} // 👈 important
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
        </>
    )
}

export default User;