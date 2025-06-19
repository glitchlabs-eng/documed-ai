import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);

  useEffect(() => {
    // Check backend connection
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://documed-ai-backend.onrender.com';

    fetch(`${backendUrl}/api/status`)
      .then(response => response.json())
      .then(data => {
        setBackendStatus(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Backend connection failed:', error);
        setLoading(false);
      });
  }, []);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setExtractionResult(null);
      } else {
        alert('Please select a PDF, JPG, or PNG file');
      }
    }
  };

  // Handle file upload and extraction
  const handleExtraction = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://documed-ai-backend.onrender.com';
      const response = await fetch(`${backendUrl}/api/extract`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setExtractionResult(result);
    } catch (error) {
      console.error('Extraction failed:', error);
      setExtractionResult({
        error: 'Extraction failed. Please try again.',
        details: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="glass-container">
          <h1 className="app-title">
            <span className="gradient-text">DocuMed AI</span>
          </h1>
          <p className="app-subtitle">
            Medical Data Extraction Platform
          </p>
          
          <div className="status-card">
            <h3>System Status</h3>
            {loading ? (
              <div className="loading">Checking backend connection...</div>
            ) : backendStatus ? (
              <div className="status-success">
                <p>✅ Backend Connected</p>
                <p>Service: {backendStatus.service}</p>
                <p>Status: {backendStatus.status}</p>
              </div>
            ) : (
              <div className="status-error">
                ❌ Backend Disconnected
              </div>
            )}
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <h4>🏥 Medical Data</h4>
              <p>Extract structured data from medical documents</p>
            </div>
            <div className="feature-card">
              <h4>🔒 Secure</h4>
              <p>Stateless processing with no data retention</p>
            </div>
            <div className="feature-card">
              <h4>⚡ Fast</h4>
              <p>Real-time processing and extraction</p>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="upload-section">
            <h3>📄 Upload Medical Document</h3>
            <div className="file-upload-area">
              <input
                type="file"
                id="file-input"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="file-input"
              />
              <label htmlFor="file-input" className="file-upload-label">
                {selectedFile ? (
                  <div className="file-selected">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">
                      ({Math.round(selectedFile.size / 1024)} KB)
                    </span>
                  </div>
                ) : (
                  <div className="file-placeholder">
                    <span className="upload-icon">📁</span>
                    <span>Click to select file or drag & drop</span>
                    <span className="file-types">PDF, JPG, PNG supported</span>
                  </div>
                )}
              </label>
            </div>

            <button
              className={`extraction-button ${!selectedFile ? 'disabled' : ''}`}
              onClick={handleExtraction}
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <>
                  <span className="spinner">⏳</span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="extract-icon">🔍</span>
                  Extract Medical Data
                </>
              )}
            </button>
          </div>

          {/* Extraction Results */}
          {extractionResult && (
            <div className="results-section">
              <h3>📊 Extraction Results</h3>
              <div className="results-card">
                {extractionResult.error ? (
                  <div className="error-result">
                    <span className="error-icon">❌</span>
                    <p>{extractionResult.error}</p>
                    {extractionResult.details && (
                      <p className="error-details">{extractionResult.details}</p>
                    )}
                  </div>
                ) : (
                  <div className="success-result">
                    <span className="success-icon">✅</span>
                    <p>{extractionResult.message}</p>

                    {extractionResult.data && (
                      <div className="extracted-data">
                        <div className="data-section">
                          <h4>📋 File Information</h4>
                          <div className="data-grid">
                            <div className="data-item">
                              <span className="label">File Name:</span>
                              <span className="value">{extractionResult.data.fileName}</span>
                            </div>
                            <div className="data-item">
                              <span className="label">File Size:</span>
                              <span className="value">{extractionResult.data.fileSize}</span>
                            </div>
                            <div className="data-item">
                              <span className="label">Processing Time:</span>
                              <span className="value">{extractionResult.data.processingTime}</span>
                            </div>
                            <div className="data-item">
                              <span className="label">Confidence:</span>
                              <span className="value confidence">{extractionResult.data.confidence}</span>
                            </div>
                          </div>
                        </div>

                        <div className="data-section">
                          <h4>👤 Patient Information</h4>
                          <div className="data-grid">
                            <div className="data-item">
                              <span className="label">Name:</span>
                              <span className="value">{extractionResult.data.patientInfo.name}</span>
                            </div>
                            <div className="data-item">
                              <span className="label">Date of Birth:</span>
                              <span className="value">{extractionResult.data.patientInfo.dateOfBirth}</span>
                            </div>
                            <div className="data-item">
                              <span className="label">Patient ID:</span>
                              <span className="value">{extractionResult.data.patientInfo.patientId}</span>
                            </div>
                          </div>
                        </div>

                        <div className="data-section">
                          <h4>🏥 Medical Data</h4>
                          <div className="data-grid">
                            <div className="data-item">
                              <span className="label">Diagnosis:</span>
                              <span className="value">{extractionResult.data.medicalData.diagnosis}</span>
                            </div>
                            <div className="data-item">
                              <span className="label">Medications:</span>
                              <span className="value">{extractionResult.data.medicalData.medications}</span>
                            </div>
                            <div className="data-item">
                              <span className="label">Vital Signs:</span>
                              <span className="value">{extractionResult.data.medicalData.vitals}</span>
                            </div>
                            <div className="data-item">
                              <span className="label">Procedures:</span>
                              <span className="value">{extractionResult.data.medicalData.procedures}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="result-note">{extractionResult.note}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
