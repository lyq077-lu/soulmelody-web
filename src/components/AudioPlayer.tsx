import { useRef, useState, useEffect } from 'react';
import type { SongTask } from '../api/client';

interface AudioPlayerProps {
  task: SongTask;
}

export function AudioPlayer({ task }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(task.result?.duration || 0);
  const [volume, setVolume] = useState(0.8);

  const audioUrl = `http://localhost:3000/api/v1/songs/download/${task.id}`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [task.id]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const vol = parseFloat(e.target.value);
    audio.volume = vol;
    setVolume(vol);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      backgroundColor: 'rgba(57, 255, 20, 0.1)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(57, 255, 20, 0.3)',
      marginBottom: '16px'
    }}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        {/* 播放按钮 */}
        <button
          onClick={togglePlay}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#39ff14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(57, 255, 20, 0.4)'
          }}
        >
          {isPlaying ? (
            <svg width="18" height="18" fill="#1a1a2e" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg width="18" height="18" fill="#1a1a2e" viewBox="0 0 24 24" style={{ marginLeft: '2px' }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* 歌曲信息 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontWeight: 600,
            color: '#e0e0e0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '14px'
          }}>
            {task.lyrics.slice(0, 25)}...
          </h3>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
            {task.style} · {task.mood}
          </p>
        </div>
      </div>

      {/* 进度条 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '11px', color: '#888', width: '36px', textAlign: 'right', fontFamily: 'monospace' }}>
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            appearance: 'none',
            cursor: 'pointer',
            background: `linear-gradient(to right, #39ff14 0%, #39ff14 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.1) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.1) 100%)`
          }}
        />
        <span style={{ fontSize: '11px', color: '#888', width: '36px', fontFamily: 'monospace' }}>
          {formatTime(duration)}
        </span>
      </div>

      {/* 音量控制 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="16" height="16" fill="none" stroke="#666" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={volume}
          onChange={handleVolume}
          style={{
            width: '80px',
            height: '4px',
            borderRadius: '2px',
            appearance: 'none',
            cursor: 'pointer',
            background: `linear-gradient(to right, #39ff14 0%, #39ff14 ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`
          }}
        />
      </div>
    </div>
  );
}
