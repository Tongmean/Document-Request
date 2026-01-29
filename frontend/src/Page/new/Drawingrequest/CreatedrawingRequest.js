import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import {fetchNexrequest_no, postRequest} from '../../../๊Ultility/new/requestApi';

export default function DrawingRequestForm() {
  // Get request_id from URL parameters (e.g., /drawing-request/123)
//   const { request_id } = useParams();
  
  // State for managing loading, error, and API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestnoData, setRequestnoData] = useState('');
  
  // Hook for programmatic navigation
  const navigate = useNavigate();
    const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
    };
  // State for basic form information
  // This holds all the main request details like date, department, etc.
  const [formData, setFormData] = useState({
    request_at: getCurrentDate(),        // Date when request was made
    department: '',        // Department/division name
    request_no: requestnoData,        // Request number/ID
    part_no: '',          // Part number
    customer_name: '',    // Customer specified name
    detail: '',           // Additional details
    request_remark: ''    // Remarks/notes
  });
  useEffect(() => {
    if (requestnoData) {
      setFormData(prev => ({
        ...prev,
        request_no: requestnoData
      }));
    }
  }, [requestnoData]);  

  // State for checkbox selections - NOW STORING IDs INSTEAD OF LABELS
  // Each array holds the IDs of checked items (numbers or strings)
  const [selectedDrawings, setSelectedDrawings] = useState([]);           // Drawing type IDs: ["new-model", "new-product"]
  const [selectedProductTypes, setSelectedProductTypes] = useState([]);   // Product type IDs: [1, 2, 3]
  const [selectedIntensive, setSelectedIntensive] = useState([]);         // Intensive IDs: [1, 2, 3]
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState([]); // Document format IDs: [1, 2, 3, 4, 5, 6]
  
  // State for schedule table rows
  // Starts with one empty row, can add more dynamically
  const [scheduleRows, setScheduleRows] = useState([
    { 
      index: 1,              // Row number for display
      request_date: '',      // Date user wants it by (editable)
      expected_date: ''      // Date of completion (read-only, yyyy-mm-dd format)
    }
  ]);

  /**
   * Load function - Fetches data from API
   * This runs when component mounts to populate the form with existing data
   */
  const load = async () => {
    try {
      // Uncomment below to fetch actual data from API
      const result = await fetchNexrequest_no();
    //   console.log('Fetched request no data:', result.data[0]);
        setRequestnoData(result.data[0].next_request_no);
      setLoading(false);
    } catch (err) {
      setError('Failed to load request data.');
      setLoading(false);
    }
  };

  // useEffect runs on component mount to fetch initial data
  useEffect(() => {
    load();
  }, []);

  // ===============================================
  // OPTIONS CONFIGURATION
  // Each option has an 'id' (stored in state) and 'label' (displayed to user)
  // ===============================================
  
  // Drawing type options (2 choices)
  // id: string identifier stored in database
  // label: Thai/English text displayed to user
  const drawingOptions = [
    { id: 1, label: "Drawing (New Model)" },
    { id: 2, label: "Drawing (New Product)" },
  ];

  // Product type options (3 choices in Thai)
  // id: numeric identifier (1, 2, 3)
  // label: Thai product type name
  const typeOptions = [
    { id: 1, label: "ดิสเบรก" },    // Disc brake
    { id: 2, label: "ก้ามเบรก" },   // Brake caliper
    { id: 3, label: "ผ้าเบรก" },    // Brake pad
  ];

  // Intensive level options (3 choices)
  // id: numeric identifier (1, 2, 3)
  // label: Intensive level name
  const intensiveOptions = [
    { id: 1, label: "Intensive 00" },
    { id: 2, label: "Intensive 01" },
    { id: 3, label: "Master" },
  ];

  // Document format options (6 choices)
  // id: numeric identifier (1-6)
  // label: Document format name (mixed Thai/English)
  const documenttypeOptions = [
    { id: 1, label: "File CAD" },
    { id: 2, label: "File PDF" },
    { id: 3, label: "Paper File" },
    { id: 4, label: "Catalog" },
    { id: 5, label: "ฉบับ A3" },   // A3 size
    { id: 6, label: "ฉบับ A4" },   // A4 size
  ];

  // ===============================================
  // EVENT HANDLERS
  // ===============================================

  /**
   * Handles changes to basic form inputs
   * @param {string} field - The name of the field to update
   * @param {string} value - The new value
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Handles checkbox toggle (add/remove ID from selection array)
   * NOW USES ID INSTEAD OF LABEL
   * @param {function} setter - State setter function
   * @param {array} currentArray - Current selected IDs
   * @param {string|number} id - The ID to toggle (not the label)
   */
  const handleCheckboxChange = (setter, currentArray, id) => {
    setter(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)  // Remove if already selected
        : [...prev, id]                     // Add if not selected
    );
  };

  /**
   * Handles changes to schedule table inputs
   * @param {number} index - Row index to update
   * @param {string} field - Field name (request_date or expected_date)
   * @param {string} value - New value
   */
  const handleScheduleChange = (index, field, value) => {
    setScheduleRows(prev => 
      prev.map((row, i) => 
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  /**
   * Adds a new empty row to the schedule table
   * The new row's index is automatically calculated as length + 1
   */
  const addScheduleRow = () => {
    setScheduleRows(prev => [
      ...prev,
      { 
        index: prev.length + 1,    // Next sequential number
        request_date: '',           // Empty date field
        expected_date: ''           // Empty read-only field
      }
    ]);
  };

  /**
   * Removes a row from the schedule table
   * Automatically re-indexes remaining rows to keep sequential numbering
   * @param {number} index - Index of row to remove
   */
  const removeScheduleRow = (index) => {
    // Only allow removal if more than 1 row exists
    if (scheduleRows.length > 1) {
      setScheduleRows(prev => {
        // Filter out the row at the specified index
        const filtered = prev.filter((_, i) => i !== index);
        // Re-index: update the 'index' property to be sequential (1, 2, 3...)
        return filtered.map((row, i) => ({ ...row, index: i + 1 }));
      });
    }
  };

  /**
   * Handles form submission
   * Transforms all form data into the structure expected by the API
   * NOW SENDS IDs TO THE API INSTEAD OF LABELS
   */
  const handleSubmit = async () => {
      // ❌ Stop here if validation fails
      // ❌ Stop here if validation fails
        if (!validateForm()) return;
    try {
      setLoading(true)
      // ===============================================
      // TRANSFORM CHECKBOX DATA TO API FORMAT
      // We now send IDs instead of labels
      // ===============================================
      
      // Convert selected drawing type IDs to array of objects
      // selectedDrawings contains IDs: ["new-model", "new-product"]
      // Transform to: [{document_type_id: "new-model"}, {document_type_id: "new-product"}]
      const documenttypeitems = selectedDrawings.map(document_type_id => ({
        document_type_id  // Send ID to API
      }));

      // Convert product type IDs
      // selectedProductTypes contains IDs: [1, 2, 3]
      // Transform to: [{product_type_id: 1}, {product_type_id: 2}, ...]
      const productTypeitems = selectedProductTypes.map(product_type_id => ({
        product_type_id   // Send numeric ID to API
      }));

      // Convert intensive selection IDs
      // selectedIntensive contains IDs: [1, 2, 3]
      // Transform to: [{drawing_document_type_id: 1}, ...]
      const drawingDocumenttypeitems = selectedIntensive.map(drawing_document_type_id => ({
        drawing_document_type_id  // Send numeric ID to API
      }));

      // Convert document format IDs
      // selectedDocumentTypes contains IDs: [1, 2, 3, 4, 5, 6]
      // Transform to: [{drawing_type_id: 1}, {drawing_type_id: 2}, ...]
      const drawingtypeitems = selectedDocumentTypes.map(drawing_type_id => ({
        drawing_type_id   // Send numeric ID to API
      }));

      // ===============================================
      // TRANSFORM SCHEDULE DATA TO API FORMAT
      // ===============================================
      
      // Filter out empty rows (where both dates are empty)
      // Then transform to API structure with sequential IDs
      // expected_date is already in yyyy-mm-dd format from date input
      const requestDateitems = scheduleRows
        .filter(row => row.request_date || row.expected_date)  // Only include rows with at least one date
        .map((row, index) => ({
          request_date_item_id: index + 1,           // Sequential ID starting from 1
          request_date: row.request_date || null,    // User input date (editable)
          expected_date: row.expected_date || null   // Completion date (read-only, yyyy-mm-dd format)
        }));

      // ===============================================
      // CONSTRUCT FINAL PAYLOAD
      // ===============================================
      
      // Wrap basic form data in array as required by API
      const payload = {
        requestItems: [{
          request_at: formData.request_at,
          department: formData.department,
          request_no: formData.request_no,
          part_no: formData.part_no,
          customer_name: formData.customer_name,
          detail: formData.detail,
          request_remark: formData.request_remark
        }],
        documenttypeitems,              // Array of {document_type_id: "..."}
        productTypeitems,               // Array of {product_type_id: 1}
        drawingDocumenttypeitems,       // Array of {drawing_document_type_id: 1}
        drawingtypeitems,               // Array of {drawing_type_id: 1}
        requestDateitems             // Array of {request_date_item_id, request_date, expected_date}
      };

      console.log('Form submission payload:', payload);
      const result = await postRequest(payload);
      message.success(result.msg);
      resetForm()
      load()
      /* Example payload structure with IDs:
      {
        requestData: [{
          request_at: "2026-01-27",
          department: "Engineering",
          request_no: "DR-001",
          part_no: "P-12345",
          customer_name: "ABC Corp",
          detail: "Additional details...",
          request_remark: "Special notes..."
        }],
        documenttypeitemData: [
          { document_type_id: "new-model" },
          { document_type_id: "new-product" }
        ],
        productTypeitemData: [
          { product_type_id: 1 },  // ดิสเบรก
          { product_type_id: 2 }   // ก้ามเบรก
        ],
        drawingDocumenttypeitemData: [
          { drawing_document_type_id: 3 }  // Master
        ],
        drawingtypeitemData: [
          { drawing_type_id: 1 },  // File CAD
          { drawing_type_id: 2 }   // File PDF
        ],
        requestDateitemData: [
          { request_date_item_id: 1, request_date: "2026-02-01", expected_date: "2026-02-15" },
          { request_date_item_id: 2, request_date: "2026-03-01", expected_date: "2026-03-15" }
        ]
      }
      */
      
      // Uncomment to actually submit to API:
      // await submitDrawingRequest(payload);
      
      // navigate('/new/drawingrequest');
    } catch (err) {
      console.error('Submission error:', err);
      message.error('Failed to submit drawing request');
    }finally{
        setLoading(false)
    }
  };
  const resetForm = () => {
    setFormData({
      request_at: getCurrentDate(),
      department: '',
      request_no: requestnoData,   // will be set again from next_request_no
      part_no: '',
      customer_name: '',
      detail: '',
      request_remark: ''
    });
  
    setSelectedDrawings([]);
    setSelectedProductTypes([]);
    setSelectedIntensive([]);
    setSelectedDocumentTypes([]);
  
    setScheduleRows([
      {
        index: 1,
        request_date: '',
        expected_date: ''
      }
    ]);
  };
  const validateForm = () => {
    if (!formData.request_at) {
      message.warning('กรุณาเลือกวันที่ขอ');
      return false;
    }
  
    if (!formData.department.trim()) {
      message.warning('กรุณากรอกฝ่าย / แผนก');
      return false;
    }
  
    if (!formData.request_no) {
      message.warning('ไม่พบเลขที่ใบขอ');
      return false;
    }
  
    if (selectedDrawings.length === 0) {
      message.warning('กรุณาเลือกประเภท Drawing');
      return false;
    }
  
    if (selectedProductTypes.length === 0) {
      message.warning('กรุณาเลือกประเภทสินค้า');
      return false;
    }
  
    if (selectedDocumentTypes.length === 0) {
      message.warning('กรุณาเลือกรูปแบบ Drawing');
      return false;
    }
  
    return true; // ✅ all passed
  };
  
  
  // ===============================================
  // LOADING STATE
  // Show spinner while fetching data
  // ===============================================
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // ===============================================
  // MAIN RENDER
  // ===============================================
  return (
    <>
      {/* ===============================================
          PRINT STYLES
          These styles ensure proper A4 printing
          =============================================== */}
      <style>
        {`
          /* Define A4 page size for printing */
          @page {
            size: A4;
            margin: 0;
          }

          /* Print-specific styles */
          @media print {
            body {
              margin: 0;
              padding: 0;
              background: white;
            }

            /* Hide everything by default */
            body * {
              visibility: hidden;
            }

            /* Show only the A4 page content */
            .a4-page,
            .a4-page * {
              visibility: visible;
            }

            /* Position A4 page at top-left for printing */
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

            /* Hide elements with print:hidden class */
            .print\\:hidden {
              display: none !important;
            }

            /* Hide elements with no-print class (buttons, delete column) */
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      {/* ===============================================
          A4 FORM CONTAINER
          Exact A4 dimensions (210mm x 297mm)
          =============================================== */}
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
        {/* ===============================================
            HEADER SECTION
            Company logo and document code
            =============================================== */}
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

        {/* ===============================================
            BASIC INFO SECTION
            3-column grid: Request date, Department, Request number
            =============================================== */}
        <div className="grid grid-cols-3 gap-1 mb-1">
          <div>
            <div className="font-semibold mb-0.5">วันที่ขอ</div>
            <input
              type="date"
              value={formData.request_at}
              onChange={(e) => handleInputChange('request_at', e.target.value)}
              className="border border-black w-full px-1 py-0.5"
              style={{ height: '22px' }}
              readOnly
            />
          </div>
          <div>
            <div className="font-semibold mb-0.5">ฝ่าย / แผนก / หน่วยงาน</div>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="border border-black w-full px-1 py-0.5"
              style={{ height: '22px' }}
              required
            />
          </div>
          <div>
            <div className="font-semibold mb-0.5">ใบขอเลขที่</div>
            <input
              type="text"
              value={formData.request_no}
              onChange={(e) => handleInputChange('request_no', e.target.value)}
              className="border border-black w-full px-1 py-0.5"
              style={{ height: '22px' }}
              readOnly
            />
          </div>
        </div>

        {/* ===============================================
            DRAWING REQUEST SECTION
            Contains 3 subsections: Drawing type, Product type, Intensive
            NOW USING IDs FOR CHECKED STATE
            =============================================== */}
        <div className="border border-black p-1 mb-1">
          {/* Drawing type checkboxes (New Model/New Product)
              - Displays label to user
              - Stores/checks against id in state
              - onChange passes item.id (not item.label) */}
          <div className="font-semibold mb-0.5">Drawing ที่ต้องการขอ</div>
          <div className="grid grid-cols-2 gap-1 mb-0.5">
            {drawingOptions.map((item) => (
              <label key={item.id} className="flex gap-1 items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3 h-3 cursor-pointer"
                  checked={selectedDrawings.includes(item.id)}  // Check if ID is in array
                  onChange={() => handleCheckboxChange(setSelectedDrawings, selectedDrawings, item.id)}  // Pass ID
                  required
                />
                {item.label}  {/* Display label to user */}
                
              </label>
            ))}
          </div>

          {/* Product type checkboxes (ดิสเบรก/ก้ามเบรก/ผ้าเบรก)
              - Displays Thai label to user
              - Stores/checks against numeric id (1, 2, 3) */}
          <div className="mb-0.5">
            <div className="font-semibold">ประเภท</div>
            <div className="flex gap-2">
              {typeOptions.map((item) => (
                <label key={item.id} className="flex gap-1 items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3 h-3 cursor-pointer"
                    checked={selectedProductTypes.includes(item.id)}  // Check if numeric ID is in array
                    onChange={() => handleCheckboxChange(setSelectedProductTypes, selectedProductTypes, item.id)}  // Pass numeric ID
                  />
                  {item.label}  {/* Display Thai label */}
                </label>
              ))}
            </div>
          </div>

          {/* Intensive level checkboxes
              - Displays label to user (Intensive 00/01/Master)
              - Stores/checks against numeric id (1, 2, 3) */}
          <div>
            <div className="font-semibold">Intensive</div>
            <div className="flex gap-2">
              {intensiveOptions.map((item) => (
                <label key={item.id} className="flex gap-1 items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3 h-3 cursor-pointer"
                    checked={selectedIntensive.includes(item.id)}  // Check if numeric ID is in array
                    onChange={() => handleCheckboxChange(setSelectedIntensive, selectedIntensive, item.id)}  // Pass numeric ID
                  />
                  {item.label}  {/* Display label */}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ===============================================
            DRAWING FORMAT SECTION
            Document format checkboxes (CAD/PDF/Paper/etc.)
            NOW USING IDs FOR CHECKED STATE
            =============================================== */}
        <div className="border border-black p-1 mb-1">
          <div className="font-semibold mb-0.5">รูปแบบ Drawing</div>
          <div className="grid grid-cols-3 gap-1">
            {/* Each checkbox:
                - Shows label (File CAD, File PDF, etc.)
                - Stores numeric id (1-6) in state
                - Sends numeric id to API */}
            {documenttypeOptions.map((item) => (
              <label key={item.id} className="flex gap-1 items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3 h-3 cursor-pointer"
                  checked={selectedDocumentTypes.includes(item.id)}  // Check if numeric ID (1-6) is in array
                  onChange={() => handleCheckboxChange(setSelectedDocumentTypes, selectedDocumentTypes, item.id)}  // Pass numeric ID
                />
                {item.label}  {/* Display label */}
              </label>
            ))}
          </div>
        </div>

        {/* ===============================================
            PART INFO SECTION
            2-column grid: Part number and Customer name
            =============================================== */}
        <div className="grid grid-cols-2 gap-1 mb-1">
          <div>
            <div className="font-semibold mb-0.5">Part No.</div>
            <input
              type="text"
              value={formData.part_no}
              onChange={(e) => handleInputChange('part_no', e.target.value)}
              className="border border-black w-full px-1 py-0.5"
              style={{ height: '22px' }}
            />
          </div>
          <div>
            <div className="font-semibold mb-0.5">ลูกค้าระบุ</div>
            <input
              type="text"
              value={formData.customer_name}
              onChange={(e) => handleInputChange('customer_name', e.target.value)}
              className="border border-black w-full px-1 py-0.5"
              style={{ height: '22px' }}
            />
          </div>
        </div>

        {/* ===============================================
            SCHEDULE TABLE SECTION
            Dynamic table with add/remove functionality
            - request_date: User can edit (when they want it)
            - expected_date: Read-only (actual completion date in yyyy-mm-dd format)
            =============================================== */}
        <div className="mb-1">
          {/* Header with title and Add button */}
          <div className="flex justify-between items-center mb-0.5">
            <div className="font-semibold">กำหนดการดำเนินการ</div>
            {/* Add row button - hidden when printing */}
            <button
              onClick={addScheduleRow}
              className="no-print px-2 py-0.5 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 flex items-center gap-1"
              type="button"
            >
              <span className="text-sm font-bold">+</span> เพิ่มแถว
            </button>
          </div>
          
          <table className="text-center w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-0.5 w-[40px]">ครั้งที่</th>
                <th className="border border-black p-0.5">ต้องการภายในวันที่</th>
                <th className="border border-black p-0.5">ดำเนินการแล้วเสร็จ</th>
                {/* Delete column - hidden when printing */}
                <th className="border border-black p-0.5 w-[40px] no-print">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {scheduleRows.map((row, index) => (
                <tr key={row.index}>
                  {/* Sequential row number (1, 2, 3...) */}
                  <td className="border border-black text-center p-0.5">{row.index}</td>
                  
                  {/* Request date - EDITABLE date picker
                      User selects when they want the drawing completed
                      Format: yyyy-mm-dd (automatic from date input) */}
                  <td className="border border-black p-0.5">
                    <input
                      type="date"
                      value={row.request_date}
                      onChange={(e) => handleScheduleChange(index, 'request_date', e.target.value)}
                      className="w-full text-center outline-none"
                    />
                  </td>
                  
                  {/* Expected date - READ-ONLY text field
                      WHY READ-ONLY:
                      - This represents the ACTUAL completion date
                      - Only admin/system should set this, not the requester
                      - It's filled in later after work is completed
                      - Format is strictly yyyy-mm-dd for database consistency
                      
                      VISUAL INDICATORS:
                      - Gray background (bg-gray-50) shows it's disabled
                      - Not-allowed cursor on hover
                      - Placeholder shows expected format */}
                  <td className="border border-black p-0.5">
                    <input
                      type="text"
                      value={row.expected_date}
                      readOnly  // CRITICAL: Prevents user from editing
                      className="w-full text-center outline-none bg-gray-50 cursor-not-allowed"
                      placeholder="yyyy-mm-dd"  // Shows expected format
                    />
                  </td>
                  
                  {/* Delete button - only show if more than 1 row exists
                      Hidden when printing
                      Removes row and re-indexes remaining rows */}
                  <td className="border border-black p-0.5 no-print">
                    {scheduleRows.length > 1 && (
                      <button
                        onClick={() => removeScheduleRow(index)}
                        className="text-red-600 hover:text-red-800 font-bold text-lg"
                        type="button"
                        title="ลบแถวนี้"
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===============================================
            REMARKS SECTION
            Two text areas: Detail and Remark
            =============================================== */}
        <div className="mb-1">
          {/* Additional details textarea
              For extra information about the drawing request */}
          <div className="font-semibold mb-0.5">รายละเอียดเพิ่มเติม / Detail</div>
          <textarea
            value={formData.detail}
            onChange={(e) => handleInputChange('detail', e.target.value)}
            className="border border-black w-full px-1.5 py-1 text-[13px] resize-none"
            style={{ height: '45px' }}
          />
          
          {/* Remarks textarea
              For notes, special instructions, or comments */}
          <div className="font-semibold mb-0.5">หมายเหตุ / Remark</div>
          <textarea
            value={formData.request_remark}
            onChange={(e) => handleInputChange('request_remark', e.target.value)}
            className="border border-black w-full px-1.5 py-1 text-[13px] resize-none"
            style={{ height: '45px' }}
          />
        </div>
        <div className="flex justify-center gap-2 mt-4 mb-4 print:hidden">
        {/* Back button - navigates to drawing request list page */}
        <button
          onClick={() => navigate('/new/drawingrequest')}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
        
        {/* Submit button - calls handleSubmit()
            Transforms form data and sends IDs (not labels) to API
            Validates and structures data according to API requirements */}
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Submit
        </button>
        
        
    
      </div>
      </div>

      
    </>
  );
}