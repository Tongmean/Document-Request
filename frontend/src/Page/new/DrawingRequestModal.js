import React, { useEffect, useState } from 'react';
import { Modal, Spin } from 'antd';
import { printdrawingRequest } from '../../๊Ultility/new/printDrawingrequestApi';
import { baseURL } from '../../๊Ultility/apiClient';
export default function DrawingRequestModal({ open, requestId, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestData, setRequestData] = useState(null);

  const load = async () => {
    if (!requestId) return;

    try {
      setLoading(true);
      const data = await printdrawingRequest({ id: requestId });
      // console.log('Fetched request data:', data);
      setRequestData(data);
    } catch (err) {
      setError('Failed to load request data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      load();
    }
  }, [open, requestId]);

  if (!open) return null;

  /* =========================
     DATA PREP
  ========================= */
  const requestDataapi = requestData?.data?.requestData?.[0];

  const infoArrayrequestDataap = requestDataapi
    ? [
        { label: 'วันที่ขอ', value: new Date(requestDataapi.request_at).toLocaleDateString('en-UK') },
        { label: 'ฝ่าย / แผนก / หน่วยงาน', value: requestDataapi.department },
        { label: 'ใบขอเลขที่', value: requestDataapi.request_no }
      ]
    : [];

  const drawingOptions = [
    { label: "Drawing (New Model)" },
    { label: "Drawing (New Product)" }
  ];

  const intoArraydrawing =
    requestData?.data?.documenttypeitemData?.map(i => i.document_type) || [];

  const typeOptions = ["ดิสเบรก", "ก้ามเบรก", "ผ้าเบรก", "จานเบรก", "ดรัมเบรก"];
  const intoArrayproductType =
    requestData?.data?.productTypeitemData?.map(i => i.product_type) || [];

  const intensiveOptions = ["Intensive 00", "Intensive 01", "Master"];
  const intoArrayintensive =
    requestData?.data?.drawingDocumenttypeitemData?.map(i => i.drawing_document_type) || [];

  const documenttypeOptions = [
    "File CAD", "File PDF", "Paper File", "Catalog", "ฉบับ A3", "ฉบับ A4"
  ];
  const intoArraydocumentType =
    requestData?.data?.drawingtypeitemData?.map(i => i.drawing_type) || [];

  const infoArrayrequestDataappartnocustomer_name = requestDataapi
    ? [
        { label: 'Part No.', value: requestDataapi.part_no },
        { label: 'ลูกค้าระบุ', value: requestDataapi.customer_name }
      ]
    : [];

  const selectedExpecteddate = requestData?.data?.requestDateitemData || [];
  const TARGET_LENGTH = 4;

  const toUKDate = (date) => date ? new Date(date).toLocaleDateString('en-UK') : '';

  const mappedApiData = selectedExpecteddate.map((item, index) => ({
    index: index + 1,
    request_date: toUKDate(item.request_date),
    expected_date: toUKDate(item.expected_date)
  }));

  const result = [
    ...mappedApiData,
    ...Array.from({ length: Math.max(0, TARGET_LENGTH - mappedApiData.length) }, () => ({
      index: ''
    }))
  ];

  const approverApi = requestData?.data?.approveData?.[0];
  const processApi = requestData?.data?.processData?.[0];
  const responseApi = requestData?.data?.responseData?.[0];
  const overdueApi = requestData?.data?.overdueData?.[0];
  const followApi = requestData?.data?.followData?.[0];
  const historyLogapi = requestData?.data?.historyLogData || [];
  const urlapi = requestData?.data?.urlData || [];
  const fileapi = requestData?.data?.requestFileData || [];
  // console.log('fileapi', fileapi);

  const isneed = overdueApi?.isneed;

  /* =========================
     RENDER
  ========================= */
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      destroyOnClose
    >
      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Print CSS */}
          <style>
            {`
              @page { size: A4; margin: 0; }
              @media print {
                body * { visibility: hidden; }
                .a4-page, .a4-page * { visibility: visible; }
                .a4-page {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 210mm;
                  height: 297mm;
                }
              }
            `}
          </style>

          {/* A4 PAGE */}
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
                    readOnly
                  />
                </div>
              ))}
            </div>

            {/* Drawing Request */}
            <div className="border border-black p-1 mb-1">
              <div className="font-semibold mb-0.5">Drawing ที่ต้องการขอ</div>
              <div className="grid grid-cols-2 gap-1 mb-0.5">
                {drawingOptions.map((item, idx) => (
                  <label key={idx} className="flex gap-1 items-center">
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
                  {typeOptions.map((label, idx) => (
                    <label key={idx} className="flex gap-1 items-center">
                      <input
                        type="checkbox"
                        className="w-3 h-3"
                        checked={intoArrayproductType?.includes(label)}
                        readOnly
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold">Intensive</div>
                <div className="flex gap-2">
                  {intensiveOptions.map((label, idx) => (
                    <label key={idx} className="flex gap-1 items-center">
                      <input
                        type="checkbox"
                        className="w-3 h-3"
                        checked={intoArrayintensive?.includes(label)}
                        readOnly
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawing Format */}
            <div className="border border-black p-1 mb-1">
              <div className="font-semibold mb-0.5">รูปแบบ Drawing</div>
              <div className="grid grid-cols-3 gap-1">
                {documenttypeOptions.map((label, idx) => (
                  <label key={idx} className="flex gap-1 items-center">
                    <input
                      type="checkbox"
                      className="w-3 h-3"
                      checked={intoArraydocumentType?.includes(label)}
                      readOnly
                    />
                    {label}
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
                  {result.map((row, i) => (
                    <tr key={i}>
                      <td className="border border-black text-center p-0.5">{row.index}</td>
                      <td className="border border-black p-0.5">
                        <input defaultValue={row.request_date} className="w-full text-center outline-none" readOnly />
                      </td>
                      <td className="border border-black p-0.5">
                        <input defaultValue={row.expected_date} className="w-full text-center outline-none" readOnly />
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
                {requestDataapi?.detail || ''}
              </div>
              <div className="font-semibold mb-0.5">หมายเหตุ / Remark</div>
              <div className="border h-[45px] text-[13px] border-black w-full px-1.5 py-1">
                {requestDataapi?.request_remark || ''}
              </div>
            </div>

            {/* Signatures */}
            <div className="border border-black p-2 mb-2">
              <div className="grid grid-cols-2 gap-2.5" style={{ fontSize: '13px' }}>
                <div>
                  <div className="font-semibold mb-0.5">ผู้ขอ</div>
                  <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
                  <div style={{ lineHeight: 1.5 }}>ลงชื่อ: {requestDataapi?.username || ''}</div>
                  <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: {requestDataapi?.position || ''}</div>
                  <div style={{ lineHeight: 1.5 }}>วันที่: {requestDataapi ? toUKDate(requestDataapi.request_at) : ''}</div>
                </div>
                <div>
                  <div className="font-semibold mb-0.5">ผู้อนุมัติ</div>
                  <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
                  <div style={{ lineHeight: 1.5 }}>ลงชื่อ: {approverApi?.username || ''}</div>
                  <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: {approverApi?.position || ''}</div>
                  <div style={{ lineHeight: 1.5 }}>วันที่: {approverApi ? toUKDate(approverApi.approve_at) : ''}</div>
                </div>
              </div>
            </div>

            {/* Signatures 2 */}
            <div className="border border-black p-2 mb-2">
              <div className="grid grid-cols-2 gap-2.5" style={{ fontSize: '13px' }}>
                <div>
                  <div className="font-semibold mb-0.5">ผู้จัดทำ</div>
                  <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
                  <div style={{ lineHeight: 1.5 }}>ลงชื่อ: {processApi?.username || ''}</div>
                  <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: {processApi?.position || ''}</div>
                  <div style={{ lineHeight: 1.5 }}>วันที่: {processApi ? toUKDate(processApi.process_at) : ''}</div>
                </div>
                <div>
                  <div className="font-semibold mb-0.5">ผู้ส่งข้อมูล</div>
                  <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
                  <div style={{ lineHeight: 1.5 }}>ลงชื่อ: {responseApi?.response_username || ''}</div>
                  <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: {responseApi?.response_position || ''}</div>
                  <div style={{ lineHeight: 1.5 }}>วันที่: {responseApi ? toUKDate(responseApi.response_at) : ''}</div>
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
                    defaultValue={overdueApi ? toUKDate(overdueApi.expect_date) : ''}
                    readOnly
                  />
                </div>
                <div className="col-span-2 flex items-end gap-4">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      className="w-2.5 h-2.5"
                      checked={isneed === true}
                      readOnly
                    />
                    ต้องการ
                  </label>

                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      className="w-2.5 h-2.5"
                      checked={isneed === false}
                      readOnly
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
                  {overdueApi?.overdue_remark || ''}
                </div>
              </div>
            </div>

            {/* Final Approval */}
            <div className="border border-black p-1.5" style={{ fontSize: '13px' }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold mb-0.5">ผู้ติดตามคำขอ</div>
                  <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
                  <div style={{ lineHeight: 1.5 }}>ลงชื่อ: {followApi?.username || ''}</div>
                  <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: {followApi?.position || ''}</div>
                  <div style={{ lineHeight: 1.5 }}>วันที่: {followApi ? toUKDate(followApi.follow_at) : ''}</div>
                </div>
                <div>
                  <div className="font-semibold mb-0.5">ผู้พิจารณาคำขอ</div>
                  <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
                  <div style={{ lineHeight: 1.5 }}>ลงชื่อ: {overdueApi?.username || ''}</div>
                  <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: {overdueApi?.position || ''}</div>
                  <div style={{ lineHeight: 1.5 }}>วันที่: {overdueApi ? toUKDate(overdueApi.follow_at) : ''}</div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="text-center mt-2">
            sjds
          </div> */}
            {loading ? (
                <div className="text-center py-4">
                    <Spin size="large" />
                    <p className="mt-3 text-muted">Loading items...</p>
                </div>
                ) : fileapi && fileapi.length > 0 ? (
                <>
                    <h5 className="border-bottom pb-2 mb-3">
                    <i className="bi bi-list-ul me-2"></i>
                        Request File
                  </h5>
                    <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="table-dark">
                        <tr>
                            <th style={{ width: '60px' }} className="text-center">No.</th>
                            <th>Path</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fileapi.map((item, index) => (
                            <tr key={index}>
                                <td className="text-center">
                                    <span className="badge bg-secondary">{index + 1}</span>
                                </td>
                              
                                <td>
                                  {item.file_path ? (
                                    // <a href={item.file_path} target="_blank" rel="noopener noreferrer">
                                    //   {baseURL}/app/app2/Assets/{item.file_path}
                                    // </a>
                                      <a
                                        href={`${baseURL}/apps/app2/Assets/${item.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {item.file_path}
                                      </a>
                                  ) : (
                                    'N/A'
                                  )}
                                </td>

                                
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                    
                    {/* Summary */}
                    <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded">
                    <div>
                        <strong>Total Items:</strong>
                        <span className="badge bg-info ms-2">{fileapi.length}</span>
                    </div>
                    </div>
                </>
                ) : (
                <div className="text-center text-muted py-5 bg-light rounded">
                    <div style={{ fontSize: '3rem' }}>📋</div>
                    <p className="mt-3 mb-0">No items found for this request</p>
                </div>
            )}
            {loading ? (
                <div className="text-center py-4">
                    <Spin size="large" />
                    <p className="mt-3 text-muted">Loading items...</p>
                </div>
                ) : historyLogapi && historyLogapi.length > 0 ? (
                <>
                    <h5 className="border-bottom pb-2 mb-3">
                    <i className="bi bi-list-ul me-2"></i>
                        ประวัติการคำขอจัดทำ Drawing ทั้งหมด
                  </h5>
                    <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="table-dark">
                        <tr>
                            <th style={{ width: '60px' }} className="text-center">No.</th>
                            <th>Column</th>
                            <th>Old Value</th>
                            <th>New Value</th>
                            <th>Update By</th>
                            <th>Update at</th>
                        </tr>
                        </thead>
                        <tbody>
                        {historyLogapi.map((item, index) => (
                            <tr key={index}>
                                <td className="text-center">
                                    <span className="badge bg-secondary">{index + 1}</span>
                                </td>
                                <td>
                                    <code>{item.column_name || 'N/A'}</code>
                                </td>
                                <td>
                                    <code>{item.old_value || 'N/A'}</code>
                                </td>
                                <td>
                                    {item.new_value || 'N/A'}
                                </td>
                                <td>
                                    {item.username || 'N/A'}
                                </td>
                                <td>
                                    {new Date(item.action_at).toLocaleDateString('en-UK') || 'N/A'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                    
                    {/* Summary */}
                    <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded">
                    <div>
                        <strong>Total Items:</strong>
                        <span className="badge bg-info ms-2">{historyLogapi.length}</span>
                    </div>
                    </div>
                </>
                ) : (
                <div className="text-center text-muted py-5 bg-light rounded">
                    <div style={{ fontSize: '3rem' }}>📋</div>
                    <p className="mt-3 mb-0">No items found for this request</p>
                </div>
            )}
   
              {loading ? (
                <div className="text-center py-4">
                    <Spin size="large" />
                    <p className="mt-3 text-muted">Loading items...</p>
                </div>
                ) : urlapi && urlapi.length > 0 ? (
                <>
                    <h5 className="border-bottom pb-2 mb-3">
                    <i className="bi bi-list-ul me-2"></i>
                        File Path
                  </h5>
                    <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="table-dark">
                        <tr>
                            <th style={{ width: '60px' }} className="text-center">No.</th>
                            <th>Path</th>
                        </tr>
                        </thead>
                        <tbody>
                        {urlapi.map((item, index) => (
                            <tr key={index}>
                                <td className="text-center">
                                    <span className="badge bg-secondary">{index + 1}</span>
                                </td>
                              
                                <td>
                                  {item.path ? (
                                    <a href={item.path} target="_blank" rel="noopener noreferrer">
                                      {item.path}
                                    </a>
                                  ) : (
                                    'N/A'
                                  )}
                                </td>

                                
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                    
                    {/* Summary */}
                    <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded">
                    <div>
                        <strong>Total Items:</strong>
                        <span className="badge bg-info ms-2">{urlapi.length}</span>
                    </div>
                    </div>
                </>
                ) : (
                <div className="text-center text-muted py-5 bg-light rounded">
                    <div style={{ fontSize: '3rem' }}>📋</div>
                    <p className="mt-3 mb-0">No items found for this request</p>
                </div>
            )}
        </>
      )}
    </Modal>
  );
}