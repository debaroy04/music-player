import { useState } from 'react';
import axios from 'axios';
import '../styles/Admin.css';

export default function Admin() {
  const [form, setForm] = useState({ title: '', artist: '' });
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audio || !cover) {
      alert('Please select both audio and cover image');
      return;
    }

    const data = new FormData();
    data.append('title', form.title);
    data.append('artist', form.artist);
    data.append('audio', audio);
    data.append('cover', cover);

    try {
      await axios.post('http://localhost:5000/api/songs/upload', data);
      setStatus('Upload successful!');
      setForm({ title: '', artist: '' });
      setAudio(null);
      setCover(null);
    } catch (err) {
      console.error(err);
      setStatus('Upload failed!');
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Panel - Upload Song</h1>
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Song Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter song title"
            required
          />
        </div>

        <div className="form-group">
          <label>Artist Name</label>
          <input
            type="text"
            value={form.artist}
            onChange={(e) => setForm({ ...form, artist: e.target.value })}
            placeholder="Enter artist name"
            required
          />
        </div>

        <div className="form-group">
          <label>Audio File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files[0])}
            required
          />
        </div>

        <div className="form-group">
          <label>Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCover(e.target.files[0])}
            required
          />
        </div>

        <button type="submit">Upload</button>
        {status && <p className="status">{status}</p>}
      </form>
    </div>
  );
}
