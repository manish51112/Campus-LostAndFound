import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import API from '../api';

const PostItemModal = ({ onClose, onItemCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Lost',
    category: 'Electronics',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    contactInfo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Electronics',
    'ID Cards & Wallets',
    'Keys',
    'Books & Stationery',
    'Clothing & Accessories',
    'Other',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/items', formData);
      onItemCreated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Report an Item</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '14px', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Report Type *</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'normal' }}>
                <input
                  type="radio"
                  name="type"
                  value="Lost"
                  checked={formData.type === 'Lost'}
                  onChange={handleChange}
                />
                <span style={{ color: '#dc2626', fontWeight: '600' }}>I Lost an Item</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'normal' }}>
                <input
                  type="radio"
                  name="type"
                  value="Found"
                  checked={formData.type === 'Found'}
                  onChange={handleChange}
                />
                <span style={{ color: '#16a34a', fontWeight: '600' }}>I Found an Item</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Item Name / Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Blue Dell Laptop Charger or Student ID Card"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date Lost / Found *</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Campus Location *</label>
            <input
              type="text"
              name="location"
              className="form-control"
              placeholder="e.g. Central Library Floor 2, Cafeteria Table 4, Block C Lab"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description & Identification Details *</label>
            <textarea
              name="description"
              className="form-control"
              rows={3}
              placeholder="Provide color, brand, stickers, keychains, or specific marks..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Photo URL (Optional)</label>
            <input
              type="url"
              name="imageUrl"
              className="form-control"
              placeholder="Paste direct image link (e.g., Unsplash, Imgur, or leave empty)"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Your Contact Info (Phone or Email) *</label>
            <input
              type="text"
              name="contactInfo"
              className="form-control"
              placeholder="e.g. +91 9876543210 or roll_number@college.edu"
              value={formData.contactInfo}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Send size={16} />
              {loading ? 'Submitting...' : 'Post Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostItemModal;
