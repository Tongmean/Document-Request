import React from 'react';

function DrawingRequestForm() {
  const scheduleData = [
    { round: '1', requiredDate: '08/01/26', completedDate: '08/01/26' },
    { round: '2', requiredDate: '', completedDate: '' },
    { round: '3', requiredDate: '', completedDate: '' },
    { round: '4', requiredDate: '', completedDate: '' },
  ];

  return (
    <>
      {/* PRINT WRAPPER */}
      <div id="print-content">
        <main className="bg-white mx-auto">

          {/* Header */}
          <div className="relative pb-1 mb-2 border-b border-black">
            <div className="absolute left-0 top-0">
              <img
                src="https://www.compact-brake.com/images/LOGO_COMPACT-03%207.png"
                alt="Logo"
                className="h-5"
              />
            </div>
            <div className="absolute right-0 top-0 text-xs">
              รหัสเอกสาร : G/PDS/FM-07(0)
            </div>
            <h1 className="text-center font-bold text-base">
              ขอจัดทำ Drawing
            </h1>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
            {[
              ['วันที่ขอ', '05/01/26'],
              ['ฝ่าย / แผนก / หน่วยงาน', 'APQP'],
              ['ใบขอเลขที่', '1/2569'],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="font-semibold mb-0.5">{label}</div>
                <input
                  defaultValue={value}
                  className="border border-black px-1.5 w-full"
                  style={{ height: 26 }}
                />
              </div>
            ))}
          </div>

          {/* Drawing Request */}
          <div className="border border-black p-1.5 mb-2 text-xs">
            <div className="font-semibold mb-1 text-sm">Drawing ที่ต้องการขอ</div>

            <div className="grid grid-cols-2 gap-1 mb-1">
              <label><input type="checkbox" /> Drawing (New Model)</label>
              <label><input type="checkbox" defaultChecked /> Drawing (New Product)</label>
            </div>

            <div className="mb-1">
              <div className="font-semibold text-sm">ประเภท</div>
              <div className="flex gap-3">
                <label><input type="checkbox" /> ดิสเบรก</label>
                <label><input type="checkbox" defaultChecked /> ก้ามเบรก</label>
                <label><input type="checkbox" /> ผ้าเบรก</label>
              </div>
            </div>

            <div>
              <div className="font-semibold text-sm">Intensive</div>
              <div className="flex gap-3">
                <label><input type="checkbox" /> Intensive 00</label>
                <label><input type="checkbox" defaultChecked /> Intensive 01</label>
                <label><input type="checkbox" /> Master</label>
              </div>
            </div>
          </div>

          {/* Drawing Format */}
          <div className="border border-black p-1.5 mb-2 text-xs">
            <div className="font-semibold mb-1 text-sm">รูปแบบ Drawing</div>
            <div className="grid grid-cols-3 gap-1">
              {[
                ['File CAD', true],
                ['File PDF', false],
                ['Paper File', false],
                ['Catalog', false],
                ['ฉบับ A3', false],
                ['ฉบับ A4', true],
              ].map(([label, checked]) => (
                <label key={label}>
                  <input type="checkbox" defaultChecked={checked} /> {label}
                </label>
              ))}
            </div>
          </div>

          {/* Part Info */}
          <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
            <div>
              <div className="font-semibold">Part No.</div>
              <input className="border border-black w-full px-1.5" defaultValue="TRIPETCH Part no. 897020250T" />
            </div>
            <div>
              <div className="font-semibold">ลูกค้าระบุ</div>
              <input className="border border-black w-full px-1.5" defaultValue="TRIPETCH" />
            </div>
          </div>

          {/* Schedule */}
          <div className="mb-2 text-xs">
            <div className="font-semibold mb-1">กำหนดการดำเนินการ</div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black w-10">ครั้งที่</th>
                  <th className="border border-black">ต้องการภายในวันที่</th>
                  <th className="border border-black">ดำเนินการแล้วเสร็จ</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map(r => (
                  <tr key={r.round}>
                    <td className="border border-black text-center">{r.round}</td>
                    <td className="border border-black text-center">
                      <input className="w-full text-center border-0" defaultValue={r.requiredDate} />
                    </td>
                    <td className="border border-black text-center">
                      <input className="w-full text-center border-0" defaultValue={r.completedDate} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>

      {/* PRINT STYLE */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }

        #print-content {
          width: 210mm;
          height: 297mm;
        }

        main {
          width: 210mm;
          height: 297mm;
          padding: 10mm 15mm;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #print-content, #print-content * {
            visibility: visible;
          }
          #print-content {
            position: absolute;
            top: 0;
            left: 0;
          }
          input[type="checkbox"] {
            width: 9px;
            height: 9px;
            -webkit-appearance: checkbox;
            appearance: checkbox;
          }
        }

        @media screen {
          #print-content {
            margin: auto;
            box-shadow: 0 0 10px rgba(0,0,0,.15);
          }
        }
      `}</style>
    </>
  );
}
export default DrawingRequestForm