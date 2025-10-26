import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
 
const Login = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth() || {};
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!login) return;
      
      // All authentication now handled by backend
      const user = await login({ email: formData.email, password: formData.password });
      
      onClose();
      
      // Navigate based on user role returned from backend
      if (user?.role === 'ADMIN') {
        navigate('/admin');
      }
    } catch (err) {
      console.error('Login error:', err);
      const message = err?.message || 'Login failed';
      if (!message.includes('Network Error')) {
        alert(message);
      }
    } finally {
      setSubmitting(false);
    }
  };
 
  if (!isOpen) return null;
 
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
       
        <h2 className="popup-title">Login</h2>
       
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-groups">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
              placeholder="Email"
              className="form-input"
              required
            />
          </div>
 
          <div className="form-groups">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                placeholder="Password"
                className="form-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(s => !s)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
 
          <div className="form-groups checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) => setFormData(p => ({ ...p, rememberMe: e.target.checked }))}
                className="checkbox-input"
              />
              <span className="checkbox-text">Remember me?</span>
            </label>
          </div>
 
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
 
        <div className="popup-links">
          <a href="#" className="forgot-password-link">Forget Password?</a>
          <p className="switch-form">
            Don't have an account?
            <button
              type="button"
              className="switch-link"
              onClick={onSwitchToSignup}
            >
              SignUp
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
 
export default Login;
 
 