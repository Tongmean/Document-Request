import React, {useEffect, useState } from 'react';
import { Spin, Button } from 'antd';
import Tablecomponent from './../../../component/Talecomponent';
import { fetchdrawingRequest } from '../../../๊Ultility/new/requestApi';
import { useNavigate  } from 'react-router-dom';
import { checkSixMonths } from '../isOverSixMonths';
import { UsePermission } from '../hookUserpermission';
import DrawingRequestModal from '../DrawingRequestModal';
import ResponseFormModal from './ResponseFormModal';
import ConfirmationPopup from './ConfirmationPopup';
import OverdueFormModal from './OverdueFormModal';
const Drawingrequestnew = () => {
    
    const canRequest = UsePermission('Responsor');
    const requestRole = UsePermission('Requestor');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    //Modal
    const [open, setOpen] = useState(false); // Modal print open state
    const [responseOpen, setResponseOpen] = useState(false); //modal response open state
    const [overdueOpen, setOverdueopen] = useState(false); //modal response open state
    const [selectedId, setSelectedId] = useState(null);
    // Add these states with your other useState declarations
    const [confirmOpen, setConfirmOpen] = useState(false);
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
                  className="btn btn-primary btn-sm"
                  onClick={() => openResponseModal(params.data.request_no)}
                  disabled={!(params.data.status_name === 'Submitted' && canRequest)}
                  style={{ marginRight: '5px' }}
                >
                  Assign To
                </Button>
                <Button
                  className="btn btn-info btn-sm"
                  onClick={() => openOverdueModal(params.data.request_no)}
                  disabled={!(params.data.status_name === 'Submitted' && requestRole)}
                  style={{ marginRight: '5px' }}
                >
                  Feedback
                </Button>
                <Button
                  className="btn btn-success btn-sm"
                  onClick={() => openConfirmPopup(params.data.request_no)}
                  disabled={!(checkSixMonths(params.data.request_at).isOverSixMonths && canRequest)}
                  style={{ marginRight: '5px' }}
                >
                  OverDue: {checkSixMonths(params.data.request_at).remainingDays} days left
                </Button>
            </div>
        ),
    }
  ]

  const load = async () =>{
    try {
      const data = (await fetchdrawingRequest()).data;
      // console.log(data, 'data print');
      // console.log(data.data.requestData[0], 'data print requestData');
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
    setResponseOpen(false)
    setSelectedId(null);
  }
  const openResponseModal = (request_no) => {
    setSelectedId(request_no);;
    setResponseOpen(true);
  };
  const openOverdueModal = (request_no) => {
    setSelectedId(request_no);;
    setOverdueopen(true);
  };
  // Add this handler function
  const openConfirmPopup = (request_no) => {
    setSelectedId(request_no);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const handleOnClick = () => {
    navigate('/new/createdrawingrequest');
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
            รายการคำขอจัดทำ Drawing
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

      <div>
          <button className='btn btn-success btn-sm' style={{ marginBottom: '10px' }} disabled={!(requestRole)} onClick={handleOnClick}>เพิ่มรายการ</button>
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
      <ResponseFormModal
        responseOpen={responseOpen}
        onClose={handleClose}
        request_no={selectedId}
        onSuccess={load}
      />
      <ConfirmationPopup
        open={confirmOpen}
        onClose={handleConfirmClose}
        requestNo={selectedId}
        onSubmitSuccess={load}
      />
      <OverdueFormModal
        overdueOpen={overdueOpen}
        request_no={selectedId}
        onClose={() => setOverdueopen(false)}
        onSuccess={load}
      />
    </div>
    
  );
}


export default Drawingrequestnew;