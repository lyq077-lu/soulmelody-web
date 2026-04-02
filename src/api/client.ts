const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface SongTask {
  id: string;
  userId: string;
  lyrics: string;
  style: string;
  mood: string;
  tempo: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  estimatedTime: number;
  createdAt: string;
  updatedAt: string;
  result?: {
    audioUrl?: string;
    duration?: number;
    format?: string;
    sampleRate?: number;
  };
  error?: string;
}

export interface GenerateSongInput {
  lyrics: string;
  style: string;
  mood: string;
  tempo: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async generateSong(data: GenerateSongInput): Promise<{
    success: boolean;
    taskId: string;
    message: string;
    estimatedTime: number;
  }> {
    return this.fetch('/api/v1/songs/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTaskStatus(taskId: string): Promise<SongTask> {
    return this.fetch(`/api/v1/songs/status/${taskId}`);
  }

  async getTask(taskId: string): Promise<{ success: boolean; data: SongTask }> {
    return this.fetch(`/api/v1/songs/${taskId}`);
  }

  async listSongs(page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    data: SongTask[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  }> {
    return this.fetch(`/api/v1/songs/list?page=${page}&limit=${limit}`);
  }

  async deleteSong(taskId: string): Promise<{ success: boolean; message: string }> {
    return this.fetch(`/api/v1/songs/${taskId}`, {
      method: 'DELETE',
    });
  }

  getAudioUrl(taskId: string): string {
    return `${this.baseUrl}/api/v1/songs/download/${taskId}`;
  }
}

export const api = new ApiClient(API_BASE_URL);
