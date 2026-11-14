import React, { useState, useContext } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyPosts from './pages/MyPosts';
import ItemModal from './components/ItemModal';
import PostItemModal from './components/PostItemModal';
import AuthModal from './components/AuthModal';
import ProfileSettingsModal from './components/ProfileSettingsModal';
import { AuthContext } from './context/AuthContext';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'my-posts'
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { user } = useContext(AuthContext);

  const handleItemCreated = (newItem) => {
    setCurrentView('home');
  };

  return (
    <div>
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenPost={() => setIsPostOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <main className="container" style={{ minHeight: '80vh' }}>
        {currentView === 'home' && (
          <Home
            onSelectItem={(item) => setSelectedItem(item)}
            onOpenPost={() => {
              if (!user) setIsAuthOpen(true);
              else setIsPostOpen(true);
            }}
          />
        )}

        {currentView === 'my-posts' && (
          <MyPosts
            onSelectItem={(item) => setSelectedItem(item)}
          />
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div className="container">
          Campus Lost & Found System • Built with MERN Stack (MongoDB, Express.js, React.js, Node.js)
        </div>
      </footer>

      {/* Modals */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          isOwner={user && selectedItem.user && (selectedItem.user._id === user._id || selectedItem.user === user._id)}
        />
      )}

      {isPostOpen && (
        <PostItemModal
          onClose={() => setIsPostOpen(false)}
          onItemCreated={handleItemCreated}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <ProfileSettingsModal
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
