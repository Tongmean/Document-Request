import React, {useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import {printdrawingRequest} from '../../๊Ultility/new/printDrawingrequestApi';
export default function DrawingRequestForm() {
  const { request_id } = useParams();
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [requestData, setRequestData] = useState(null);
  const navigate = useNavigate();
  const load = async () =>{
    try {
      const data = await printdrawingRequest({id : request_id});
      // console.log(data.data.documenttypeitemData[0], 'data print');
      // console.log(data.data.requestData[0], 'data print requestData');
      setRequestData(data);
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
  const requestDataapi = requestData ? (requestData.data.requestData)[0] : null;
  // console.log('requestDataapi print',requestDataapi);
  const infoArrayrequestDataap = requestDataapi
    ? [
        {
          label: 'วันที่ขอ',
          value: new Date(requestDataapi.request_at).toLocaleDateString('en-UK')
        },
        {
          label: 'ฝ่าย / แผนก / หน่วยงาน',
          value: requestDataapi.department
        },
        {
          label: 'ใบขอเลขที่',
          value: requestDataapi.request_no
        },
        
      ]
    : [];

  //Draiwng check
  const drawingOptions = [
    { id: "new-model", label: "Drawing (New Model)" },
    { id: "new-product", label: "Drawing (New Product)" },
  ];
  const selectedDrawings = requestData ? (requestData.data.documenttypeitemData) : null;
  const intoArraydrawing = selectedDrawings ? [selectedDrawings.map(i=>i.document_type)].flat() :[];
  // console.log('selectedDrawings',selectedDrawings);
  // console.log('intoArraydrawing',intoArraydrawing);
  //ประเภท
  const typeOptions = [
    { id: 1, label: "ดิสเบรก" },
    { id: 2, label: "ก้ามเบรก" },
    { id: 3, label: "ผ้าเบรก" },
  ];
  const selectedtype = requestData ? (requestData.data.productTypeitemData) : null;
  const intoArrayproductType = selectedDrawings ? [selectedtype.map(i=>i.product_type)].flat() :[];
  //Intensive
  const intensiveOptions = [
    { id: 1, label: "Intensive 00" },
    { id: 2, label: "Intensive 01" },
    { id: 3, label: "Master" },
  ];
  const selectedintensive = requestData ? (requestData.data.drawingDocumenttypeitemData) : null;
  const intoArrayintensive = selectedDrawings ? [selectedintensive.map(i =>i.drawing_document_type)].flat() :[];
  //รูปแบบ Drawing
  const documenttypeOptions = [
    { id: 1, label: "File CAD" },
    { id: 2, label: "File PDF" },
    { id: 3, label: "Paper File" },
    { id: 4, label: "Catalog" },
    { id: 5, label: "ฉบับ A3" },
    { id: 6, label: "ฉบับ A4" },
  ]
  const selectedDocumenttype = requestData ? (requestData.data.drawingtypeitemData) : null;
  const intoArraydocumentType = selectedDrawings ? [selectedDocumenttype.map(i =>i.drawing_type)].flat() :[];
  //part no- customer
  const infoArrayrequestDataappartnocustomer_name = requestDataapi
  ? [
      {
        label: 'Part No.',
        value: requestDataapi.part_no
      },
      {
        label: 'ลูกค้าระบุ',
        value: requestDataapi.customer_name
      }
      
    ]
  : [];
  //schedule data
  const selectedExpecteddate = requestData ? (requestData.data.requestDateitemData) : null;
  // console.log('selectedExpecteddate',selectedExpecteddate);
  const TARGET_LENGTH = 4;

  const emptyRow = {
    id: null,
    request_no: null,
    request_date_item_id: null,
    request_date: null,
    expected_date: null
  };
  
  // 🔑 Normalize API data (safe for first render = null)
  const safeData = Array.isArray(selectedExpecteddate) ? selectedExpecteddate : [];

  // 🔑 Helper: convert ISO date → en-UK local date
  const toUKDate = (safeData) =>
  safeData
      ? new Date(safeData).toLocaleDateString('en-UK')
      : null;

  // 🔑 Step 1: map ONLY existing API rows → add index + convert date
  const mappedApiData = safeData.map((item, index) => ({
    index: index + 1, // ✅ index only for API data
    ...item,
    request_date: toUKDate(item.request_date),
    expected_date: toUKDate(item.expected_date)
  }));

  // 🔑 Step 2: pad with empty rows (NO index)
  const result = [
    ...mappedApiData,
    ...Array.from(
      { length: Math.max(0, TARGET_LENGTH - mappedApiData.length) },
      () => ({ ...emptyRow })
    )
  ];
  // console.log(result);
  //ผู้อนุมัติ
  const approverApi = requestData ? (requestData.data.approveData)[0] : null;
  const resopnseApi = requestData ? (requestData.data.responseData)[0] : null;
  const processApi = requestData ? (requestData.data.processData)[0] : null;
  const overdueApi = requestData ? (requestData.data.overdueData)[0] : null;
  const followApi = requestData ? (requestData.data.followData)[0] : null;
  // console.log('followApi',followApi);
  //isneed
  const isneed = overdueApi ? (overdueApi.isneed) : null;
  if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spin size="large" />
        </div>
    );
  }
  return (
    <>
      {/* Print CSS */}
      <style>
        {`
          @page {
            size: A4;
            margin: 0;
          }

          @media print {
            body {
              margin: 0;
              padding: 0;
              background: white;
            }

            body * {
              visibility: hidden;
            }

            .a4-page,
            .a4-page * {
              visibility: visible;
            }

            .a4-page {
              position: absolute;
              left: 0;
              top: 0;
              width: 210mm;
              height: 297mm;
              page-break-inside: avoid;
              break-inside: avoid;
              overflow: hidden;
            }
          }
        `}
      </style>

      {/* Print Button */}
      <div className="flex justify-end mb-2 print:hidden">
        <button
            onClick={() => navigate('/new/drawingrequest')}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-blue-700 pr-4 mr-2"
          >
            back
        </button>
        <button
          // onClick={handlePrint}
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print Form
        </button>
      </div>

      {/* A4 Page */}
      <div
        className="a4-page bg-white mx-auto"
        style={{
          width: '210mm',
          height: '297mm',
          padding: '8mm 12mm',
          fontFamily: 'Arial, sans-serif',
          fontSize: '11px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div className="relative pb-1 mb-1 border-b border-black">
          <img
            src="https://www.compact-brake.com/images/LOGO_COMPACT-03%207.png"
            alt="Logo"
            className="absolute left-0 top-0 h-4"
          />
          <div className="absolute right-0 top-0 text-[10px]">
            รหัสเอกสาร : G/PDS/FM-07(0)
          </div>
          <h1 className="text-center font-bold text-sm">ขอจัดทำ Drawing</h1>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-3 gap-1 mb-1">
          {infoArrayrequestDataap.map((item, i) => (
            <div key={i}>
              <div className="font-semibold mb-0.5">{item.label}</div>
              <input
                defaultValue={item.value}
                className="border border-black w-full px-1 py-0.5"
                style={{ height: '22px' }}
              />
            </div>
          ))}
        </div>

        {/* Drawing Request */}
        <div className="border border-black p-1 mb-1">
          <div className="font-semibold mb-0.5">Drawing ที่ต้องการขอ</div>
          <div className="grid grid-cols-2 gap-1 mb-0.5">
            {drawingOptions.map((item) => (
              <label key={item.id} className="flex gap-1 items-center">
                <input
                  type="checkbox"
                  className="w-3 h-3"
                  checked={intoArraydrawing?.includes(item.label)}
                  readOnly
                />
                {item.label}
              </label>
            ))}
          </div>

          <div className="mb-0.5">
            <div className="font-semibold">ประเภท</div>
            <div className="flex gap-2">
              {typeOptions.map((item) => (
                <label key={item.id} className="flex gap-1 items-center">
                  <input
                    type="checkbox"
                    className="w-3 h-3"
                    checked={intoArrayproductType?.includes(item.label)}
                    readOnly
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold">Intensive</div>
            <div className="flex gap-2">
              {intensiveOptions.map((item) => (
                <label key={item.id} className="flex gap-1 items-center">
                  <input
                    type="checkbox"
                    className="w-3 h-3"
                    checked={intoArrayintensive?.includes(item.label)}
                    readOnly
                  />
                {item.label}
              </label>
            ))}
            </div>
          </div>
        </div>

        {/* Drawing Format */}
        <div className="border border-black p-1 mb-1">
          <div className="font-semibold mb-0.5">รูปแบบ Drawing</div>
          <div className="grid grid-cols-3 gap-1">
            {documenttypeOptions.map((item) => (
              <label key={item.id} className="flex gap-1 items-center">
                <input
                  type="checkbox"
                  className="w-3 h-3"
                  checked={intoArraydocumentType?.includes(item.label)}
                  readOnly
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        {/* Part Info */}
        <div className="grid grid-cols-2 gap-1 mb-1">
          {infoArrayrequestDataappartnocustomer_name.map((item, i) => (
            <div key={i}>
              <div className="font-semibold mb-0.5">{item.label}</div>
              <input
                defaultValue={item.value}
                className="border border-black w-full px-1 py-0.5"
                style={{ height: '22px' }}
                readOnly
              />
            </div>
          ))}
        </div>

        {/* Schedule */}
        <div className="mb-1">
          <div className="font-semibold mb-0.5">กำหนดการดำเนินการ</div>
          <table className="text-center w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-0.5 w-[40px]">ครั้งที่</th>
                <th className="border border-black p-0.5">ต้องการภายในวันที่</th>
                <th className="border border-black p-0.5">ดำเนินการแล้วเสร็จ</th>
              </tr>
            </thead>
            <tbody>
              {result.map((row) => (
                <tr key={row.index}>
                  <td className="border border-black text-center p-0.5">{row.index}</td>
                  <td className="border border-black p-0.5">
                    <input defaultValue={row.request_date} className="w-full text-center outline-none" />
                  </td>
                  <td className="border border-black p-0.5">
                    <input defaultValue={row.expected_date} className="w-full text-center outline-none" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Remark */}
        <div className="mb-1">
          <div className="font-semibold mb-0.5">รายละเอียดเพิ่มเติม / Detail</div>
          <div className="border h-[45px] text-[13px] border-black w-full px-1.5 py-1">
              {requestDataapi ? requestDataapi.detail : ''}
          </div>
          <div className="font-semibold mb-0.5">หมายเหตุ / Remark</div>
          <div className="border h-[45px] text-[13px] border-black w-full px-1.5 py-1">
            {requestDataapi ? requestDataapi.request_remark : ''}
          </div>
        </div>
        {/* Signatures */}
        <div className="border border-black p-2 mb-2">
          <div className="grid grid-cols-2 gap-2.5" style={{ fontSize: '13px' }}>
            <div>
              <div className="font-semibold mb-0.5">ผู้ขอ</div>
              <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
              <div style={{ lineHeight: 1.5 }}>ลงชื่อ: {requestDataapi ? requestDataapi.username : ''}</div>
              <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: {requestDataapi ? requestDataapi.position : ''}</div>
              <div style={{ lineHeight: 1.5 }}>วันที่: {requestDataapi ? new Date(requestDataapi.request_at).toLocaleDateString('en-UK') : ''}</div>
            </div>
            <div>
              <div className="font-semibold mb-0.5">ผู้อนุมัติ</div>
              <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
              <div style={{ lineHeight: 1.5 }}>ลงชื่อ: {approverApi ? approverApi.username : ''}</div>
              <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: {approverApi ? approverApi.position : ''}</div>
              <div style={{ lineHeight: 1.5 }}>วันที่: {approverApi ? new Date(approverApi.approve_at).toLocaleDateString('en-UK'): ''}</div>
            </div>
          </div>
        </div>
        {/* Signatures 2 */}
        <div className="border border-black p-2 mb-2">
          <div className="grid grid-cols-2 gap-2.5" style={{ fontSize: '13px' }}>
            <div>
              <div className="font-semibold mb-0.5">ผู้จัดทำ</div>
              <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
              <div style={{ lineHeight: 1.5 }}>ลงชื่อ: {processApi ? (processApi.username): ''}</div>
              <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: {processApi ? (processApi.position): ''}</div>
              <div style={{ lineHeight: 1.5 }}>วันที่: {processApi ? new Date(processApi.process_at).toLocaleDateString('en-UK'): ''}</div>
            </div>
            <div>
              <div className="font-semibold mb-0.5">ผู้ส่งข้อมูล</div>
              <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
              <div style={{ lineHeight: 1.5 }}>ลงชื่อ: {resopnseApi ? (resopnseApi.response_username): ''}</div>
              <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: {resopnseApi ? (resopnseApi.response_position): ''}</div>
              <div style={{ lineHeight: 1.5 }}>วันที่: {resopnseApi ? new Date(resopnseApi.response_at).toLocaleDateString('en-UK'): ''}</div>
            </div>
          </div>
        </div>
        
        {/* Follow-up */}
        <div className="border border-black p-2 mb-2" style={{ fontSize: '13px' }}>
          <div className="font-semibold mb-1">
            ติดตาม Drawing Intensive 01 ในกรณีที่เกิน 6 เดือน
          </div>

          <div className="grid grid-cols-3 gap-2 mb-1">
            <div>
              <div className="font-semibold mb-0.5">ระบุวันที่</div>
              <input 
                type="text" 
                className="border border-black w-full px-1.5 py-1"
                style={{ height: '26px' }}
                defaultValue={overdueApi ? (new Date(overdueApi.expect_date).toLocaleDateString('en-UK')): ''}
                readOnly
              />
            </div>
            <div className="col-span-2 flex items-end gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  className="w-2.5 h-2.5"
                  checked={isneed === true}
                  onChange={() => {}}
                />
                ต้องการ
              </label>

              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  className="w-2.5 h-2.5"
                  checked={isneed === false}
                  onChange={() => {}}
                />
                ไม่ต้องการ
              </label>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-0.5">
              หมายเหตุ (**กรณีที่ต้องการให้ระบุสาเหตุ)
            </div>
            <div className="border h-[30px] text-[13px] border-black w-full px-1.5 py-1">
              {overdueApi ? (overdueApi.overdue_remark): ''}
            </div>
          </div>
        </div>

        {/* Final Approval */}
        <div className="border border-black p-1.5" style={{ fontSize: '13px' }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-semibold mb-0.5">ผู้ติดตามคำขอ</div>
              <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
              <div style={{ lineHeight: 1.5 }}>ลงชื่อ: {followApi ? (followApi.username): ''}</div>
              <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: {followApi ? (followApi.position): ''}</div>
              <div style={{ lineHeight: 1.5 }}>วันที่: {followApi ? new Date(followApi.follow_at).toLocaleDateString('en-UK'): ''}</div>
            </div>
            <div>
              <div className="font-semibold mb-0.5">ผู้พิจารณาคำขอ</div>
              <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
              <div style={{ lineHeight: 1.5 }}>ลงชื่อ: {overdueApi ? (overdueApi.username):''}</div>
              <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: {overdueApi ? (overdueApi.position): ''}</div>
              <div style={{ lineHeight: 1.5 }}>วันที่: {overdueApi ? new Date(overdueApi.follow_at).toLocaleDateString('en-UK'): ''}</div>
            </div>
          </div>
        </div>

        
      </div>
    </>
  );
}
