import React, { useState } from 'react';
import './Signup.css';
import { useAuth } from '../../context/AuthContext';
 
const Signup = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth() || {};
 
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
 
    if (!signup) return;
    setSubmitting(true);
    try {
      await signup({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, password: formData.password });
      alert('Signup successful. Please login.');
      onSwitchToLogin && onSwitchToLogin();
    } catch (err) {
      alert(err?.payload?.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };
 
  if (!isOpen) return null;
 
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content signup-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
       
        <h2 className="popup-title">Sign Up</h2>
       
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="name-row">
            <div className="form-group half-width">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
                placeholder="First Name"
                className="form-input"
                required
              />
            </div>
 
            <div className="form-group half-width">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
                placeholder="Last Name"
                className="form-input"
                required
              />
            </div>
          </div>
 
          <div className="form-group">
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
 
          <div className="form-group">
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
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
 
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Confirm Password"
                className="form-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
 
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
 
        <div className="popup-links">
          <p className="switch-form">
            Already have an account?
            <button
              type="button"
              className="switch-link"
              onClick={onSwitchToLogin}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
 
export default Signup;
 
 