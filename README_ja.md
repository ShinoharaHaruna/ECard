# E カードゲーム

[English](README.md) | [中文](README_cn.md)

『カイジ』からのカードゲームで、React と TypeScript を使用して構築され、ユニークなベッティングシステムと戦略的なゲームプレイが特徴です。

<div align="center">
    <img src="https://static.wikia.nocookie.net/vsbattles/images/2/2b/Kaijiproperrender.png/revision/latest?cb=20180520034603" alt="伊藤カイジ" />
</div>

## ゲームルール

### カード
- **皇帝 (E)**：市民 (C) に勝つ
- **市民 (C)**：奴隷 (S) に勝つ
- **奴隷 (S)**：皇帝 (E) に勝つ

### 勝利条件
- 通常勝利：勝者は賭け金の ￥100,000 倍を獲得
- 特別勝利：奴隷が皇帝に勝つと、勝者は賭け金の ￥500,000 倍を獲得
- 引き分け：両者が同じカードを出した場合、残りのカードで続行

### ゲームプレイ
1. 30 枚のチップで開始
2. ベットを置く（1 から全チップまで）
3. 出すカードを選ぶ
4. コンピュータがカードを選ぶ
5. カードの階層に基づいて勝者を決定
6. 5 ラウンド続行、またはどちらかがチップを使い果たすまで

## 機能

- 🌐 多言語サポート（英語、中国語、日本語）
- 💰 ダイナミックなベッティングシステム
- 🎮 戦略的なカード選択
- 🎯 特別勝利条件
- 🔄 自動ゲーム状態管理
- 📱 レスポンシブデザイン

## 技術スタック

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui コンポーネント

## はじめに

### 必要条件

- Node.js (v18 以上)
- npm または yarn

### インストール

1. リポジトリをクローン
   ```bash
   git clone https://github.com/ShinoharaHaruna/ECard.git
   cd Ecard
   ```

2. 依存関係をインストール
   ```bash
   npm install
   # または yarn install
   ```

3. 開発サーバーを起動
   ```bash
   npm run dev
   # または yarn dev
   ```

4. ブラウザで `http://localhost:5173` にアクセスして、ゲームを開始！

### 環境変数

ルートディレクトリに `.env` ファイルを作成：

```bash
VITE_DEBUG_MODE=false  # コンピュータのカードを表示するには true に設定
```

## 開発

プロジェクト構造：

```bash
src/
  ├── components/     # React コンポーネント
  ├── i18n/          # 翻訳ファイル
  ├── lib/           # ゲームロジックとユーティリティ
  ├── types/         # TypeScript 型定義
  └── App.tsx        # メインアプリケーションコンポーネント
```

## ライセンス

MIT ライセンスの下で配布されています。詳細は `LICENSE` を参照してください。

このプロジェクトは『カイジ』に関するすべてのコンテンツの著作権を**保持していません**。
