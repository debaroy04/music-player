// ✅ Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api';
import '../styles/Auth.css';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await signup({ username, email, password });
      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        navigate('/');
      } else {
        setErr(res.message || 'Signup failed');
      }
    } catch (err) {
      setErr('Server error');
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        {err && <p className="auth-error">{err}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <button type="submit">Sign Up</button>
        <p>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </form>
    </div>
  );
}
