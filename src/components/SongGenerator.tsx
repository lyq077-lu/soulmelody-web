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
  { value: 'happy', label: '欢快', color: '#f59e0b' },
  { value: 'sad', label: '忧伤', color: '#3b82f6' },
  { value: 'romantic', label: '浪漫', color: '#ec4899' },
  { value: 'energetic', label: '激昂', color: '#ef4444' },
  { value: 'calm', label: '宁静', color: '#10b981' },
  { value: 'epic', label: '史诗', color: '#8b5cf6' },
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <h2 className="text-lg font-bold mb-4 text-gray-800 border-b border-gray-100 pb-3">
        创作你的歌曲
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 歌词编辑 - 宽度80%，高度15vh */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            歌词内容
          </label>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="请输入歌词内容，AI将为你谱曲...&#10;例如：&#10;阳光洒满窗台&#10;微风轻轻吹来"
            style={{ width: '80%', height: '15vh', minHeight: '120px' }}
            className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-gray-700 text-sm"
          />
          <div className="text-right text-xs text-gray-400 mt-1" style={{ width: '80%' }}>
            {lyrics.length}/2000
          </div>
        </div>

        {/* 音乐风格选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            音乐风格
          </label>
          <div className="grid grid-cols-3 gap-2">
            {styles.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStyle(s.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  border: style === s.value ? '1px solid #4f46e5' : '1px solid #e5e7eb',
                  backgroundColor: style === s.value ? '#4f46e5' : '#ffffff',
                  color: style === s.value ? '#ffffff' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            情感氛围
          </label>
          <div className="grid grid-cols-6 gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                style={{
                  padding: '8px 4px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  border: mood === m.value ? '1px solid #4f46e5' : '1px solid #e5e7eb',
                  backgroundColor: mood === m.value ? '#4f46e5' : '#ffffff',
                  color: mood === m.value ? '#ffffff' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 节奏速度控制 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            节奏速度
          </label>
          <div className="grid grid-cols-3 gap-3">
            {tempos.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTempo(t.value)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: tempo === t.value ? '1px solid #4f46e5' : '1px solid #e5e7eb',
                  backgroundColor: tempo === t.value ? '#4f46e5' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ 
                  fontWeight: 500, 
                  fontSize: '14px',
                  color: tempo === t.value ? '#ffffff' : '#374151'
                }}>
                  {t.label}
                </div>
                <div style={{ 
                  fontSize: '12px',
                  color: tempo === t.value ? '#e0e7ff' : '#9ca3af'
                }}>{t.bpm} BPM</div>
              </button>
            ))}
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={!lyrics.trim() || isLoading}
          className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors mt-4"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              生成中...
            </>
          ) : (
            <>开始创作</>
          )}
        </button>
      </form>
    </div>
  );
}
