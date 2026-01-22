import React from 'react';
import { Spin } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';

const Modaldrawingresponse = ({ show, onHide, data, requestItem, urlData, Tablename, loadingItems }) => {
  if (!show) return null;

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'warning',
      'Approved': 'success',
      'Rejected': 'danger',
      'Completed': 'info',
      'In Progress': 'primary',
      'Draft': 'secondary'
    };
    const color = statusColors[status] || 'secondary';
    return <span className={`badge bg-${color}`}>{status}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div 
      className={`modal fade ${show ? 'show d-block' : ''}`} 
      style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="bi bi-file-earmark-text me-2"></i>
              {Tablename} - Details
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>
          
          {/* Modal Body */}
          <div className="modal-body">
            {data ? (
              <>
                {/* Main Information Section */}
                <div className="mb-4">
                  <h5 className="border-bottom pb-2 mb-3">
                    <i className="bi bi-info-circle me-2"></i>
                    Request Information
                  </h5>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <strong className="text-primary">Request No:</strong>
                        <div className="ms-2">{data.request_no || 'N/A'}</div>
                      </div>
                      <div className="mb-3">
                        <strong className="text-primary">Request Date:</strong>
                        <div className="ms-2">{formatDate(data.request_at)}</div>
                      </div>
                      <div className="mb-3">
                        <strong className="text-primary">Department:</strong>
                        <div className="ms-2">
                          <span className="badge bg-light text-dark">
                            {data.department || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong className="text-primary">Requested By:</strong>
                        <div className="ms-2">
                          <i className="bi bi-person me-1"></i>
                          {data.requester_username || 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="mb-3">
                        <strong className="text-primary">Response Date:</strong>
                        <div className="ms-2">{formatDate(data.created_at_sender_person)}</div>
                      </div>
                      <div className="mb-3">
                        <strong className="text-primary">Response By:</strong>
                        <div className="ms-2">
                          <i className="bi bi-person-check me-1"></i>
                          {data.sender_username || 'N/A'}
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong className="text-primary">Status:</strong>
                        <div className="ms-2 mt-1">{getStatusBadge(data.status_name)}</div>
                      </div>
                      <div className="mb-3">
                        <strong className="text-primary">Request ID:</strong>
                        <div className="ms-2">
                          <code>#{data.request_id}</code>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  {data.detail && (
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <strong className="text-primary">
                            <i className="bi bi-card-text me-2"></i>
                            Detail:
                          </strong>
                          <div className="bg-light border rounded p-3 mt-2">
                            {data.detail}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {data.reason && (
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <strong className="text-primary">
                            <i className="bi bi-chat-left-text me-2"></i>
                            Remark:
                          </strong>
                          <div className="bg-light border rounded p-3 mt-2">
                            {data.reason}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Request Items Section */}
                <div>
                  <h5 className="border-bottom pb-2 mb-3">
                    <i className="bi bi-list-ul me-2"></i>
                    ประเภทที่ขอ
                  </h5>
                  
                  {loadingItems ? (
                    <div className="text-center py-4">
                      <Spin size="large" />
                      <p className="mt-3 text-muted">Loading items...</p>
                    </div>
                  ) : requestItem && requestItem.length > 0 ? (
                    <>
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover">
                          <thead className="table-dark">
                            <tr>
                              <th style={{ width: '60px' }} className="text-center">No.</th>
                              <th>เลขขอที่</th>
                              <th>ประเภทที่ขอ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {requestItem.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">
                                  <span className="badge bg-secondary">{index + 1}</span>
                                </td>
                                <td>
                                  <code>{item.request_no || 'N/A'}</code>
                                </td>
                                <td>{item.document_name || item.document_name || 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Summary */}
                      <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded">
                        <div>
                          <strong>Total Items:</strong>
                          <span className="badge bg-info ms-2">{requestItem.length}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted py-5 bg-light rounded">
                      <div style={{ fontSize: '3rem' }}>📋</div>
                      <p className="mt-3 mb-0">No items found for this request</p>
                    </div>
                  )}
                </div>
                {/* url Items Section */}
                <div>
                  <h5 className="border-bottom pb-2 mb-3">
                    <i className="bi bi-list-ul me-2"></i>
                    URL
                  </h5>
                  
                  {loadingItems ? (
                    <div className="text-center py-4">
                      <Spin size="large" />
                      <p className="mt-3 text-muted">Loading items...</p>
                    </div>
                  ) : urlData && urlData.length > 0 ? (
                    <>
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover">
                          <thead className="table-dark">
                            <tr>
                              <th style={{ width: '60px' }} className="text-center">No.</th>
                              <th>เลขขอที่</th>
                              <th>ประเภทที่ขอ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {urlData.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">
                                  <span className="badge bg-secondary">{index + 1}</span>
                                </td>
                                <td>
                                  <code>{item.request_no || 'N/A'}</code>
                                </td>
                                <td>{item.path || 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Summary */}
                      <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded">
                        <div>
                          <strong>Total Items:</strong>
                          <span className="badge bg-info ms-2">{urlData.length}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted py-5 bg-light rounded">
                      <div style={{ fontSize: '3rem' }}>📋</div>
                      <p className="mt-3 mb-0">No items found for this request</p>
                    </div>
                  )}
                </div>

              </>
            ) : (
              <div className="text-center text-muted py-5">
                <p>No data available</p>
              </div>
            )}
          </div>
          
          {/* Modal Footer */}
          <div className="modal-footer bg-light">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onHide}
            >
              <i className="bi bi-x-circle me-1"></i>
              Close
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={() => window.print()}
            >
              <i className="bi bi-printer me-1"></i>
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modaldrawingresponse;