import React, { useState, useEffect } from 'react';
import { Package, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';
import API from '../api';

const MyPosts = ({ onSelectItem }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const res = await API.get('/items/my-posts');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load your posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'Claimed' ? 'Open' : 'Claimed';
    try {
      const res = await API.put(`/items/${item._id}`, { status: newStatus });
      setItems(items.map((i) => (i._id === item._id ? res.data : i)));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await API.delete(`/items/${id}`);
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  return (
    <div style={{ padding: '30px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <Package size={28} color="var(--primary)" />
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>My Reported Items</h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading your listings...
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't posted any items yet</h3>
          <p>Any items you report as Lost or Found will appear here for easy tracking and status updates.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {items.map((item) => (
            <div
              key={item._id}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span
                  className={`badge ${item.type === 'Lost' ? 'badge-lost' : 'badge-found'}`}
                  style={{ position: 'static' }}
                >
                  {item.type}
                </span>

                <div>
                  <h4
                    style={{ fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', color: 'var(--primary)' }}
                    onClick={() => onSelectItem(item)}
                  >
                    {item.title}
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {item.category} • {item.location} • Status:{' '}
                    <strong style={{ color: item.status === 'Claimed' ? 'var(--success)' : 'var(--warning)' }}>
                      {item.status}
                    </strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn btn-outline"
                  onClick={() => handleToggleStatus(item)}
                >
                  {item.status === 'Claimed' ? (
                    <>
                      <RotateCcw size={15} /> Re-open
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} color="var(--success)" /> Mark Claimed
                    </>
                  )}
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
