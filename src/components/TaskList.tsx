import { useState } from 'react';
import type { SongTask } from '../api/client';

interface TaskListProps {
  tasks: SongTask[];
  onPlay: (task: SongTask) => void;
  onDelete: (taskId: string) => void;
  currentTaskId?: string;
}

const statusConfig = {
  pending: { label: '等待中', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.2)' },
  processing: { label: '生成中', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.2)' },
  completed: { label: '已完成', color: '#34d399', bg: 'rgba(52, 211, 153, 0.2)' },
  failed: { label: '失败', color: '#f87171', bg: 'rgba(248, 113, 113, 0.2)' },
};

const styleLabels: Record<string, string> = {
  pop: '流行',
  rock: '摇滚',
  folk: '民谣',
  electronic: '电子',
  classical: '古典',
  jazz: '爵士',
};

const moodEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  romantic: '😍',
  energetic: '⚡',
  calm: '😌',
  epic: '🔥',
};

export function TaskList({ tasks, onPlay, onDelete, currentTaskId }: TaskListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (taskId: string) => {
    setDeletingId(taskId);
    try {
      await onDelete(taskId);
    } finally {
      setDeletingId(null);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
          <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#34d399] to-[#10b981] flex items-center justify-center text-base sm:text-lg shadow-lg">
            📝
          </span>
          <span className="bg-gradient-to-r from-[#34d399] to-[#10b981] bg-clip-text text-transparent">
            生成记录
          </span>
        </h2>
        <span className="text-xs sm:text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full border border-white/10">
          {tasks.length} 首
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 sm:py-16 text-white/40">
          <div className="text-4xl sm:text-5xl mb-4 opacity-50">🎼</div>
          <p className="text-base sm:text-lg">还没有生成的歌曲</p>
          <p className="text-xs sm:text-sm mt-2 opacity-70">在左侧开始创作你的第一首歌吧</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {tasks.map((task) => {
            const status = statusConfig[task.status];
            const isCurrent = task.id === currentTaskId;
            const isDeleting = deletingId === task.id;

            return (
              <div
                key={task.id}
                className={`p-3 sm:p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-[#6366f1]/50 bg-[#6366f1]/15 shadow-lg shadow-[#6366f1]/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium border"
                        style={{
                          backgroundColor: status.bg,
                          color: status.color,
                          borderColor: `${status.color}40`,
                        }}
                      >
                        {status.label}
                      </span>
                      <span className="text-xs text-white/40">
                        {formatTime(task.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mb-2">
                      {task.lyrics}
                    </p>

                    <div className="flex items-center gap-2 sm:gap-3 text-xs text-white/50 flex-wrap">
                      <span className="flex items-center gap-1">
                        <span>🎵</span>
                        {styleLabels[task.style] || task.style}
                      </span>
                      <span className="flex items-center gap-1">
                        {moodEmojis[task.mood] || '😊'}
                        {task.mood}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>⏱️</span>
                        {task.tempo}
                      </span>
                    </div>

                    {/* 进度条 */}
                    {(task.status === 'pending' || task.status === 'processing') && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-white/50">生成进度</span>
                          <span className="text-[#818cf8] font-medium">{task.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#6366f1] to-[#ec4899] rounded-full transition-all duration-500"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 时长 */}
                    {task.status === 'completed' && task.result?.duration && (
                      <div className="mt-2 text-xs text-[#34d399]">
                        时长: {Math.floor(task.result.duration / 60)}:{(task.result.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {task.status === 'completed' && (
                      <button
                        onClick={() => onPlay(task)}
                        className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                          isCurrent
                            ? 'bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/30'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                        title="播放"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={isDeleting}
                      className="p-1.5 sm:p-2 rounded-lg bg-white/10 text-white/70 hover:bg-[#f87171]/80 hover:text-white transition-all disabled:opacity-50"
                      title="删除"
                    >
                      {isDeleting ? (
                        <svg className="animate-spin w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
