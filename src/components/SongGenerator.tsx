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
  { value: 'happy', label: '欢快 Happy', color: '#fbbf24' },
  { value: 'sad', label: '忧伤 Sad', color: '#60a5fa' },
  { value: 'romantic', label: '浪漫 Romantic', color: '#f472b6' },
  { value: 'energetic', label: '激昂 Energetic', color: '#f87171' },
  { value: 'calm', label: '宁静 Calm', color: '#34d399' },
  { value: 'epic', label: '史诗 Epic', color: '#a78bfa' },
];

const tempos = [
  { value: 'slow', label: '慢板 Slow', bpm: '60-80 BPM' },
  { value: 'medium', label: '中速 Medium', bpm: '90-120 BPM' },
  { value: 'fast', label: '快板 Fast', bpm: '130-160 BPM' },
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
    <div className="bg-[#1e293b] rounded-2xl p-6 border border-[#334155] card-hover">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-2xl">🎵</span>
        创作你的歌曲
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lyrics Input */}
        <div>
          <label className="block text-sm font-medium text-[#94a3b8] mb-2">
            歌词内容
          </label>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="请输入歌词内容，AI将为你谱曲...&#10;例如：&#10;阳光洒满窗台&#10;微风轻轻吹来&#10;这一刻多么美好&#10;让我为你歌唱"
            className="w-full h-32 px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent placeholder-[#475569]"
          />
          <div className="text-right text-xs text-[#64748b] mt-1">
            {lyrics.length}/2000 字符
          </div>
        </div>

        {/* Style Selection */}
        <div>
          <label className="block text-sm font-medium text-[#94a3b8] mb-3">
            音乐风格
          </label>
          <div className="grid grid-cols-3 gap-2">
            {styles.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStyle(s.value)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  style === s.value
                    ? 'bg-[#6366f1] text-white'
                    : 'bg-[#0f172a] text-[#94a3b8] hover:bg-[#334155]'
                }`}
              >
                <span className="mr-1">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-[#94a3b8] mb-3">
            情感氛围
          </label>
          <div className="flex flex-wrap gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  mood === m.value
                    ? 'text-white'
                    : 'bg-[#0f172a] text-[#94a3b8] hover:bg-[#334155]'
                }`}
                style={{
                  backgroundColor: mood === m.value ? m.color : undefined,
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tempo Selection */}
        <div>
          <label className="block text-sm font-medium text-[#94a3b8] mb-3">
            节奏速度
          </label>
          <div className="grid grid-cols-3 gap-3">
            {tempos.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTempo(t.value)}
                className={`p-3 rounded-xl border transition-all ${
                  tempo === t.value
                    ? 'border-[#6366f1] bg-[#6366f1]/10'
                    : 'border-[#334155] bg-[#0f172a] hover:border-[#475569]'
                }`}
              >
                <div className={`font-medium ${tempo === t.value ? 'text-[#6366f1]' : 'text-[#f8fafc]'}`}>
                  {t.label}
                </div>
                <div className="text-xs text-[#64748b] mt-1">{t.bpm}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!lyrics.trim() || isLoading}
          className="w-full py-4 rounded-xl btn-primary text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <>
              <span className="text-xl">✨</span>
              开始创作
            </>
          )}
        </button>
      </form>
    </div>
  );
}
