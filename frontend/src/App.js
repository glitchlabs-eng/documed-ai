import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState(null);
  const [loading, setLoading] = useState(true);

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

          <div className="cta-section">
            <button className="cta-button">
              Start Extraction
            </button>
            <p className="cta-note">
              Upload your medical documents to begin
            </p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
