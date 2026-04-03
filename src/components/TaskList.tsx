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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
        <h2 className="text-lg font-bold text-gray-800">生成记录</h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {tasks.length} 首
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-3xl mb-3">🎼</div>
          <p className="text-sm">还没有生成的歌曲</p>
          <p className="text-xs mt-1">在左侧开始创作你的第一首歌吧</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {tasks.map((task) => {
            const status = statusConfig[task.status];
            const isCurrent = task.id === currentTaskId;
            const isDeleting = deletingId === task.id;

            return (
              <div
                key={task.id}
                className={`p-3 rounded-lg border transition-all ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs font-medium"
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

                    <p className="text-sm text-gray-700 line-clamp-2 mb-1">
                      {task.lyrics}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{styleLabels[task.style] || task.style}</span>
                      <span>·</span>
                      <span>{task.mood}</span>
                      <span>·</span>
                      <span>{task.tempo}</span>
                    </div>

                    {/* 进度条 */}
                    {(task.status === 'pending' || task.status === 'processing') && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-400">进度</span>
                          <span className="text-indigo-600">{task.progress}%</span>
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 时长 */}
                    {task.status === 'completed' && task.result?.duration && (
                      <div className="mt-1 text-xs text-green-600">
                        时长: {Math.floor(task.result.duration / 60)}:{(task.result.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-1">
                    {task.status === 'completed' && (
                      <button
                        onClick={() => onPlay(task)}
                        className={`p-1.5 rounded transition-all ${
                          isCurrent
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={isDeleting}
                      className="p-1.5 rounded bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
