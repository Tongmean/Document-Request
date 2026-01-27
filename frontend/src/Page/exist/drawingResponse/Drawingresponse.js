
// import React, { useState, useEffect, useRef, useContext  } from 'react';
// import { Spin , message} from 'antd';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Button from "react-bootstrap/Button";
// import Tablecomponent from './../../../component/Talecomponent';
// // import Modaldrawingrequest from './Modaldrawingrequest';
// import { fetchDrawingresponse } from '../../../๊Ultility/exist/drawingResponse';
// import { useNavigate  } from 'react-router-dom';

// const Drawingresponse = () => {
//       const navigate = useNavigate();
//       const [loading, setLoading] = useState(true); 
//       const [error, setError] = useState('');
//       const [rowData, setRowData] = useState([]);
//       const columnDefs = [
//         { headerName: 'No', field: 'request_id', checkboxSelection: true, headerCheckboxSelection: true, cellDataType: 'number'},
//         { headerName: 'Request No', field: 'request_no'},
//         { headerName: 'Request Date', field: 'request_at'},
//         { headerName: 'Resopnse Date', field: 'created_at_sender_person'},
//         { headerName: 'Department', field: 'department'},
//         // { headerName: 'Detail', field: 'detail'},
//         // { headerName: 'Remark', field: 'reason'},
//         { headerName: 'Status', field: 'status_name'},
//         { headerName: 'Request BY', field: 'requester_username'},
//         { headerName: 'Response BY', field: 'sender_username'},
//         {
//           headerName: 'Actions',
//           field: 'actions',
//           pinned: 'right',
//           cellRenderer: (params) => (
//               <div>
//                   {/* <Button
//                       className='btn btn-sm'
//                       onClick={() => handleShowDetails(params.data)}
//                       style={{ marginRight: '5px' }}
//                   >
//                       D 
//                   </Button> */}
//                   <Button
//                       className='btn btn-secondary btn-sm'
//                       onClick={() => handleShowprint(params.data)}
//                       style={{ marginRight: '5px' }}
//                   >
//                       Print
//                   </Button>

//               </div>
//           ),
//       }
//     ];
//     //MOdal
//     const [requestItem, setRequestitem] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [selectedData, setSelectedData] = useState(null);

//     // const handleShowDetails = async (data) => {
//     //   setSelectedData(data);
//     //   try {
//     //       const requestItem = await fetchDrawingrequestitem({ request_no: data.request_no });
//     //       setRequestitem(requestItem.data);
//     //       console.log("requestItem",requestItem.data);
//     //   } catch (err) {
//     //       console.error('Failed to fetch history log:', err.message);
//     //       setError(err.message);
//     //   }
//     //   setShowModal(true);
//     // };
//     // const handleCloseModal = () => {
//     //   setShowModal(false);
//     //   setSelectedData(null);
//     //   setRequestitem([]);
//     // };

//     const load = async () => {
//         setLoading(true);
//         setError('');
//       try {
//           // Simulate data fetching
//           const response = await fetchDrawingresponse(); // Replace with actual data fetching logic
//           setRowData(response.data);
//         //   console.log("data",response.data);
//       } catch (err) {
//           setError(error.message);
//       } finally {
//           setLoading(false);
//       }
//     }

//     //Initial Fetch first open
//     useEffect(() => {
//       load();
//     }, []);
//     const handleShowprint = (data) => {
//         navigate(`/exist/drawingrequest/${data.request_id}`);
//     };
//     const handleOnClick = () => {
//       navigate('/exist/createdrawingresponse');
//     };
//     return (
//     <div>
//       <h1>Drawing Request Existing Page</h1>
//       <p>This is the Drawing Request Existing page content.</p>
//       <div>
//           <button className='btn btn-success btn-sm' style={{ marginBottom: '10px' }} onClick={handleOnClick}>เพิ่มรายการ</button>
//       </div>
//       {loading ? (
//         <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//             <Spin size="large" />
//         </div>
//       ) : error ? (
//           <div style={{ color: 'red' }}>{`Error: ${error}`}</div>
//       ) : (
//         <Tablecomponent
//             columnDefs={columnDefs}
//             rowData={rowData}
//             // onGridReady={onGridReady}
//             // onSelectionChanged={onSelectionChanged}
//             // // getRowClass={getRowClass}
//             // getRowId={(params) => params.data.No.toString()} // 👈 important
//         />
//       )}
//       {/* <Modaldrawingrequest
//         show={showModal}
//         onHide={handleCloseModal}
//         data={selectedData}
//         requestItem={requestItem}
//         Tablename = 'Product-Register'
//       /> */}
      
      
//     </div>
//   );
// }


// export default Drawingresponse;



// ==========================================
// FILE 1: Drawingresponse.js (Main Component)
// ==========================================

import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
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
      <h1>Drawing Response Management</h1>
      <p className="text-muted">Manage and view all drawing response records</p>
      
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