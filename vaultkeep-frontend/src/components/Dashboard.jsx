import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [secrets, setSecrets] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Retrieve the token from local storage
  const token = localStorage.getItem('token');

  // Configure axios to always send the JWT token in the headers
  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  useEffect(() => {
    // If no token exists, send user back to login
    if (!token) {
      navigate('/login');
    } else {
      fetchSecrets();
    }
  }, [navigate, token]);

  const fetchSecrets = async () => {
    try {
      // This calls the backend, which identifies the user via JWT and decrypts their specific data
      const response = await axios.get('http://localhost:8080/api/secrets/my-secrets', axiosConfig);
      setSecrets(response.data);
    } catch (err) {
      setError('Failed to fetch secrets. Your session may have expired.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const newSecret = { title, encryptedContent: content };
      
      // Post to the backend; encryption happens on the server before MySQL storage
      await axios.post('http://localhost:8080/api/secrets/add', newSecret, axiosConfig);
      
      setTitle('');
      setContent('');
      fetchSecrets(); // Re-fetch the list to show the new decrypted document immediately
    } catch (err) {
      setError('Failed to save the secret.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Secure Vault</h2>
        <button 
          onClick={handleLogout} 
          style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Form to Add New Data */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h3>Add New Secret</h3>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Document Title (e.g., Bank Passwords)" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <textarea 
            placeholder="Sensitive Content..." 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
            rows="4"
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Encrypt & Save to MySQL
          </button>
        </form>
      </div>

      <hr style={{ margin: '30px 0' }} />

      {/* Display the Decrypted Documents */}
      <h3>Your Decrypted Documents</h3>
      {secrets.length === 0 ? (
        <p>No secrets found. Add one above!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {secrets.map((secret) => (
            <div key={secret.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{secret.title}</h4>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                <strong>Decrypted Content:</strong> <br/>
                {secret.encryptedContent}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;