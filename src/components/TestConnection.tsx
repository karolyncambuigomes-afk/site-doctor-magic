import React from 'react';

const TestConnection: React.FC = () => {
  const testConnection = () => {
    console.log('Connection test:', {
      domain: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port,
      href: window.location.href,
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      timestamp: new Date().toISOString()
    });
  };

  React.useEffect(() => {
    testConnection();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace',
      backgroundColor: '#f0f0f0',
      margin: '20px',
      borderRadius: '8px'
    }}>
      <h2>🔍 Connection Diagnostic</h2>
      <p><strong>Status:</strong> React app is working ✅</p>
      <p><strong>Domain:</strong> {window.location.hostname}</p>
      <p><strong>URL:</strong> {window.location.href}</p>
      <p><strong>Protocol:</strong> {window.location.protocol}</p>
      <p><strong>Online:</strong> {navigator.onLine ? 'Yes' : 'No'}</p>
      <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
      
      <button 
        onClick={testConnection}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Run Test Again
      </button>
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        If you can see this page, your React app is working. 
        The "refused to connect" error was likely temporary.
      </div>
    </div>
  );
};

export default TestConnection;