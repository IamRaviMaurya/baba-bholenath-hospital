import React, { useState } from 'react';
import { useHMS } from '../HMSContext';
import { User, Lock } from 'lucide-react';

function Login() {
  const { dispatch } = useHMS();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      dispatch({ type: 'LOGIN', payload: { username } });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="hms-login-shell">
      <div className="hms-login-card">
        <h2 className="hms-login-title">Staff Login</h2>
        <form onSubmit={handleLogin} className="hms-login-input">
          <div className="hms-input-block">
            <label>Username</label>
            <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3">
              <User className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="hms-input"
                required
              />
            </div>
          </div>
          <div className="hms-input-block">
            <label>Password</label>
            <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3">
              <Lock className="w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="hms-input"
                required
              />
            </div>
          </div>
          {error && <p className="hms-alert">{error}</p>}
          <button type="submit" className="hms-button hms-login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;