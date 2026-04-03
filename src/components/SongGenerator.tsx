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
  { value: 'happy', label: '欢快', color: '#fbbf24' },
  { value: 'sad', label: '忧伤', color: '#60a5fa' },
  { value: 'romantic', label: '浪漫', color: '#f472b6' },
  { value: 'energetic', label: '激昂', color: '#f87171' },
  { value: 'calm', label: '宁静', color: '#34d399' },
  { value: 'epic', label: '史诗', color: '#a78bfa' },
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
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 h-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 flex items-center gap-3">
        <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#ec4899] flex items-center justify-center text-base sm:text-lg shadow-lg">
          ✨
        </span>
        <span className="bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
          创作你的歌曲
        </span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 歌词编辑 */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]"></span>
            歌词内容
          </label>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="请输入歌词内容，AI将为你谱曲...&#10;例如：&#10;阳光洒满窗台&#10;微风轻轻吹来&#10;这一刻多么美好&#10;让我为你歌唱"
            className="w-full h-28 sm:h-32 px-4 py-3 bg-black/20 border border-white/10 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1]/30 placeholder-white/40 text-white/90 text-sm transition-all"
          />
          <div className="text-right text-xs text-white/50 mt-1.5">
            {lyrics.length}/2000 字符
          </div>
        </div>

        {/* 音乐风格选择 */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899]"></span>
            音乐风格
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {styles.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStyle(s.value)}
                className={`px-2 py-2 rounded-lg text-sm transition-all border ${
                  style === s.value
                    ? 'bg-[#6366f1]/80 border-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/15 hover:border-white/25'
                }`}
              >
                <span className="mr-1">{s.icon}</span>
                <span className="text-xs sm:text-sm">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 情感氛围选择 */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]"></span>
            情感氛围
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={`py-2 rounded-lg text-xs sm:text-sm transition-all border ${
                  mood === m.value
                    ? 'border-white/40 text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
                style={{
                  backgroundColor: mood === m.value ? `${m.color}40` : undefined,
                  boxShadow: mood === m.value ? `0 4px 15px ${m.color}40` : undefined,
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 节奏速度控制 */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span>
            节奏速度
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {tempos.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTempo(t.value)}
                className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                  tempo === t.value
                    ? 'border-[#6366f1] bg-[#6366f1]/30 shadow-lg shadow-[#6366f1]/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className={`font-medium text-sm ${tempo === t.value ? 'text-[#818cf8]' : 'text-white/90'}`}>
                  {t.label}
                </div>
                <div className="text-xs text-white/50 mt-0.5">{t.bpm} BPM</div>
              </button>
            ))}
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={!lyrics.trim() || isLoading}
          className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white font-semibold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-[#6366f1]/30 transition-all hover:scale-[1.02] active:scale-[0.98] mt-6"
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
              <span>🎵</span>
              开始创作
            </>
          )}
        </button>
      </form>
    </div>
  );
}
