import React, { useState, useContext } from 'react';
import { X, LogIn, UserPlus, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';

const SECURITY_QUESTIONS = [
  'What was the name of your first school?',
  'What is your mother\'s maiden name?',
  'What was the name of your first pet?',
  'What is your favorite book or movie?',
  'In what city or town were you born?',
];

const AuthModal = ({ onClose }) => {
  // mode: 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState('login');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    securityQuestion: SECURITY_QUESTIONS[0],
    securityAnswer: '',
  });

  // Forgot password specific states
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: Answer + New Password
  const [retrievedQuestion, setRetrievedQuestion] = useState('');
  const [forgotData, setForgotData] = useState({
    email: '',
    securityAnswer: '',
    newPassword: '',
  });
  const [resetSuccess, setResetSuccess] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgotChange = (e) => {
    setForgotData({ ...forgotData, [e.target.name]: e.target.value });
  };

  // Login / Register Submit
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.phone,
          formData.securityQuestion,
          formData.securityAnswer
        );
      } else {
        await login(formData.email, formData.password);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Step 1 Fetch Question
  const handleFetchQuestion = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/security-question', { email: forgotData.email });
      setRetrievedQuestion(res.data.securityQuestion);
      setForgotStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Email not found');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Step 2 Submit Answer and Reset
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/reset-password', {
        email: forgotData.email,
        securityAnswer: forgotData.securityAnswer,
        newPassword: forgotData.newPassword,
      });
      setResetSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
            {mode === 'login' && 'Student Sign In'}
            {mode === 'register' && 'Student Registration'}
            {mode === 'forgot' && 'Reset Forgotten Password'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '14px', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {resetSuccess && (
          <div style={{ padding: '14px', background: '#ecfdf5', color: '#065f46', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>
            <CheckCircle2 size={24} style={{ margin: '0 auto 8px', color: '#10b981' }} />
            <div>{resetSuccess}</div>
            <button
              className="btn btn-primary"
              style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
              onClick={() => {
                setResetSuccess('');
                setMode('login');
                setError('');
              }}
            >
              Sign In with New Password
            </button>
          </div>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && !resetSuccess && (
          <div>
            {forgotStep === 1 ? (
              <form onSubmit={handleFetchQuestion}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Enter your registered college email. We will retrieve your chosen security question to verify your identity.
                </p>

                <div className="form-group">
                  <label>College Email *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="student@college.edu"
                    value={forgotData.email}
                    onChange={handleForgotChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                  disabled={loading}
                >
                  <KeyRound size={16} />
                  {loading ? 'Finding Account...' : 'Continue to Security Question'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit}>
                <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
                    Your Security Question
                  </span>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem', marginTop: '4px' }}>
                    {retrievedQuestion}
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Answer *</label>
                  <input
                    type="text"
                    name="securityAnswer"
                    className="form-control"
                    placeholder="Type the answer you set during registration"
                    value={forgotData.securityAnswer}
                    onChange={handleForgotChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password *</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control"
                    placeholder="Minimum 6 characters"
                    value={forgotData.newPassword}
                    onChange={handleForgotChange}
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                  disabled={loading}
                >
                  <KeyRound size={16} />
                  {loading ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>
            )}

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                onClick={() => {
                  setMode('login');
                  setError('');
                  setForgotStep(1);
                }}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* LOGIN / REGISTER FORM */}
        {mode !== 'forgot' && (
          <form onSubmit={handleAuthSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>College Email *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="e.g. student@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ margin: 0 }}>Password *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setForgotData({ email: formData.email, securityAnswer: '', newPassword: '' });
                    }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            {mode === 'register' && (
              <>
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

                <div className="form-group" style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <label style={{ color: 'var(--primary)' }}>Password Reset Security Question *</label>
                  <select
                    name="securityQuestion"
                    className="form-control"
                    value={formData.securityQuestion}
                    onChange={handleChange}
                    style={{ marginBottom: '10px' }}
                  >
                    {SECURITY_QUESTIONS.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>

                  <label>Your Security Answer *</label>
                  <input
                    type="text"
                    name="securityAnswer"
                    className="form-control"
                    placeholder="Used to recover your account if you forget your password"
                    value={formData.securityAnswer}
                    onChange={handleChange}
                    required
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block', marginTop: '4px' }}>
                    *You can also change this question anytime in your profile settings later.
                  </small>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
              disabled={loading}
            >
              {mode === 'register' ? <UserPlus size={16} /> : <LogIn size={16} />}
              {loading ? 'Please wait...' : mode === 'register' ? 'Create Account' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Bottom Toggle */}
        {mode !== 'forgot' && (
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {mode === 'register' ? (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                >
                  Create one now
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
