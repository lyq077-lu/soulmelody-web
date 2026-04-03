import { useState } from 'react';

interface SongGeneratorProps {
  onGenerate: (data: {
    lyrics: string;
    style: string;
    mood: string;
    tempo: string;
  }) => void;
  isLoading: boolean;
}

const styles = [
  { value: 'pop', label: '流行 Pop', icon: '🎤' },
  { value: 'rock', label: '摇滚 Rock', icon: '🎸' },
  { value: 'folk', label: '民谣 Folk', icon: '🎻' },
  { value: 'electronic', label: '电子 Electronic', icon: '🎹' },
  { value: 'classical', label: '古典 Classical', icon: '🎺' },
  { value: 'jazz', label: '爵士 Jazz', icon: '🎷' },
];

const moods = [
  { value: 'happy', label: '欢快' },
  { value: 'sad', label: '忧伤' },
  { value: 'romantic', label: '浪漫' },
  { value: 'energetic', label: '激昂' },
  { value: 'calm', label: '宁静' },
  { value: 'epic', label: '史诗' },
];

const tempos = [
  { value: 'slow', label: '慢板', bpm: '60-80' },
  { value: 'medium', label: '中速', bpm: '90-120' },
  { value: 'fast', label: '快板', bpm: '130-160' },
];

export function SongGenerator({ onGenerate, isLoading }: SongGeneratorProps) {
  const [lyrics, setLyrics] = useState('');
  const [style, setStyle] = useState('pop');
  const [mood, setMood] = useState('happy');
  const [tempo, setTempo] = useState('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lyrics.trim() || isLoading) return;
    
    onGenerate({
      lyrics: lyrics.trim(),
      style,
      mood,
      tempo,
    });
  };

  return (
    <div>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#39ff14',
        borderBottom: '1px solid rgba(57, 255, 20, 0.3)',
        paddingBottom: '12px',
        textShadow: '0 0 10px rgba(57, 255, 20, 0.3)'
      }}>
        创作你的歌曲
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 歌词编辑 */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#e0e0e0',
            marginBottom: '8px'
          }}>
            歌词内容
          </label>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="请输入歌词内容，AI将为你谱曲...&#10;例如：&#10;阳光洒满窗台&#10;微风轻轻吹来"
            style={{
              width: '80%',
              height: '15vh',
              minHeight: '120px',
              padding: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(57, 255, 20, 0.3)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              resize: 'none',
              outline: 'none'
            }}
          />
          <div style={{
            textAlign: 'right',
            fontSize: '12px',
            color: '#888',
            marginTop: '4px',
            width: '80%'
          }}>
            {lyrics.length}/2000
          </div>
        </div>

        {/* 音乐风格选择 */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#e0e0e0',
            marginBottom: '10px'
          }}>
            音乐风格
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {styles.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStyle(s.value)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  border: style === s.value 
                    ? '1px solid #39ff14' 
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: style === s.value ? '#39ff14' : 'rgba(0, 0, 0, 0.3)',
                  color: style === s.value ? '#1a1a2e' : '#e0e0e0',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: style === s.value ? '600' : '400'
                }}
              >
                <span style={{ marginRight: '4px' }}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 情感氛围选择 */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#e0e0e0',
            marginBottom: '10px'
          }}>
            情感氛围
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
            {moods.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                style={{
                  padding: '10px 4px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  border: mood === m.value 
                    ? '1px solid #39ff14' 
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: mood === m.value ? '#39ff14' : 'rgba(0, 0, 0, 0.3)',
                  color: mood === m.value ? '#1a1a2e' : '#e0e0e0',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: mood === m.value ? '600' : '400'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 节奏速度控制 */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#e0e0e0',
            marginBottom: '10px'
          }}>
            节奏速度
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {tempos.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTempo(t.value)}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: tempo === t.value 
                    ? '1px solid #39ff14' 
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: tempo === t.value ? '#39ff14' : 'rgba(0, 0, 0, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: '15px',
                  color: tempo === t.value ? '#1a1a2e' : '#e0e0e0'
                }}>
                  {t.label}
                </div>
                <div style={{ 
                  fontSize: '12px',
                  color: tempo === t.value ? '#1a1a2e' : '#888',
                  marginTop: '4px',
                  opacity: tempo === t.value ? 0.8 : 1
                }}>{t.bpm} BPM</div>
              </button>
            ))}
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={!lyrics.trim() || isLoading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            backgroundColor: !lyrics.trim() || isLoading ? '#333' : '#39ff14',
            color: !lyrics.trim() || isLoading ? '#666' : '#1a1a2e',
            fontWeight: 'bold',
            fontSize: '16px',
            border: 'none',
            cursor: !lyrics.trim() || isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            marginTop: '8px',
            boxShadow: !lyrics.trim() || isLoading ? 'none' : '0 0 20px rgba(57, 255, 20, 0.4)'
          }}
        >
          {isLoading ? (
            <span>生成中...</span>
          ) : (
            <span>开始创作</span>
          )}
        </button>
      </form>
    </div>
  );
}
