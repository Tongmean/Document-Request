import React, {useEffect, useState } from 'react';
import { Spin, Button } from 'antd';
import Tablecomponent from './../../../component/Talecomponent';
import { fetchdrawingResponse } from '../../../๊Ultility/new/responseApi';
import { useNavigate  } from 'react-router-dom';
import { useAuthContext } from '../../../hook/useAuthContext';
import { UsePermission, UseUserPermission } from '../hookUserpermission';
import DrawingRequestModal from '../DrawingRequestModal';
import ConfirmationPopupapp from './ConfirmationPopupapp';
import ConfirmationPopuppro from './ConfirmationPopuppro';
import ConfirmationPopupcheck from './ConfirmationPopupcheck';
const DrawingresponseNew = () => {
    //Modal
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    // const { user } = useAuthContext();
    const approver = UsePermission('Approver');
    const processor = UsePermission('Processor');
    const responsor = UsePermission('Responsor');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    // Add these states with your other useState declarations
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmType, setConfirmType] = useState(null);
    // const [selectedRequestNo, setSelectedRequestNo] = useState(null);
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
        width: 300,
        cellRenderer: (params) => (
            <div>
                <Button
                    className='btn btn-warning btn-sm'
                    onClick={() => handleOpen(params.data.id)}

                    style={{ marginRight: '5px' }}
                >
                    D 
                </Button>
                <Button
                    className='btn btn-secondary btn-sm'
                    onClick={() => handleShowprint(params.data)}
                    style={{ marginRight: '5px' }}
                >
                    Print
                </Button>
                <Button
                  className="btn btn-success btn-sm"
                  onClick={() => openConfirmPopup('pro',params.data.request_no)}
                  disabled={!(params.data.status_name === 'Accepted' && processor && UseUserPermission(params.data.assign_processor_email))}
                  style={{ marginRight: '5px' }}
                >
                  ดำเนินการ
                </Button>
                <Button
                  className="btn btn-danger btn-sm"
                  onClick={() => openConfirmPopup('check',params.data.request_no)}
                  disabled={!(params.data.status_name === 'Processed' && responsor )}
                  style={{ marginRight: '5px' }}
                >
                  check
                </Button>
                <Button
                  className="btn btn-primary btn-sm"
                  // onClick={() => handleCheck(params.data)}
                  onClick={() => openConfirmPopup('app',params.data.request_no)}
                  disabled={!(params.data.status_name === 'Checked' && approver && UseUserPermission(params.data.assign_approver_email))}
                  style={{ marginRight: '5px' }}
                >
                  อนุมัติ
                </Button>



            </div>
        ),
    }
  ]

  const load = async () =>{
    try {
      const data = (await fetchdrawingResponse()).data;
      // console.log(data, 'data print');
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
  
  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  }
  const openConfirmPopup = (type, request_no) => {
    setConfirmType(type);   // 'app' | 'pro' | 'check'
    setSelectedId(request_no);
    setConfirmOpen(true);
  };
  
  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setConfirmType(null);
    setSelectedId(null);
  };
  
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
            รายการการมอบหมายงานคำขอจัดทำ Drawing
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
      {/* <ConfirmationPopupapp
        open={confirmOpen}
        onClose={handleConfirmClose}
        requestNo={selectedId}
        onSubmitSuccess={load}
      />
      <ConfirmationPopuppro
        open={confirmOpen}
        onClose={handleConfirmClose}
        requestNo={selectedId}
        onSubmitSuccess={load}
      />
      <ConfirmationPopupcheck
        open={confirmOpen}
        onClose={handleConfirmClose}
        requestNo={selectedId}
        onSubmitSuccess={load}
      /> */}
      {confirmType === 'app' && (
        <ConfirmationPopupapp
          open={confirmOpen}
          onClose={handleConfirmClose}
          requestNo={selectedId}
          onSubmitSuccess={load}
        />
      )}

      {confirmType === 'pro' && (
        <ConfirmationPopuppro
          open={confirmOpen}
          onClose={handleConfirmClose}
          requestNo={selectedId}
          onSubmitSuccess={load}
        />
      )}

      {confirmType === 'check' && (
        <ConfirmationPopupcheck
          open={confirmOpen}
          onClose={handleConfirmClose}
          requestNo={selectedId}
          onSubmitSuccess={load}
        />
      )}

    </div>
    
  );
}


export default DrawingresponseNew;