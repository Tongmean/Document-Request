
// ==========================================
// FILE 1: Drawingresponse.js (Main Component)
// ==========================================

import React, { useState, useEffect } from 'react';
import { Spin , Input} from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "react-bootstrap/Button";
import Tablecomponent from './../../../component/Talecomponent';
import Modaldrawingresponse from './Modalresponse';
import { fetchDrawingresponse, fetchDrawingresponseurlbyid } from '../../../๊Ultility/exist/drawingResponse';
import { fetchDrawingrequestitem } from '../../../๊Ultility/exist/drawingRequestitem';
import { useNavigate } from 'react-router-dom';

const Drawingresponse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [rowData, setRowData] = useState([]);
    const [urlData, setUrlData] = useState([]);
  // Modal states
  const [requestItem, setRequestitem] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loadingItems, setLoadingItems] = useState(false);
  //search
  const [quickFilter, setQuickFilter] = useState('');
  const columnDefs = [
    { 
      headerName: 'No', 
      field: 'request_id', 
      checkboxSelection: true, 
      headerCheckboxSelection: true, 
      cellDataType: 'number',
      width: 50
    },
    { headerName: 'Request No', field: 'request_no', width: 150 },
    // { headerName: 'Request Date', field: 'request_at', width: 130 },
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
    {
        headerName: 'Response Date',
        field: 'created_at_sender_person',
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
    // { headerName: 'Response Date', field: 'created_at_sender_person', width: 130 },
    { headerName: 'Department', field: 'department', width: 150 },
    { headerName: 'Status', field: 'status_name', width: 120 },
    { headerName: 'Request BY', field: 'requester_username', width: 150 },
    { headerName: 'Response BY', field: 'sender_username', width: 150 },
    {
      headerName: 'Actions',
      field: 'actions',
      pinned: 'right',
      width: 180,
      cellRenderer: (params) => (
        <div>
          <Button
            className='btn btn-info btn-sm'
            onClick={() => handleShowDetails(params.data)}
            style={{ marginRight: '5px' }}
          >
            Details
          </Button>
          <Button
            className='btn btn-secondary btn-sm'
            onClick={() => handleShowprint(params.data)}
          >
            Print
          </Button>
        </div>
      ),
    }
  ];

  // Show modal with details
  const handleShowDetails = async (data) => {
    setSelectedData(data);
    setShowModal(true);
    setLoadingItems(true);
    try {
      const response = await fetchDrawingrequestitem({ request_no: data.request_no });
      setRequestitem(response.data || []);
    //   console.log("requestItem", response.data);
      const url = await fetchDrawingresponseurlbyid({ request_id: data.request_id });
      setUrlData(url.data || []);
    //   console.log("url", url.data);
    } catch (err) {
      console.error('Failed to fetch request items:', err.message);
      setRequestitem([]);
    } finally {
      setLoadingItems(false);
    }
  };

  // Close modal and reset states
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedData(null);
    setRequestitem([]);
    setLoadingItems(false);
  };

  // Load main data
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchDrawingresponse();
      setRowData(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    load();
  }, []);

  // Navigate to print page
  const handleShowprint = (data) => {
    navigate(`/exist/drawingrequest/${data.request_id}`);
  };

  // Navigate to create new response
  const handleOnClick = () => {
    navigate('/exist/createdrawingresponse');
  };

  return (
    <div className="container-fluid py-3">

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
                  รายการคำขอใช้งาน Drawing
                </h1>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>
                  ติดตามสถานะคำขอ มอบหมายงาน และจัดการ Drawing
                </p>
              </div>
      
              {/* Optional actions */}
              <div>
                {/* example */}
                {/* <Button icon={<ReloadOutlined />} onClick={load}>Refresh</Button> */}
                <Input
                    placeholder="Search all..."
                    allowClear
                    value={quickFilter}
                    onChange={(e) => setQuickFilter(e.target.value)}
                    style={{ width: 250 }}
                />
              </div>
            </div>
      <div className="mb-3">
        <button 
          className='btn btn-success btn-sm' 
          onClick={handleOnClick}
        >
          <i className="bi bi-plus-circle me-1"></i>
          เพิ่มรายการ
        </button>
      </div>
      
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
      ) : (
        <Tablecomponent
          columnDefs={columnDefs}
          rowData={rowData}
          quickFilterText={quickFilter}
          quickFilterText={quickFilter}

        />
      )}
      
      {/* Modal for showing details */}
      <Modaldrawingresponse
        show={showModal}
        onHide={handleCloseModal}
        data={selectedData}
        requestItem={requestItem}
        urlData={urlData}
        Tablename='Drawing Response'
        loadingItems={loadingItems}
      />
    </div>
  );
};

export default Drawingresponse;