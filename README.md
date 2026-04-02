# 音灵AI Web 🎵

音灵AI SoulMelody 的前端应用 - AI歌曲生成平台的用户界面。

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS v4
- **HTTP客户端**: 原生 fetch

## 功能特性

- 🎤 歌词编辑器
- 🎨 音乐风格选择（流行/摇滚/民谣/电子/古典/爵士）
- 😊 情感氛围选择
- ⚡ 节奏速度控制
- 📝 生成任务管理
- ▶️ 音频播放器
- 📊 实时进度追踪

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 预览
pnpm preview
```

## 开发环境配置

创建 `.env.local` 文件：

```env
# API 地址
VITE_API_URL=http://localhost:3000
```

## 与后端联调

确保后端服务已启动：

```bash
cd ../soulmelody
pnpm dev
```

前端会自动代理 API 请求到后端。

## 项目结构

```
src/
├── api/
│   └── client.ts        # API 客户端
├── components/
│   ├── Header.tsx       # 顶部导航
│   ├── SongGenerator.tsx # 歌曲生成表单
│   ├── TaskList.tsx     # 任务列表
│   └── AudioPlayer.tsx  # 音频播放器
├── App.tsx              # 主应用
└── main.tsx             # 入口
```

## 后端 API

详见 [soulmelody](https://github.com/lyq077-lu/soulmelody) 项目。

---

_让音乐创作触手可及 🎶_
