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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      {/* 左右分栏 - 各占50%，减少内边距 */}
      <div style={{ display: 'flex', height: 'calc(100vh - 45px)', gap: '12px', padding: '12px' }}>
        
        {/* 左半部分 - 歌曲生成控制面板 */}
        <div style={{ width: '50%', height: '100%', overflow: 'auto' }}>
          <SongGenerator 
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>

        {/* 右半部分 - 任务列表和播放器 */}
        <div style={{ width: '50%', height: '100%', overflow: 'auto' }}>
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
