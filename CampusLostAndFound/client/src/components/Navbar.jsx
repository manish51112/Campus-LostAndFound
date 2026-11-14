import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, PlusCircle, User, LogOut, Package, Settings } from 'lucide-react';

const Navbar = ({ onOpenAuth, onOpenPost, onOpenSettings, currentView, setCurrentView }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="navbar">
      <div className="container nav-container">
        <div className="nav-brand" onClick={() => setCurrentView('home')}>
          <Search size={26} />
          <span>Campus Lost & Found</span>
        </div>

        <div className="nav-actions">
          <button
            className={`btn ${currentView === 'home' ? 'btn-outline' : 'btn-outline'}`}
            onClick={() => setCurrentView('home')}
          >
            Explore
          </button>

          {user && (
            <button
              className={`btn ${currentView === 'my-posts' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setCurrentView('my-posts')}
            >
              <Package size={16} />
              My Listings
            </button>
          )}

          <button
            className="btn btn-primary"
            onClick={() => {
              if (!user) {
                onOpenAuth();
              } else {
                onOpenPost();
              }
            }}
          >
            <PlusCircle size={16} />
            Report Item
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="btn btn-outline"
                style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Account & Security Settings"
                onClick={onOpenSettings}
              >
                <Settings size={15} color="var(--primary)" />
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                  {user.name.split(' ')[0]}
                </span>
              </button>

              <button
                className="btn btn-outline"
                style={{ padding: '8px' }}
                title="Logout"
                onClick={logout}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn btn-outline" onClick={onOpenAuth}>
              <User size={16} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
