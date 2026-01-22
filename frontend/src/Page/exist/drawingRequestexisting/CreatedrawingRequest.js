import React, { useState, useEffect } from 'react';
import { fetchDrawingrequestrequestno, postDrawingRequest } from '../../../๊Ultility/exist/drawingRequest';
import { fetchDocumentitems } from '../../../๊Ultility/exist/documentItems';
import Notification from '../../../component/Notification';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
export default function RequestForm() {
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState('');
    const [notification, setNotification] = useState(null);
    const [requestItemOptions, setRequestItemOptions] = useState([]);
    const navigate = useNavigate();
    const load = async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch request number
            const response = await fetchDrawingrequestrequestno();
            // console.log("data", response.data[0].next_request_no);
            setRowData(response.data[0].next_request_no);
            
            // Fetch document items
            const documentItems = await fetchDocumentitems();
            // console.log("documentItems", documentItems.data);
            
            // Store the complete document items with both document_no and document_name
            setRequestItemOptions(documentItems.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Initial Fetch on first open
    useEffect(() => {
        load();
    }, []);

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        request_no: rowData || '',
        request_at: getCurrentDate(),
        department: '',
        detail: '',
        reason: '',
        status: 1,
        request_by: '',
        request_item: []
    });

    // Update request_no when rowData is loaded
    useEffect(() => {
        if (rowData) {
            setFormData(prev => ({
                ...prev,
                request_no: rowData
            }));
        }
    }, [rowData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (item) => {
        setFormData(prev => {
            // Check if this item is already in the array (by document_no)
            const existingIndex = prev.request_item.findIndex(
                i => i.document_no === item.document_no
            );
            
            if (existingIndex > -1) {
                // Remove if already exists
                return {
                    ...prev,
                    request_item: prev.request_item.filter(i => i.document_no !== item.document_no)
                };
            } else {
                // Add if doesn't exist
                return {
                    ...prev,
                    request_item: [...prev.request_item, {
                        document_no: item.document_no,
                        document_name: item.document_name
                    }]
                };
            }
        });
    };

    const isItemChecked = (item) => {
        return formData.request_item.some(i => i.document_no === item.document_no);
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.department || !formData.detail) {
            showNotification('กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
            return;
        }
        // console.log("Submitted data:", formData);
        setLoading(true);
        try {
            const result = await postDrawingRequest(formData);
            showNotification(result.msg, 'success');
            load()
            // console.log("Submitted data:", result);
            // Optionally reset form after successful submission
            // handleReset();
            handleReset()
        } catch (error) {
            showNotification(error.message, 'warning');
        } finally {
            setLoading(false); 
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const organizedColumns = [[], [], [], []];
    requestItemOptions.forEach((doc) => {
      const columnIndex = (doc.document_no - 1) % 4;
      organizedColumns[columnIndex].push(doc);
    });
    const documents = organizedColumns.flat();

    const handleReset = () => {
        setFormData({
            request_no: rowData || '',
            request_at: getCurrentDate(),
            department: '',
            detail: '',
            reason: '',
            status: 1,
            request_by: '',
            request_item: []
        });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div style={{ color: 'red', fontSize: '14px' }}>Error: {error}</div>
            </div>
        );
    }

    return (
        <div style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', padding: '10mm 15mm', background: 'white' }}>
            {/* Header */}
            <div style={{ position: 'relative', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '8px' }}>
                <div style={{ position: 'absolute', left: 0, top: 0 }}>
                    <img src="https://www.compact-brake.com/images/LOGO_COMPACT-03%207.png" alt="Logo" style={{ height: '20px', width: 'auto' }} />
                </div>
                <div style={{ position: 'absolute', right: 0, top: 0, fontSize: '10px' }}>
                    รหัสเอกสาร : G/PDS/FM-05(0)
                </div>
                <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                    ใบขอ Drawing เพื่อใช้งาน
                </h1>
            </div>

            <div>
                {/* Basic Info */}
                <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '10px', marginBottom: '2px' }}>ใบขอเลขที่</div>
                            <input
                                type="text"
                                name="request_no"
                                value={formData.request_no}
                                onChange={handleInputChange}
                                readOnly 
                                style={{ border: '1px solid #000', padding: '4px 6px', fontSize: '10px', height: '26px', width: '100%' }}
                            />
                        </div>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '10px', marginBottom: '2px' }}>วันที่ขอ</div>
                            <input
                                type="date"
                                name="request_at"
                                value={formData.request_at}
                                onChange={handleInputChange}
                                readOnly
                                style={{ border: '1px solid #000', padding: '4px 6px', fontSize: '10px', height: '26px', width: '100%' }}
                            />
                        </div>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '10px', marginBottom: '2px' }}>ฝ่าย / แผนก / หน่วยงาน</div>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                style={{ border: '1px solid #000', padding: '4px 6px', fontSize: '10px', height: '26px', width: '100%' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Request Items Checkboxes */}
                <div style={{ border: '1px solid #000', marginBottom: '8px', padding: '6px' }}>
                    <div style={{ fontWeight: '600', fontSize: '12px', marginBottom: '5px' }}>ประเภทที่ขอ</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', fontSize: '14px' }}>
                        {documents.map((item) => (
                            <label key={item.document_no} style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={isItemChecked(item)}
                                    onChange={() => handleCheckboxChange(item)}
                                    style={{ width: '9px', height: '9px', margin: 0 }}
                                />
                                {item.document_name}
                            </label>
                        ))}
                    </div>
                </div>

                {/* <div className="grid grid-cols-4 gap-x-2 gap-y-1 text-[14px]">
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
                </div> */}

                {/* Detail */}
                <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '2px' }}>รายละเอียดที่ขอ / Detail</div>
                    <textarea
                        name="detail"
                        value={formData.detail}
                        onChange={handleInputChange}
                        style={{ border: '1px solid #000', height: '150px', padding: '4px 6px', fontSize: '13px', width: '100%', resize: 'none' }}
                    />
                </div>

                {/* Remark */}
                <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '2px' }}>หมายเหตุ / Remark</div>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        style={{ border: '1px solid #000', height: '100px', padding: '4px 6px', fontSize: '13px', width: '100%', resize: 'none' }}
                    />
                </div>

                {/* Submit Buttons */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                        onClick={() => navigate('/exist/drawingrequest')}
                        disabled={loading}
                        style={{ 
                            padding: '8px 24px', 
                            background: '#e5e7eb', 
                            color: '#374151', 
                            border: 'none', 
                            borderRadius: '4px', 
                            fontSize: '14px', 
                            cursor: loading ? 'not-allowed' : 'pointer' 
                        }}
                    >
                        Back
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{ 
                            padding: '8px 24px', 
                            background: loading ? '#9ca3af' : '#2563eb', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            fontSize: '14px', 
                            cursor: loading ? 'not-allowed' : 'pointer' 
                        }}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={loading}
                        style={{ 
                            padding: '8px 24px', 
                            background: '#e5e7eb', 
                            color: '#374151', 
                            border: 'none', 
                            borderRadius: '4px', 
                            fontSize: '14px', 
                            cursor: loading ? 'not-allowed' : 'pointer' 
                        }}
                    >
                        Reset
                    </button>
          
                </div>
                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </div>
        </div>
    );
}