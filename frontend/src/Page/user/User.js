import { Usefetch } from '../../๊Ultility/new/Usefetch'
import React, {useEffect, useState } from 'react';
import { Spin, Button } from 'antd';
import Tablecomponent from './../../component/Talecomponent';
const User = () =>{
    const {data, loading, error} = Usefetch('/user')
    const [rowData, setRowData] = useState([]);
    const columnDefs = [
        { headerName: 'No', field: 'user_id', checkboxSelection: true, headerCheckboxSelection: true, cellDataType: 'number', width: 30 },
        { headerName: 'email', field: 'email'},
        
        { headerName: 'password', field: 'password'},
        { headerName: 'position', field: 'position'},
        { headerName: 'Username', field: 'customer_name'},
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
                />
            )}
        </>
    )
}

export default User;