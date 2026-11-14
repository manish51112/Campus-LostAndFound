import React from 'react';
import { MapPin, Calendar, CheckCircle2, Clock } from 'lucide-react';

const ItemCard = ({ item, onClick }) => {
  const isLost = item.type === 'Lost';
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
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
    <div className="card" onClick={() => onClick(item)} style={{ cursor: 'pointer' }}>
      <div className="card-img-wrap">
        <img
          src={defaultImage}
          alt={item.title}
          className="card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500&auto=format&fit=crop&q=60';
          }}
        />
        <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
          {item.type}
        </span>
        <span className="status-badge">
          {item.status === 'Claimed' ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#86efac' }}>
              <CheckCircle2 size={13} /> Claimed
            </span>
          ) : (
            'Active'
          )}
        </span>
      </div>

      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span className="card-category">{item.category}</span>
          <span style={{ fontSize: '0.73rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }} title="Posts automatically expire 30 days after creation">
            <Clock size={11} />
            {daysRemaining}d left
          </span>
        </div>

        <h3 className="card-title">{item.title}</h3>
        <p className="card-desc">{item.description}</p>

        <div className="card-meta">
          <div className="meta-row">
            <MapPin size={14} color="var(--primary)" />
            <span>{item.location}</span>
          </div>
          <div className="meta-row">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
