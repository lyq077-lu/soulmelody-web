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
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景图 - 固定不动 */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920&q=80')`,
        }}
      >
        {/* 渐变遮罩 - 增强悬浮效果对比 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/85 via-[#1e1b4b]/80 to-[#0f172a]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-transparent to-[#0f172a]/50" />
      </div>

      {/* 内容 - 悬浮于背景之上 */}
      <div className="relative z-10">
        <Header />
        
        <main className="w-full max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          {/* 左右分栏布局 - 自适应 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 xl:gap-8 items-start">
            
            {/* 左半部分：歌曲生成控制面板 */}
            <div className="w-full">
              <SongGenerator 
                onGenerate={handleGenerate}
                isLoading={isLoading}
              />
            </div>

            {/* 右半部分：任务列表和播放器 */}
            <div className="w-full space-y-4 sm:space-y-5 lg:space-y-6">
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
    </div>
  );
}

export default App;
