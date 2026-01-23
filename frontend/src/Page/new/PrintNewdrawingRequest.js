import React from 'react';

export default function DrawingRequestForm() {
  const scheduleData = [
    { round: '1', requiredDate: '08/01/26', completedDate: '08/01/26' },
    { round: '2', requiredDate: '', completedDate: '' },
    { round: '3', requiredDate: '', completedDate: '' },
    { round: '4', requiredDate: '', completedDate: '' },
  ];

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
          onClick={() => window.print()}
          className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded"
        >
          Print A4
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
          {[
            { label: 'วันที่ขอ', value: '05/01/26' },
            { label: 'ฝ่าย / แผนก / หน่วยงาน', value: 'APQP' },
            { label: 'ใบขอเลขที่', value: '1/2569' },
          ].map((item, i) => (
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
            <label className="flex gap-1 items-center">
              <input type="checkbox" className="w-3 h-3" /> Drawing (New Model)
            </label>
            <label className="flex gap-1 items-center">
              <input type="checkbox" defaultChecked className="w-3 h-3" /> Drawing (New Product)
            </label>
          </div>

          <div className="mb-0.5">
            <div className="font-semibold">ประเภท</div>
            <div className="flex gap-2">
              {['ดิสเบรก', 'ก้ามเบรก', 'ผ้าเบรก'].map((t) => (
                <label key={t} className="flex gap-1 items-center">
                  <input type="checkbox" defaultChecked={t === 'ก้ามเบรก'} className="w-3 h-3" />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold">Intensive</div>
            <div className="flex gap-2">
              {['Intensive 00', 'Intensive 01', 'Master'].map((t) => (
                <label key={t} className="flex gap-1 items-center">
                  <input type="checkbox" defaultChecked={t === 'Intensive 01'} className="w-3 h-3" />
                  {t}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Drawing Format */}
        <div className="border border-black p-1 mb-1">
          <div className="font-semibold mb-0.5">รูปแบบ Drawing</div>
          <div className="grid grid-cols-3 gap-1">
            {['File CAD', 'File PDF', 'Paper File', 'Catalog', 'ฉบับ A3', 'ฉบับ A4'].map((t) => (
              <label key={t} className="flex gap-1 items-center">
                <input
                  type="checkbox"
                  defaultChecked={t === 'File CAD' || t === 'ฉบับ A4'}
                  className="w-3 h-3"
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        {/* Part Info */}
        <div className="grid grid-cols-2 gap-1 mb-1">
          {[
            { label: 'Part No.', value: 'TRIPETCH Part no. 897020250T' },
            { label: 'ลูกค้าระบุ', value: 'TRIPETCH' },
          ].map((item, i) => (
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

        {/* Schedule */}
        <div className="mb-1">
          <div className="font-semibold mb-0.5">กำหนดการดำเนินการ</div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-0.5 w-[40px]">ครั้งที่</th>
                <th className="border border-black p-0.5">ต้องการภายในวันที่</th>
                <th className="border border-black p-0.5">ดำเนินการแล้วเสร็จ</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((row) => (
                <tr key={row.round}>
                  <td className="border border-black text-center p-0.5">{row.round}</td>
                  <td className="border border-black p-0.5">
                    <input defaultValue={row.requiredDate} className="w-full text-center outline-none" />
                  </td>
                  <td className="border border-black p-0.5">
                    <input defaultValue={row.completedDate} className="w-full text-center outline-none" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Remark */}
        <div className="mb-1">
          <div className="font-semibold mb-0.5">หมายเหตุ / Remark</div>
          <textarea
            defaultValue="เพื่อจัดทำ Part No. ใหม่ให้กับลูกค้า TRIPETCH"
            className="border border-black w-full px-1 py-0.5"
            style={{ height: '24px' }}
          />
        </div>
        {/* Signatures */}
        <div className="border border-black p-2 mb-2">
          <div className="grid grid-cols-2 gap-2.5" style={{ fontSize: '13px' }}>
            <div>
              <div className="font-semibold mb-0.5">ผู้ขอ</div>
              <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
              <div style={{ lineHeight: 1.5 }}>ลงชื่อ: Kanokporn</div>
              <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: วิศวกรประสานงานโครงการผลิตภัณฑ์</div>
              <div style={{ lineHeight: 1.5 }}>วันที่: 07/01/26</div>
            </div>
            <div>
              <div className="font-semibold mb-0.5">ผู้อนุมัติ</div>
              <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
              <div style={{ lineHeight: 1.5 }}>ลงชื่อ: Kanokporn</div>
              <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: วิศวกรประสานงานโครงการผลิตภัณฑ์</div>
              <div style={{ lineHeight: 1.5 }}>วันที่: 07/01/26</div>
            </div>
          </div>
        </div>
        {/* Signatures 2 */}
        <div className="border border-black p-2 mb-2">
          <div className="grid grid-cols-2 gap-2.5" style={{ fontSize: '13px' }}>
            <div>
              <div className="font-semibold mb-0.5">ผู้จัดทำ</div>
              <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
              <div style={{ lineHeight: 1.5 }}>ลงชื่อ: Kanokporn</div>
              <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: วิศวกรประสานงานโครงการผลิตภัณฑ์</div>
              <div style={{ lineHeight: 1.5 }}>วันที่: 07/01/26</div>
            </div>
            <div>
              <div className="font-semibold mb-0.5">ผู้ส่งข้อมูล</div>
              <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
              <div style={{ lineHeight: 1.5 }}>ลงชื่อ: Kanokporn</div>
              <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: วิศวกรประสานงานโครงการผลิตภัณฑ์</div>
              <div style={{ lineHeight: 1.5 }}>วันที่: 07/01/26</div>
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
              />
            </div>
            <div className="col-span-2 flex items-end gap-4">
              <label className="flex items-center gap-1">
                <input type="checkbox" className="w-2.5 h-2.5" />
                ต้องการ
              </label>
              <label className="flex items-center gap-1">
                <input type="checkbox" className="w-2.5 h-2.5" />
                ไม่ต้องการ
              </label>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-0.5">
              หมายเหตุ (**กรณีที่ต้องการให้ระบุสาเหตุ)
            </div>
            <input 
              type="text" 
              defaultValue="เพื่อจัดทำ Part No. ใหม่ให้กับลูกค้า TRIPETCH"
              className="border border-black w-full px-1.5 py-1"
              style={{ height: '28px' }}
            />
          </div>
        </div>

        {/* Final Approval */}
        <div className="border border-black p-1.5" style={{ fontSize: '13px' }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-semibold mb-0.5">ผู้เสนอขอ</div>
              <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
              <div style={{ lineHeight: 1.5 }}>ลงชื่อ: Kanokporn</div>
              <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: วิศวกรประสานงานโครงการผลิตภัณฑ์</div>
              <div style={{ lineHeight: 1.5 }}>วันที่: 07/01/26</div>
            </div>
            <div>
              <div className="font-semibold mb-0.5">ผู้พิจารณาคำขอ</div>
              <div className="border-b border-black mb-0.5" style={{ height: '5px' }}></div>
              <div style={{ lineHeight: 1.5 }}>ลงชื่อ: Kanokporn</div>
              <div style={{ lineHeight: 1.5 }}>ตำแหน่ง: วิศวกรประสานงานโครงการผลิตภัณฑ์</div>
              <div style={{ lineHeight: 1.5 }}>วันที่: 07/01/26</div>
            </div>
          </div>
        </div>

        
      </div>
    </>
  );
}
