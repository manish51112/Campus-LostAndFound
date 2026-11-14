import React, { useState, useContext } from 'react';
import { X, ShieldCheck, Save, CheckCircle2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';

const SECURITY_QUESTIONS = [
  'What was the name of your first school?',
  'What is your mother\'s maiden name?',
  'What was the name of your first pet?',
  'What is your favorite book or movie?',
  'In what city or town were you born?',
];

const ProfileSettingsModal = ({ onClose }) => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    securityQuestion: user?.securityQuestion || SECURITY_QUESTIONS[0],
    securityAnswer: '',
    newPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        securityQuestion: formData.securityQuestion,
      };

      if (formData.securityAnswer.trim()) {
        payload.securityAnswer = formData.securityAnswer.trim();
      }

      if (formData.newPassword.trim()) {
        payload.newPassword = formData.newPassword.trim();
      }

      const res = await API.put('/auth/update-profile', payload);

      // Update localStorage with updated info
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...savedUser, ...res.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSuccess('Profile and security question updated successfully!');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Account & Security Settings</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '14px', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '10px', background: '#ecfdf5', color: '#065f46', borderRadius: '6px', marginBottom: '14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Registered Email (Account Identifier)</label>
            <input
              type="email"
              className="form-control"
              value={user?.email || ''}
              disabled
              style={{ background: '#f1f5f9', cursor: 'not-allowed', color: 'var(--text-muted)' }}
            />
          </div>

          <div className="form-group">
            <label>Phone Number (Optional)</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="e.g. 9876543210 (Optional)"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Security Question Section */}
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} /> Password Reset Security Question
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Used to reset your password if forgotten, even without a phone number.
            </p>

            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label>Select Question</label>
              <select
                name="securityQuestion"
                className="form-control"
                value={formData.securityQuestion}
                onChange={handleChange}
              >
                {SECURITY_QUESTIONS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>New Security Answer (leave empty to keep current answer)</label>
              <input
                type="text"
                name="securityAnswer"
                className="form-control"
                placeholder="Type new answer to update..."
                value={formData.securityAnswer}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password update */}
          <div className="form-group">
            <label>Change Password (leave empty to keep current)</label>
            <input
              type="password"
              name="newPassword"
              className="form-control"
              placeholder="Enter new password (min. 6 chars)..."
              value={formData.newPassword}
              onChange={handleChange}
              minLength={6}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsModal;
