import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SongGenerator } from './components/SongGenerator';
import { TaskList } from './components/TaskList';
import { AudioPlayer } from './components/AudioPlayer';
import { api, type SongTask } from './api/client';

function App() {
  const [tasks, setTasks] = useState<SongTask[]>([]);
  const [currentTask, setCurrentTask] = useState<SongTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const processingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'processing');
      
      for (const task of processingTasks) {
        try {
          const updated = await api.getTaskStatus(task.id);
          setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
          
          if (updated.status === 'completed' && currentTask?.id === task.id) {
            setCurrentTask(updated);
          }
        } catch (err) {
          console.error('Failed to poll task:', err);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [tasks, currentTask]);

  const handleGenerate = async (data: {
    lyrics: string;
    style: string;
    mood: string;
    tempo: string;
  }) => {
    setIsLoading(true);
    try {
      const result = await api.generateSong(data);
      const newTask: SongTask = {
        id: result.taskId,
        userId: 'anonymous',
        lyrics: data.lyrics,
        style: data.style,
        mood: data.mood,
        tempo: data.tempo,
        status: 'pending',
        progress: 0,
        estimatedTime: result.estimatedTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks(prev => [newTask, ...prev]);
      setCurrentTask(newTask);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (task: SongTask) => {
    setCurrentTask(task);
  };

  const handleDelete = async (taskId: string) => {
    try {
      await api.deleteSong(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      if (currentTask?.id === taskId) {
        setCurrentTask(null);
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 音乐主题背景图 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -2
      }} />
      
      {/* 深色遮罩层 - 确保内容可读 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.92) 0%, rgba(22, 33, 62, 0.88) 50%, rgba(15, 52, 96, 0.85) 100%)',
        zIndex: -1
      }} />

      <Header />
      
      {/* 左右分栏 */}
      <div style={{ 
        display: 'flex', 
        flex: 1,
        gap: '16px', 
        padding: '16px',
        overflow: 'hidden'
      }}>
        
        {/* 左半部分 - 歌曲生成控制面板 */}
        <div style={{ 
          width: '50%', 
          height: '100%', 
          overflow: 'auto',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(57, 255, 20, 0.1)'
        }}>
          <SongGenerator 
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>

        {/* 右半部分 - 任务列表和播放器 */}
        <div style={{ 
          width: '50%', 
          height: '100%', 
          overflow: 'auto',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(57, 255, 20, 0.1)'
        }}>
          {currentTask && currentTask.status === 'completed' && (
            <AudioPlayer task={currentTask} />
          )}
          <TaskList 
            tasks={tasks}
            onPlay={handlePlay}
            onDelete={handleDelete}
            currentTaskId={currentTask?.id}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
