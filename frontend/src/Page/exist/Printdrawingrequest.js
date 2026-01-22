import React, { useState, useEffect, useRef, useContext  } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDrawingrequestbyid } from '../../๊Ultility/exist/drawingRequest';
import {fetchDrawingrequestitem} from '../../๊Ultility/exist/drawingRequestitem';
import { fetchDrawingresponsebyid } from '../../๊Ultility/exist/drawingResponse';
import { fetchDocumentitems } from '../../๊Ultility/exist/documentItems';
import { useNavigate  } from 'react-router-dom';
import { Spin } from 'antd';
import { convertToUTCPlus7 } from '../../๊Ultility/Moment-timezone';
const DrawingRequestPrint = () => {
  const { request_id } = useParams();
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [requestData, setRequestData] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [requestItems, setRequestItem] = useState([]);
  const [requestItemOptions, setRequestItemOptions] = useState([]);
  const navigate = useNavigate();
  const load = async () => {
    setLoading(true);
    setError('');
    try {
        // Simulate data fetching
        const request = await fetchDrawingrequestbyid({request_id : request_id}); // Replace with actual data fetching logic
        // console.log("request",request.data[0]);
        setRequestData(request.data[0]);
        // Simulate data fetching
        const response = await fetchDrawingresponsebyid({request_id : request_id}); // Replace with actual data fetching logic
        // console.log("response.data[0]",response.data[0]);
        setResponseData(response.data[0]);
        const requestitem = await fetchDrawingrequestitem({request_no : request.data[0].request_no}); // Replace with actual data fetching logic
        // console.log("requestitem",requestitem.data);
        setRequestItem(requestitem.data);
        // Fetch document items
        const documentItems = await fetchDocumentitems();
        // console.log("documentItems", documentItems.data);
        
        // Store the complete document items with both document_no and document_name
        setRequestItemOptions(documentItems.data);

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
  
  const checkedMap = new Set(
    requestItems.map(item => item.document_name)
  );
  // console.log("checkedMap",checkedMap);
    
  // Organize documents into 4 columns based on document_no
  // Column 1: 1,5,9,13  Column 2: 2,6,10,14  Column 3: 3,7,11,15  Column 4: 4,8,12,16
  const organizedColumns = [[], [], [], []];
  requestItemOptions.forEach((doc) => {
    const columnIndex = (doc.document_no - 1) % 4;
    organizedColumns[columnIndex].push(doc);
  });
  const documents = organizedColumns.flat();
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spin size="large" />
        </div>
    );
  }
  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          body {
            margin: 0;
            padding: 0;
          }

          /* Hide everything except print content */
          body * {
            visibility: hidden;
          }

          #print-content,
          #print-content * {
            visibility: visible;
          }

          /* Center the content on A4 */
          #print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            height: 297mm;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          #print-content main {
            width: 210mm;
            height: 297mm;
            padding: 10mm 15mm;
          }

          .border {
            border: 1px solid #000 !important;
          }

          .border-b {
            border-bottom: 1px solid #000 !important;
          }

          input[type="checkbox"] {
            width: 9px;
            height: 9px;
            margin: 0;
            -webkit-appearance: checkbox;
            appearance: checkbox;
          }
        }

        /* Screen styles */
        @media screen {
          #print-content {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
        }
      `}</style>

      {/* PRINT BUTTON (NOT PRINTED) */}
      <div className="mb-4 text-right">
        <button
          onClick={() => navigate('/exist/drawingrequest')}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-blue-700 pr-4 mr-2"
        >
          back
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print Form
        </button>
      </div>

      {/* FORM CONTENT */}
      <div id="print-content">
        <main>
          {/* Header */}
          <div
            className="relative border-b flex items-center"
            style={{ paddingBottom: "3px", marginBottom: "8px" }}
          >
            <div style={{ position: "absolute", left: 0, top: 0 }}>
              <img
                src="https://www.compact-brake.com/images/LOGO_COMPACT-03%207.png"
                alt="Logo"
                style={{ height: "20px" }}
              />
            </div>

            <div
              className="absolute right-0 top-0"
              style={{ fontSize: "10px" }}
            >
              รหัสเอกสาร : G/PDS/FM-05(0)
            </div>

            <h1
              className="text-center font-bold"
              style={{ fontSize: "16px", width: "100%" }}
            >
              ใบขอ Drawing เพื่อใช้งาน
            </h1>
          </div>

          {/* Basic Info */}
          <div style={{ marginBottom: "8px" }}>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["ใบขอเลขที่", `${requestData ? requestData.request_no : ''}`],
                ["วันที่ขอ", `${requestData ? new Date(requestData.request_at).toLocaleDateString('en-UK') : ''}`],
                ["ฝ่าย / แผนก / หน่วยงาน", `${requestData ? requestData.department : ''}`],
              ].map(([label, value], i) => (
                <div key={i}>
                  <div className="font-semibold text-[10px] mb-1">
                    {label}
                  </div>
                  <div className="border p-1 text-[10px] h-[26px]">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drawing Type */}
          <div className="border p-2 mb-2">
            <div className="font-semibold text-[12px] mb-1">
              ประเภทที่ขอ
            </div>

            {/* <div className="grid grid-cols-4 text-[14px] gap-x-2">
              {organizedColumns.map((column, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-1">
                  {column.map((doc) => (
                    <label key={doc.document_no} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={checkedMap.has(doc.document_name)}
                        readOnly
                      />
                      {doc.document_name}
                    </label>
                  ))}
                </div>
              ))}
            </div> */}

            <div className="grid grid-cols-4 gap-x-2 gap-y-1 text-[14px]">
              {documents.map((doc) => (
                <label
                  key={doc.document_no}
                  className="flex items-center gap-1"
                >
                  <input
                    type="checkbox"
                    checked={checkedMap.has(doc.document_name)}
                    readOnly
                  />
                  {doc.document_name}
                </label>
              ))}
            </div>

          </div>

          {/* Detail */}
          <div className="mb-2">
            <div className="font-semibold text-[13px] mb-1">
              รายละเอียดที่ขอ / Detail
            </div>
            <div className="border h-[400px] p-2 text-[13px]">
              {requestData ? requestData.detail : ''}
            </div>
          </div>

          {/* Remark */}
          <div className="mb-2">
            <div className="font-semibold text-[13px] mb-1">
              หมายเหตุ / Remark
            </div>
            <div className="border h-[200px] p-2 text-[13px]">
              {requestData ? requestData.reason : ''}
            </div>
          </div>

          {/* Approval */}
          <div className="border p-2 text-[13px]">
            <div className="grid grid-cols-2 gap-4">

              {/* ผู้เสนอขอ */}
              <div>
                <div className="font-semibold mb-1">ผู้เสนอขอ</div>
                <div className="border-b h-5 mb-1"></div>
                <div>ลงชื่อ: {requestData ? requestData.username : ''}</div>
                <div>ตำแหน่ง: {requestData ? requestData.position : ''}</div>
                <div>วันที่: {requestData ? new Date(requestData.request_at).toLocaleDateString('en-UK') : ''}</div>
              </div>

              {/* ผู้พิจารณาคำขอ */}
              <div>
                <div className="font-semibold mb-1">ผู้พิจารณาคำขอ</div>
                <div className="border-b h-5 mb-1" ></div>
                <div>ลงชื่อ: {responseData ? responseData.username : ''}</div>
                <div>ตำแหน่ง: {responseData ? responseData.position : ''}</div>
                <div>วันที่: {responseData ? new Date(responseData.created_at_sender_person).toLocaleDateString('en-UK') : ''}</div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default DrawingRequestPrint;