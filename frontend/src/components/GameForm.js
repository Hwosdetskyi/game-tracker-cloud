import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './styles.css';

export default function GameForm({ initialGame = null, isEditing = false, onSubmit, onCancel, games = [] }) {
  const empty = { id: null, title: '', platform: '', genre: '', status: 'In progress', rating: 5 };
  const [form, setForm] = useState(initialGame || empty);
  const [errorModal, setErrorModal] = useState({ open: false, title: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { setForm(initialGame || empty); }, [initialGame]);

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = (form.title || '').trim();
    const platform = (form.platform || '').trim();
    const genre = (form.genre || '').trim();

    if (!title || !platform || !genre) {
      setErrorModal({ open: true, title: 'Validation error', message: 'Title, platform and genre are required and cannot be empty or just spaces.' });
      return;
    }

    // must contain at least one letter or digit (Latin or Cyrillic)
    const mustHaveAlnum = /[A-Za-z0-9\u0400-\u04FF]/;
    if (!mustHaveAlnum.test(title) || !mustHaveAlnum.test(platform) || !mustHaveAlnum.test(genre)) {
      setErrorModal({ open: true, title: 'Validation error', message: 'Fields must contain at least one letter or number; entries with only symbols are not allowed.' });
      return;
    }

    const duplicate = games.some(g => {
      if (isEditing && g.id === form.id) return false;
      return g.title.trim().toLowerCase() === title.toLowerCase() && g.platform.trim().toLowerCase() === platform.toLowerCase();
    });
    if (duplicate) {
      setErrorModal({ open: true, title: 'Duplicate', message: 'A game with this title and platform already exists (case-insensitive).' });
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({ ...form, title, platform, genre, rating: Number(form.rating) });
      setForm(empty);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <form onSubmit={handleSubmit}>
        <input className="input" placeholder="Game Title" value={form.title} onChange={e => handleChange('title', e.target.value)} disabled={isLoading} />
        <input className="input" placeholder="Platform (e.g., PC, PS5, Xbox)" value={form.platform} onChange={e => handleChange('platform', e.target.value)} disabled={isLoading} />
        <input className="input" placeholder="Genre" value={form.genre} onChange={e => handleChange('genre', e.target.value)} disabled={isLoading} />

        <div className="flex-row" style={{ marginTop: 20, gap: 20 }}>
          <div style={{ flex: 1 }}>
            <label>Status:</label>
            <select value={form.status} onChange={e => handleChange('status', e.target.value)} disabled={isLoading} style={{ width: '100%' }}>
              <option value="In progress">In progress</option>
              <option value="Completed">Completed</option>
              <option value="Want to play">Want to play</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label>Rating (1-10):</label>
            <input type="number" min="1" max="10" value={form.rating} onChange={e => handleChange('rating', e.target.value)} disabled={isLoading} style={{ width: '100%' }} />
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="btn" type="submit" disabled={isLoading}>
            {isLoading ? '⏳ Saving...' : (isEditing ? 'Update Game' : 'Add to Collection')}
          </button>
          {isEditing && <button type="button" className="btn btn-muted" onClick={onCancel} disabled={isLoading}>Cancel</button>}
        </div>
      </form>

      <Modal isOpen={errorModal.open} title={errorModal.title} onClose={() => setErrorModal({ ...errorModal, open: false })} onConfirm={() => setErrorModal({ ...errorModal, open: false })} confirmText="OK" showCancel={false}>
        {errorModal.message}
      </Modal>
    </div>
  );
}
