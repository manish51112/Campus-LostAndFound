import React, { useState, useEffect } from 'react';
import ItemCard from '../components/ItemCard';
import { Search, Filter, AlertCircle } from 'lucide-react';
import API from '../api';

const categories = [
  'All',
  'Electronics',
  'ID Cards & Wallets',
  'Keys',
  'Books & Stationery',
  'Clothing & Accessories',
  'Other',
];

const Home = ({ onSelectItem, onOpenPost }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All'); // 'All' | 'Lost' | 'Found'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (typeFilter !== 'All') params.type = typeFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();

      const res = await API.get('/items', { params });
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [typeFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div>
      {/* Hero Header */}
      <section className="hero">
        <div className="container">
          <h1>Campus Lost & Found</h1>
          <p>
            Lost an item on campus or found someone else's belongings? Post it here to help our college community recover misplaced items.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="controls-bar">
        <div className="filter-group">
          <button
            className={`tab-btn ${typeFilter === 'All' ? 'active' : ''}`}
            onClick={() => setTypeFilter('All')}
          >
            All Items
          </button>
          <button
            className={`tab-btn tab-lost ${typeFilter === 'Lost' ? 'active' : ''}`}
            onClick={() => setTypeFilter('Lost')}
          >
            Lost Items
          </button>
          <button
            className={`tab-btn tab-found ${typeFilter === 'Found' ? 'active' : ''}`}
            onClick={() => setTypeFilter('Found')}
          >
            Found Items
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="search-box">
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search items, keywords, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            className="select-box"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Listings */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading listings...
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={40} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <h3>No items found</h3>
          <p>Be the first to report a lost or found item for this category.</p>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={onOpenPost}>
            Post an Item Now
          </button>
        </div>
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} onClick={onSelectItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
