import { useState } from 'react';
import type { SongTask } from '../api/client';

interface TaskListProps {
  tasks: SongTask[];
  onPlay: (task: SongTask) => void;
  onDelete: (taskId: string) => void;
  currentTaskId?: string;
}

const statusConfig = {
  pending: { label: '等待中', color: '#fbbf24' },
  processing: { label: '生成中', color: '#39ff14' },
  completed: { label: '已完成', color: '#10b981' },
  failed: { label: '失败', color: '#ef4444' },
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
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        borderBottom: '1px solid rgba(57, 255, 20, 0.3)',
        paddingBottom: '12px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#39ff14',
          textShadow: '0 0 10px rgba(57, 255, 20, 0.3)'
        }}>
          生成记录
        </h2>
        <span style={{
          fontSize: '12px',
          color: '#888',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          padding: '4px 10px',
          borderRadius: '12px'
        }}>
          {tasks.length} 首
        </span>
      </div>

      {tasks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 0',
          color: '#666'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎼</div>
          <p style={{ fontSize: '14px' }}>还没有生成的歌曲</p>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>在左侧开始创作你的第一首歌吧</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
          {tasks.map((task) => {
            const status = statusConfig[task.status];
            const isCurrent = task.id === currentTaskId;
            const isDeleting = deletingId === task.id;

            return (
              <div
                key={task.id}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: isCurrent 
                    ? '1px solid #39ff14' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: isCurrent ? 'rgba(57, 255, 20, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 500,
                        backgroundColor: `${status.color}20`,
                        color: status.color
                      }}>
                        {status.label}
                      </span>
                      <span style={{ fontSize: '11px', color: '#666' }}>
                        {formatTime(task.createdAt)}
                      </span>
                    </div>

                    <p style={{
                      fontSize: '14px',
                      color: '#e0e0e0',
                      marginBottom: '6px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {task.lyrics}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#888' }}>
                      <span>{styleLabels[task.style] || task.style}</span>
                      <span>·</span>
                      <span>{task.mood}</span>
                      <span>·</span>
                      <span>{task.tempo}</span>
                    </div>

                    {/* 进度条 */}
                    {(task.status === 'pending' || task.status === 'processing') && (
                      <div style={{ marginTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                          <span style={{ color: '#666' }}>进度</span>
                          <span style={{ color: '#39ff14' }}>{task.progress}%</span>
                        </div>
                        <div style={{ height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              backgroundColor: '#39ff14',
                              borderRadius: '2px',
                              transition: 'width 0.5s',
                              width: `${task.progress}%`
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 时长 */}
                    {task.status === 'completed' && task.result?.duration && (
                      <div style={{ marginTop: '6px', fontSize: '11px', color: '#10b981' }}>
                        时长: {Math.floor(task.result.duration / 60)}:{(task.result.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {task.status === 'completed' && (
                      <button
                        onClick={() => onPlay(task)}
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: isCurrent ? '#39ff14' : 'rgba(255, 255, 255, 0.1)',
                          color: isCurrent ? '#1a1a2e' : '#e0e0e0',
                          cursor: 'pointer'
                        }}
                      >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={isDeleting}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#e0e0e0',
                        cursor: isDeleting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isDeleting ? (
                        <span>...</span>
                      ) : (
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
