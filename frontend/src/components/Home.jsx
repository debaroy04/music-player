// src/pages/Home.jsx
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../styles/Home.css';

const BASE_URL = 'http://localhost:5000';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const current = songs[currentIndex];
  const next = songs.length > 0 ? songs[(currentIndex + 1) % songs.length] : null;

  useEffect(() => {
    axios.get(`${BASE_URL}/api/songs`)
      .then(res => setSongs(res.data))
      .catch(err => console.error("Error fetching songs", err));
  }, []);

  useEffect(() => {
    if (current && audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (songs.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  };

  const prevSong = () => {
    if (songs.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const selectSong = (index) => {
    if (index === currentIndex) {
      togglePlay();
    } else {
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  };

  return (
    <div className="home-wrapper">
      <nav className="navbar">
  <h1>🎵 VibeTunes</h1>
  {localStorage.getItem('username') && (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
      👤 {localStorage.getItem('username')}
      <button
  onClick={() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  }}
  style={{
    marginLeft: '0.8rem',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem'
  }}
>
  Logout
</button>

    </div>
  )}
</nav>




      {current && (
        <div className="now-playing">
          <div className="current-song">
            <img
              src={`${BASE_URL}/uploads/${current.coverPath}`}
              alt="cover"
              className={`cover-art ${isPlaying ? 'playing' : ''}`}
            />
            <div className="song-info">
              <h2>{current.title}</h2>
              <p>{current.artist}</p>
              <div className="controls">
                <button onClick={prevSong}>⏮️</button>
                <button onClick={togglePlay}>{isPlaying ? '⏸️' : '▶️'}</button>
                <button onClick={nextSong}>⏭️</button>
              </div>
              <audio ref={audioRef} onEnded={nextSong}>
                <source src={`${BASE_URL}/uploads/${current.audioPath}`} type="audio/mpeg" />
              </audio>
            </div>
          </div>
          {next && (
            <div className="next-song-card enlarged">
              <h3>Next Up</h3>
              <img
                src={`${BASE_URL}/uploads/${next.coverPath}`}
                alt="next-cover"
                className="next-cover"
              />
              <p className="next-title">{next.title}</p>
              <p className="next-artist">{next.artist}</p>
              <button
                className="next-play-btn"
                onClick={() => {
                  setCurrentIndex((currentIndex + 1) % songs.length);
                  setIsPlaying(true);
                }}
              >
                ▶️
              </button>
            </div>
          )}
        </div>
      )}

      <div className="song-list">
        <h2 className="song-list-title">All Songs</h2>
        <div className="song-grid">
          {songs.map((song, index) => (
            <div
              key={index}
              className={`song-card ${index === currentIndex ? 'active' : ''}`}
            >
              <img
                src={`${BASE_URL}/uploads/${song.coverPath}`}
                alt={song.title}
                className="cover-thumbnail"
              />
              <div className="song-meta">
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
              </div>
              <button
                className="song-play-btn"
                onClick={() => selectSong(index)}
              >
                {index === currentIndex && isPlaying ? '⏸️' : '▶️'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}