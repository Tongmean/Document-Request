
import React, { useState, useEffect, useRef, useContext  } from 'react';
import { Spin , message} from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "react-bootstrap/Button";
import Tablecomponent from './../../../component/Talecomponent';
// import Modaldrawingrequest from './Modaldrawingrequest';
import { fetchDrawingresponse } from '../../../๊Ultility/exist/drawingResponse';
import { useNavigate  } from 'react-router-dom';

const Drawingresponse = () => {
      const navigate = useNavigate();
      const [loading, setLoading] = useState(true); 
      const [error, setError] = useState('');
      const [rowData, setRowData] = useState([]);
      const columnDefs = [
        { headerName: 'No', field: 'request_id', checkboxSelection: true, headerCheckboxSelection: true, cellDataType: 'number'},
        { headerName: 'Request No', field: 'request_no'},
        { headerName: 'Request Date', field: 'request_at'},
        { headerName: 'Department', field: 'department'},
        { headerName: 'Detail', field: 'detail'},
        { headerName: 'Remark', field: 'reason'},
        { headerName: 'Status', field: 'status_name'},
        { headerName: 'Request BY', field: 'username'},
        {
          headerName: 'Actions',
          field: 'actions',
          pinned: 'right',
          cellRenderer: (params) => (
              <div>
                  {/* <Button
                      className='btn btn-sm'
                      onClick={() => handleShowDetails(params.data)}
                      style={{ marginRight: '5px' }}
                  >
                      D 
                  </Button> */}
                  <Button
                      className='btn btn-secondary btn-sm'
                      onClick={() => handleShowprint(params.data)}
                      style={{ marginRight: '5px' }}
                  >
                      Print
                  </Button>

              </div>
          ),
      }
    ];
    //MOdal
    const [requestItem, setRequestitem] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    // const handleShowDetails = async (data) => {
    //   setSelectedData(data);
    //   try {
    //       const requestItem = await fetchDrawingrequestitem({ request_no: data.request_no });
    //       setRequestitem(requestItem.data);
    //       console.log("requestItem",requestItem.data);
    //   } catch (err) {
    //       console.error('Failed to fetch history log:', err.message);
    //       setError(err.message);
    //   }
    //   setShowModal(true);
    // };
    // const handleCloseModal = () => {
    //   setShowModal(false);
    //   setSelectedData(null);
    //   setRequestitem([]);
    // };

    const load = async () => {
        setLoading(true);
        setError('');
      try {
          // Simulate data fetching
          const response = await fetchDrawingresponse(); // Replace with actual data fetching logic
          setRowData(response.data);
          console.log("data",response.data);
      } catch (err) {
          setError(error.message);
      } finally {
          setLoading(false);
      }
    }

    //Initial Fetch first open
    useEffect(() => {
      load();
    }, []);
    const handleShowprint = (data) => {
        navigate(`/exist/drawingrequest/${data.request_id}`);
    };
    const handleOnClick = () => {
      navigate('/exist/createdrawingresponse');
    };
    return (
    <div>
      <h1>Drawing Request Existing Page</h1>
      <p>This is the Drawing Request Existing page content.</p>
      <div>
          <button className='btn btn-success btn-sm' style={{ marginBottom: '10px' }} onClick={handleOnClick}>เพิ่มรายการ</button>
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
      {/* <Modaldrawingrequest
        show={showModal}
        onHide={handleCloseModal}
        data={selectedData}
        requestItem={requestItem}
        Tablename = 'Product-Register'
      /> */}
      
      
    </div>
  );
}


export default Drawingresponse;