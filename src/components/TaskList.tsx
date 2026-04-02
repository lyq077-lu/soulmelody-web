import { useState, useEffect } from 'react';
import type { SongTask } from '../api/client';

interface TaskListProps {
  tasks: SongTask[];
  onPlay: (task: SongTask) => void;
  onDelete: (taskId: string) => void;
  currentTaskId?: string;
}

const statusConfig = {
  pending: { label: '等待中', color: '#fbbf24', bg: '#fbbf24/10' },
  processing: { label: '生成中', color: '#6366f1', bg: '#6366f1/10' },
  completed: { label: '已完成', color: '#34d399', bg: '#34d399/10' },
  failed: { label: '失败', color: '#f87171', bg: '#f87171/10' },
};

const styleLabels: Record<string, string> = {
  pop: '流行',
  rock: '摇滚',
  folk: '民谣',
  electronic: '电子',
  classical: '古典',
  jazz: '爵士',
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
    <div className="bg-[#1e293b] rounded-2xl p-6 border border-[#334155]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-2xl">📝</span>
          生成记录
        </h2>
        <span className="text-sm text-[#94a3b8]">{tasks.length} 首歌曲</span>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-[#64748b]">
          <div className="text-4xl mb-3">🎼</div>
          <p>还没有生成的歌曲</p>
          <p className="text-sm mt-1">在左侧开始创作你的第一首歌吧</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {tasks.map((task) => {
            const status = statusConfig[task.status];
            const isCurrent = task.id === currentTaskId;
            const isDeleting = deletingId === task.id;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-[#6366f1] bg-[#6366f1]/5'
                    : 'border-[#334155] bg-[#0f172a] hover:border-[#475569]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: status.color + '20',
                          color: status.color,
                        }}
                      >
                        {status.label}
                      </span>
                      <span className="text-xs text-[#64748b]">
                        {formatTime(task.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-[#f8fafc] line-clamp-2 mb-2">
                      {task.lyrics}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                      <span className="flex items-center gap-1">
                        <span>🎵</span>
                        {styleLabels[task.style] || task.style}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>😊</span>
                        {task.mood}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>⏱️</span>
                        {task.tempo}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {(task.status === 'pending' || task.status === 'processing') && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[#94a3b8]">生成进度</span>
                          <span className="text-[#6366f1]">{task.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-[#334155] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#6366f1] to-[#ec4899] rounded-full transition-all duration-500"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Duration */}
                    {task.status === 'completed' && task.result?.duration && (
                      <div className="mt-2 text-xs text-[#34d399]">
                        时长: {Math.floor(task.result.duration / 60)}:{(task.result.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-3">
                    {task.status === 'completed' && (
                      <button
                        onClick={() => onPlay(task)}
                        className={`p-2 rounded-lg transition-colors ${
                          isCurrent
                            ? 'bg-[#6366f1] text-white'
                            : 'bg-[#334155] text-[#94a3b8] hover:bg-[#475569]'
                        }`}
                        title="播放"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={isDeleting}
                      className="p-2 rounded-lg bg-[#334155] text-[#94a3b8] hover:bg-[#f87171] hover:text-white transition-colors disabled:opacity-50"
                      title="删除"
                    >
                      {isDeleting ? (
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
