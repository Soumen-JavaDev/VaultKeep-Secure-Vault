import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Decide which backend endpoint to call based on the current view
    const endpoint = isLoginView ? '/api/auth/login' : '/api/auth/register';
    const url = `http://localhost:8080${endpoint}`;

    try {
      const response = await axios.post(url, { username, password });

      if (isLoginView) {
        // 1. Save the secure JWT token to the browser
        localStorage.setItem('token', response.data.token);
        // 2. Redirect the user to their secure vault
        navigate('/dashboard');
        // 3. Force a page reload to update the router state
        window.location.reload(); 
      } else {
        // Registration was successful, switch back to login view
        setMessage('Registration successful! Please log in.');
        setIsLoginView(true);
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      // Handle errors (like wrong password or username already taken)
      setMessage(isLoginView ? 'Invalid username or password.' : 'Username might be taken.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>{isLoginView ? 'Login to VaultKeep' : 'Register for VaultKeep'}</h2>
      
      {message && (
        <p style={{ textAlign: 'center', color: isLoginView && message.includes('successful') ? 'green' : 'red' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLoginView ? 'Login' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        {isLoginView ? "Don't have an account? " : "Already have an account? "}
        <button 
          onClick={() => { setIsLoginView(!isLoginView); setMessage(''); }}
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
        >
          {isLoginView ? 'Register here' : 'Login here'}
        </button>
      </p>
    </div>
  );
};

export default Login;