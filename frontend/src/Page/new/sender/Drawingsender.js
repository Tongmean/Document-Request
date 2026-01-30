import React, {useEffect, useState } from 'react';
import { Spin, Button } from 'antd';
import Tablecomponent from './../../../component/Talecomponent';
import { fetchdrawingSender } from '../../../๊Ultility/new/senderApi';
import { useNavigate  } from 'react-router-dom';
import { UsePermission } from '../hookUserpermission';
import DrawingRequestModal from '../DrawingRequestModal';
import SenderModal from '../sender/SenderModal';
const DrawingsenderNew = () => {
    //Modal
    const [open, setOpen] = useState(false);
    const [senderOpen, setSenderopen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    // const approver = UsePermission('Approver');
    // const processor = UsePermission('Processor');
    const responsor = UsePermission('Responsor');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const columnDefs = [
      { headerName: 'No', field: 'id', checkboxSelection: true, headerCheckboxSelection: true, cellDataType: 'number', width: 50 },
      { headerName: 'Request No', field: 'request_no'},
      {
        headerName: 'Request Date',
        field: 'request_at',
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
      
      { headerName: 'Department', field: 'department'},
      { headerName: 'Part no', field: 'part_no'},
      { headerName: 'ระบุลูกค้า', field: 'customer_name'},
      { headerName: 'Detail', field: 'detail'},
      { headerName: 'Remark', field: 'request_remark'},
      { headerName: 'Status', field: 'status_name'},
      { headerName: 'Request BY', field: 'username'},
      {
        headerName: 'Actions',
        field: 'actions',
        pinned: 'right',
        width: 250,
        cellRenderer: (params) => {
            const canSendFile =
              ['Completed', 'Overdue', 'Cancelled'].includes(params.data.status_name)
            // console.log("canSendFile", canSendFile);
            // console.log("responseor", responsor);
            // console.log("params.data.status_name", params.data.status_name);
            const finalCheck = !(canSendFile) && responsor
            // console.log("finalCheck", finalCheck);

            return (
              <div>
                <Button className="btn btn-warning btn-sm" style={{ marginRight: 5 }}
                    onClick={() => handleOpen(params.data.id)}
                >
                    
                  D
                </Button>
          
                <Button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleShowprint(params.data)}
                  style={{ marginRight: 5 }}
                >
                  Print
                </Button>
          
                <Button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleOpensender(params.data.request_no)}

                  disabled={!finalCheck}
                  style={{ marginRight: 5 }}
                >
                  ส่ง File
                </Button>
              </div>
            );
          }
          
    }
  ]

  const load = async () =>{
    try {
      const data = (await fetchdrawingSender()).data;
    //   console.log(data, 'data print');
    //   console.log(data, 'data print requestData');
      setRowData(data);
    } catch (err) {
      setError('Failed to load request data.');
    } finally {
      setLoading(false);
    }
  }
  //Initial Fetch first open
  useEffect(() => {
    load();
  }, []);
  const handleShowprint = (data) => {
    navigate(`/new/drawingrequest/${data.id}`);
  };
  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };
  const handleOpensender = (request_no) => {
    setSelectedId(request_no);
    setSenderopen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
    setSenderopen(false);
  }
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        padding: '16px 20px',
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
            รายการการจัดส่ง File
          </h1>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>
            ติดตามสถานะคำขอ มอบหมายงาน และจัดการ Drawing
          </p>
        </div>

        {/* Optional actions */}
        <div>
          {/* example */}
          {/* <Button icon={<ReloadOutlined />} onClick={load}>Refresh</Button> */}
        </div>
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
            rowData={rowData}
            // onGridReady={onGridReady}
            // onSelectionChanged={onSelectionChanged}
            // // getRowClass={getRowClass}
            // getRowId={(params) => params.data.No.toString()} // 👈 important
        />
      )}
        <DrawingRequestModal
            open={open}
            requestId={selectedId}
            onClose={handleClose}
        />
        <SenderModal
          open={senderOpen}
          request_no={selectedId}
          onClose={handleClose}
          onSuccess={load}
        />

    </div>
    
  );
}


export default DrawingsenderNew;