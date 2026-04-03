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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="text-base font-bold mb-3 text-gray-800 border-b border-gray-100 pb-2">
        创作你的歌曲
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* 歌词编辑 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            歌词内容
          </label>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="请输入歌词内容，AI将为你谱曲...&#10;例如：&#10;阳光洒满窗台&#10;微风轻轻吹来"
            className="w-full h-32 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-gray-700 text-sm"
          />
          <div className="text-right text-xs text-gray-400 mt-0.5">
            {lyrics.length}/2000
          </div>
        </div>

        {/* 音乐风格选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            音乐风格
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {styles.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStyle(s.value)}
                className={`px-2 py-1.5 rounded text-xs transition-all border ${
                  style === s.value
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-1">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 情感氛围选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            情感氛围
          </label>
          <div className="grid grid-cols-6 gap-1.5">
            {moods.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={`py-1.5 rounded text-xs transition-all border ${
                  mood === m.value
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 节奏速度控制 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            节奏速度
          </label>
          <div className="grid grid-cols-3 gap-2">
            {tempos.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTempo(t.value)}
                className={`p-2 rounded-lg border transition-all ${
                  tempo === t.value
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`font-medium text-xs ${tempo === t.value ? 'text-white' : 'text-gray-700'}`}>
                  {t.label}
                </div>
                <div className={`text-xs ${tempo === t.value ? 'text-indigo-100' : 'text-gray-400'}`}>{t.bpm} BPM</div>
              </button>
            ))}
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={!lyrics.trim() || isLoading}
          className="w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors mt-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
