import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDrawingrequestbyid } from '../../../๊Ultility/exist/drawingRequest';
import {fetchDrawingrequestitem} from '../../../๊Ultility/exist/drawingRequestitem';
import { fetchDrawingresponsebyid, createDrawingresponse } from '../../../๊Ultility/exist/drawingResponse';
import { fetchDocumentitems } from '../../../๊Ultility/exist/documentItems';
import { useNavigate  } from 'react-router-dom';
import { Spin, message } from 'antd';
import Notification from '../../../component/Notification';

const CreatedrawingResponse = () => {
  const { request_id } = useParams();
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [requestData, setRequestData] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [requestItems, setRequestItem] = useState([]);
  const [requestItemOptions, setRequestItemOptions] = useState([]);
  const [status, setStatus] = useState('2'); // New state for status
  const [urls, setUrls] = useState(['']); // New state for URLs
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
        const request = await fetchDrawingrequestbyid({request_id : request_id});
        setRequestData(request.data[0]);
        
        const response = await fetchDrawingresponsebyid({request_id : request_id});
        setResponseData(response.data[0]);
        
        // Set status from response data if available
        if (response.data[0]?.status) {
          setStatus(response.data[0].status);
        }
        
        // Set URLs from response data if available
        if (response.data[0]?.urls && Array.isArray(response.data[0].urls)) {
          setUrls(response.data[0].urls.length > 0 ? response.data[0].urls : ['']);
        }
        
        const requestitem = await fetchDrawingrequestitem({request_no : request.data[0].request_no});
        setRequestItem(requestitem.data);
        
        const documentItems = await fetchDocumentitems();
        setRequestItemOptions(documentItems.data);

    } catch (err) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);
  
  const checkedMap = new Set(
    requestItems.map(item => item.document_name)
  );
    
  const organizedColumns = [[], [], [], []];
  requestItemOptions.forEach((doc) => {
    const columnIndex = (doc.document_no - 1) % 4;
    organizedColumns[columnIndex].push(doc);
  });
  const documents = organizedColumns.flat();
  
  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };

  const handleRemoveUrl = (index) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
    }
  };


    const handleSubmit = async () => {
        // Filter out empty URL strings
        const filteredUrls = urls.filter(url => url.trim() !== '');
          // // console.log('Submitting status:', status);
        // console.log('Submitting URLs:', url);
        // // console.log('requestData:', requestData.request_no);
        // const request_no = requestData.request_no;
        // console.log('Submitting :', {request_id, status, urls, request_no });
        // Validation: Check if status exists and at least one URL is provided
        if (!status || filteredUrls.length === 0) {
          showNotification('กรุณากรอกข้อมูลให้ครบถ้วน (อย่างน้อย 1 URL)', 'warning');
          return;
        }
        setLoading(true);
        try {
          const request_no = requestData.request_no;
          const result = await createDrawingresponse({ 
            request_id, 
            status, 
            urls: filteredUrls, 
            request_no 
          });
    
          message.success(result.msg)
          console.log('Create Drawing Response Result:', result);
          // Refresh data and reset form
          await load(); 
          handleReset();
          setTimeout(() => navigate('/exist/drawingresponse', 5000));
        } catch (error) {
          showNotification(error.message || 'เกิดข้อผิดพลาดในการบันทึก', 'warning');
        } finally {
          setLoading(false);
        }
      };
      const handleReset = () => {
        setStatus('2');
        setUrls(['']);
      };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
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

          body * {
            visibility: hidden;
          }

          #print-content,
          #print-content * {
            visibility: visible;
          }

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
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 pr-4 mr-2"
        >
          Back
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
            <div className="border h-[100px] p-2 text-[13px]">
              {requestData ? requestData.detail : ''}
            </div>
          </div>

          {/* Remark */}
          <div className="mb-2">
            <div className="font-semibold text-[13px] mb-1">
              หมายเหตุ / Remark
            </div>
            <div className="border h-[100px] p-2 text-[13px]">
              {requestData ? requestData.reason : ''}
            </div>
          </div>

          {/* Approval */}
          <div className="border p-2 text-[13px] mb-2">
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
                <div className="border-b h-5 mb-1"></div>
                <div>ลงชื่อ: {responseData ? responseData.username : ''}</div>
                <div>ตำแหน่ง: {responseData ? responseData.position : ''}</div>
                <div>วันที่: {responseData ? new Date(responseData.created_at_sender_person).toLocaleDateString('en-UK') : ''}</div>
              </div>
            </div>
          </div>

          {/* Status Input Form */}
          <div className="border p-3 text-[13px]">
            <div className="font-semibold mb-2">สถานะการพิจารณา / Status</div>
            <div className="flex items-center gap-4 mb-3">
              <select
                value={status}
                onChange={handleStatusChange}
                className="border rounded px-3 py-2 text-[13px] min-w-[200px]"
              >
                <option value="2">อนุมัติ / Approved</option>
                <option value="3">ไม่อนุมัติ / Reject</option>
              </select>
            </div>

            {/* URL Input Fields */}
            <div className="mb-3">
              <div className="font-semibold mb-2">URL ลิงก์เอกสาร / Document URLs</div>
              {urls.map((url, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder="https://example.com/document"
                    className="border rounded px-3 py-2 text-[13px] flex-1"
                  />
                  {urls.length > 1 && (
                    <button
                      onClick={() => handleRemoveUrl(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      title="Remove URL"
                    >
                      −
                    </button>
                  )}
                  {index === urls.length - 1 && (
                    <button
                      onClick={handleAddUrl}
                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      title="Add URL"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
            >
              บันทึกสถานะ / Save Status
            </button>
          </div>

        </main>
       
      </div>
        {notification && (
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
            />
        )}
    </>
  );
};

export default CreatedrawingResponse;