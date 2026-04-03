import { useState } from 'react';
import type { SongTask } from '../api/client';

interface TaskListProps {
  tasks: SongTask[];
  onPlay: (task: SongTask) => void;
  onDelete: (taskId: string) => void;
  currentTaskId?: string;
}

const statusConfig = {
  pending: { label: '等待中', color: '#f59e0b', bg: '#fef3c7' },
  processing: { label: '生成中', color: '#6366f1', bg: '#e0e7ff' },
  completed: { label: '已完成', color: '#10b981', bg: '#d1fae5' },
  failed: { label: '失败', color: '#ef4444', bg: '#fee2e2' },
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-sm">
            📝
          </span>
          生成记录
        </h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {tasks.length} 首
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">🎼</div>
          <p className="text-base">还没有生成的歌曲</p>
          <p className="text-sm mt-2">在左侧开始创作你的第一首歌吧</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {tasks.map((task) => {
            const status = statusConfig[task.status];
            const isCurrent = task.id === currentTaskId;
            const isDeleting = deletingId === task.id;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-lg border transition-all ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: status.bg,
                          color: status.color,
                        }}
                      >
                        {status.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(task.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                      {task.lyrics}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
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
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">生成进度</span>
                          <span className="text-indigo-600 font-medium">{task.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 时长 */}
                    {task.status === 'completed' && task.result?.duration && (
                      <div className="mt-2 text-xs text-emerald-600">
                        时长: {Math.floor(task.result.duration / 60)}:{(task.result.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-1">
                    {task.status === 'completed' && (
                      <button
                        onClick={() => onPlay(task)}
                        className={`p-2 rounded-lg transition-all ${
                          isCurrent
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all disabled:opacity-50"
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
