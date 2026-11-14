import React from 'react';
import { X, MapPin, Calendar, User, CheckCircle2, Clock } from 'lucide-react';

const ItemModal = ({ item, onClose, onStatusToggle, isOwner }) => {
  if (!item) return null;

  const isLost = item.type === 'Lost';
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate days remaining in 30-day auto-expire window
  const createdAtTime = new Date(item.createdAt || item.date).getTime();
  const daysPassed = Math.floor((Date.now() - createdAtTime) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, 30 - daysPassed);

  const defaultImage =
    item.imageUrl ||
    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500&auto=format&fit=crop&q=60';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`} style={{ position: 'static' }}>
              {item.type}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              in {item.category}
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ borderRadius: '8px', overflow: 'hidden', maxHeight: '260px', marginBottom: '16px' }}>
          <img
            src={defaultImage}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500&auto=format&fit=crop&q=60';
            }}
          />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>
          {item.title}
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="var(--primary)" />
            <strong>Location:</strong> {item.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' }}>
            <Clock size={13} color="var(--warning)" />
            <span>Auto-cleanup in <strong>{daysRemaining} days</strong></span>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
            Description
          </h4>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
            {item.description}
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={15} /> Posted by {item.user?.name || 'Fellow Student'}
          </h4>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontWeight: '600', color: '#1e40af', fontSize: '0.85rem', marginBottom: '4px' }}>
              Contact Details:
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>
              {item.contactInfo}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          {isOwner && onStatusToggle && (
            <button
              className="btn btn-outline"
              onClick={() => onStatusToggle(item)}
            >
              <CheckCircle2 size={16} />
              {item.status === 'Claimed' ? 'Mark as Active' : 'Mark as Claimed / Returned'}
            </button>
          )}

          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
