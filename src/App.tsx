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

  // 轮询任务状态
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="w-full max-w-[1600px] mx-auto px-6 py-6">
        {/* 左右分栏布局 */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* 左半部分：歌曲生成控制面板 */}
          <div className="w-full lg:w-1/2">
            <SongGenerator 
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* 右半部分：任务列表和播放器 */}
          <div className="w-full lg:w-1/2 space-y-6">
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
      </main>
    </div>
  );
}

export default App;
