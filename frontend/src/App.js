import React, { useState, useEffect } from 'react';
import Modal from './components/Modal';
import GameForm from './components/GameForm';
import './components/styles.css';

const API_URL = '/api';

function App() {
  // Auth State
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('game_user')) || null);
  const [isRegister, setIsRegister] = useState(false);
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Games State
  const [games, setGames] = useState([]);
  const [editingGame, setEditingGame] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(null);
  const [modalProps, setModalProps] = useState({ open: false, title: '', message: '', showCancel: false, onConfirm: null });

  useEffect(() => {
    if (user) fetchGames();
  }, [user]);

  const fetchGames = async () => {
    try {
      const res = await fetch(`${API_URL}/games.php`, {
        headers: { 'Authorization': user.userId }
      });
      const data = await res.json();
      if (res.ok) setGames(data);
    } catch (err) { console.error("Error loading games:", err); }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);
    const endpoint = isRegister ? 'register.php' : 'login.php';
    try {
      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      if (isRegister) {
        setAuthForm({ username: '', password: '' });
        setModalProps({ 
          open: true, 
          title: 'Success', 
          message: 'Registration successful! You can now log in.', 
          showCancel: false, 
          onConfirm: () => { 
            setIsRegister(false);
            setModalProps(prev => ({ ...prev, open: false }));
          } 
        });
      } else {
        localStorage.setItem('game_user', JSON.stringify(data));
        setUser(data);
      }
    } catch (err) { setAuthError(err.message); }
    finally { setIsAuthLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('game_user');
    setUser(null);
    setGames([]);
  };

  const handleGameSubmit = async (submittedGame) => {
    const method = isEditing ? 'PUT' : 'POST';
    try {
      const res = await fetch(`${API_URL}/games.php`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.userId
        },
        body: JSON.stringify(submittedGame)
      });
      if (res.ok) {
        setEditingGame(null);
        setIsEditing(false);
        fetchGames();
      } else {
        const data = await res.json();
        setModalProps({ open: true, title: 'Error', message: data.error || 'Failed to save game', showCancel: false, onConfirm: () => setModalProps(prev => ({ ...prev, open: false })) });
      }
    } catch (err) { console.error(err); setModalProps({ open: true, title: 'Error', message: err.message, showCancel: false, onConfirm: () => setModalProps(prev => ({ ...prev, open: false })) }); }
  };

  const handleEdit = (game) => { setEditingGame(game); setIsEditing(true); };

  const performDelete = async (id) => {
    setIsDeleteLoading(id);
    try {
      const res = await fetch(`${API_URL}/games.php?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': user.userId }
      });
      if (res.ok) fetchGames();
      else setModalProps({ open: true, title: 'Error', message: 'Failed to delete game', showCancel: false, onConfirm: () => setModalProps(prev => ({ ...prev, open: false })) });
    } catch (err) { console.error(err); setModalProps({ open: true, title: 'Error', message: err.message, showCancel: false, onConfirm: () => setModalProps(prev => ({ ...prev, open: false })) }); }
    finally { setIsDeleteLoading(null); }
  };

  // VIEW 1: Auth Screen
  if (!user) {
    return (
      <div className="container">
        <h2>{isRegister ? 'Create Account' : 'Sign In to Game Tracker'}</h2>
        <form onSubmit={handleAuthSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input className="input" type="text" required value={authForm.username} onChange={e => setAuthForm({...authForm, username: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input className="input" type="password" required value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} />
          </div>
          {authError && <p style={{color: '#ff3b30'}}>{authError}</p>}
          <button className="btn" type="submit" disabled={isAuthLoading}>{isAuthLoading ? '⏳ Processing...' : (isRegister ? 'Register' : 'Log In')}</button>
          <button type="button" className="btn btn-muted" onClick={() => setIsRegister(!isRegister)} disabled={isAuthLoading}>
            {isRegister ? 'Already have an account? Log In' : "Don't have an account? Register"}
          </button>
        </form>
        <Modal 
          isOpen={modalProps.open} 
          title={modalProps.title} 
          onClose={() => setModalProps(prev => ({ ...prev, open: false }))} 
          onConfirm={() => { if (modalProps.onConfirm) modalProps.onConfirm(); else setModalProps(prev => ({ ...prev, open: false })); }} 
          confirmText="OK" 
          cancelText="Cancel" 
          showCancel={modalProps.showCancel}
        >
          {modalProps.message}
        </Modal>
      </div>
    );
  }

  // VIEW 2: Dashboard CRUD
  return (
    <div className="container">
      <div className="header">
        <h3>Welcome, {user.username}! 👋</h3>
        <button className="btn btn-muted" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="card column">
        <h4>{isEditing ? 'Edit Game Details' : 'Add New Game to Collection'}</h4>
        <GameForm initialGame={editingGame} isEditing={isEditing} onSubmit={handleGameSubmit} onCancel={() => { setIsEditing(false); setEditingGame(null); }} games={games} />
      </div>

      <h4 style={{ marginTop: 24 }}>Your Game Collection:</h4>
      {games.length === 0 ? <p style={{ marginTop: 12 }}>Your collection is empty. Add your first game!</p> : (
        games.map(game => (
          <div key={game.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <strong className="game-title">{game.title}</strong> <span className="muted">({game.platform})</span>
              <p className="meta">
                Genre: {game.genre} | Status: <strong>{game.status}</strong> | Rating: <strong>{game.rating}/10</strong>
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, marginLeft: 16 }}>
              <button className="btn-warning" onClick={() => handleEdit(game)} disabled={isDeleteLoading !== null || isEditing}>Edit</button>
              <button className="btn-danger" onClick={() => setModalProps({ open: true, title: 'Confirm delete', message: 'Are you sure you want to delete this game?', showCancel: true, onConfirm: () => { performDelete(game.id); setModalProps(prev => ({ ...prev, open: false })); } })} disabled={isDeleteLoading !== null}>
                {isDeleteLoading === game.id ? '⏳' : 'Delete'}
              </button>
            </div>
          </div>
        ))
      )}
      <Modal isOpen={modalProps.open} title={modalProps.title} onClose={() => setModalProps(prev => ({ ...prev, open: false }))} onConfirm={() => { if (modalProps.onConfirm) modalProps.onConfirm(); else setModalProps(prev => ({ ...prev, open: false })); }} confirmText="OK" cancelText="Cancel" showCancel={modalProps.showCancel}>
        {modalProps.message}
      </Modal>
    </div>
  );
}

export default App;