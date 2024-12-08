# E 卡牌游戏

[English](README.md) | [日本語](README_ja.md)

一款来自《赌博默示录》的卡牌游戏，使用 React 和 TypeScript 构建，具有独特的下注系统和策略玩法。

<div align="center">
    <img src="https://static.wikia.nocookie.net/vsbattles/images/2/2b/Kaijiproperrender.png/revision/latest?cb=20180520034603" alt="伊藤开司" />
</div>

## 游戏规则

### 卡牌
- **皇帝 (E)**：胜过平民 (C)
- **平民 (C)**：胜过奴隶 (S)
- **奴隶 (S)**：胜过皇帝 (E)

### 胜利条件
- 标准胜利：胜者获得 ￥100,000 乘以赌注
- 特殊胜利：如果奴隶胜过皇帝，胜者获得 ￥500,000 乘以赌注
- 平局：当双方出相同卡牌时，继续使用剩余卡牌进行下一轮

### 游戏流程
1. 开始时拥有 30 个筹码
2. 下注（1 到所有筹码）
3. 选择要出的卡牌
4. 电脑选择卡牌
5. 根据卡牌等级决定胜者
6. 游戏进行 5 轮或直到一方筹码耗尽

## 功能特点

- 🌐 多语言支持（英语、中文、日语）
- 💰 动态下注系统
- 🎮 策略性卡牌选择
- 🎯 特殊胜利条件
- 🔄 自动游戏状态管理
- 📱 响应式设计

## 技术栈

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui 组件

## 快速开始

### 前置条件

- Node.js (v18 或更高)
- npm 或 yarn

### 安装步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/ShinoharaHaruna/ECard.git
   cd Ecard
   ```

2. 安装依赖
   ```bash
   npm install
   # 或者 yarn install
   ```

3. 启动开发服务器
   ```bash
   npm run dev
   # 或者 yarn dev
   ```

4. 打开浏览器并访问 `http://localhost:5173`，开始游戏！

### 环境变量

在根目录创建 `.env` 文件：

```bash
VITE_DEBUG_MODE=false  # 设置为 true 以显示电脑的卡牌
```

## 开发

项目结构：

```bash
src/
  ├── components/     # React 组件
  ├── i18n/          # 翻译文件
  ├── lib/           # 游戏逻辑和工具
  ├── types/         # TypeScript 类型定义
  └── App.tsx        # 主应用组件
```

## 许可证

依据 MIT 许可证分发。详情见 `LICENSE` 文件。

本项目**不持有**任何涉及《赌博默示录》内容的版权。
