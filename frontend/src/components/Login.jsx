// ✅ Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import '../styles/Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await login({ email, password });
      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        navigate('/');
      } else {
        setErr(res.message || 'Login failed');
      }
    } catch (err) {
      setErr('Server error');
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {err && <p className="auth-error">{err}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')}>Sign up</span>
        </p>
      </form>
    </div>
  );
}