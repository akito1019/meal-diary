# Meal Diary セットアップガイド

## 前提条件
- Node.js 18以上
- Supabaseアカウント
- OpenAI APIキー（AI機能用）

## セットアップ手順

### 1. 環境変数の設定
`.env.local.example`を`.env.local`にコピーして、以下の値を設定してください：

```bash
cp .env.local.example .env.local
```

必要な環境変数：
- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの匿名キー
- `SUPABASE_SERVICE_ROLE_KEY`: Supabaseのサービスロールキー
- `OPENAI_API_KEY`: OpenAI APIキー

### 2. Supabaseプロジェクトの設定

1. [Supabase](https://supabase.com)で新しいプロジェクトを作成
2. プロジェクトの設定から上記の環境変数に必要な値を取得
3. データベーステーブルの作成（後述のSQLを実行）

### 3. 依存関係のインストール

```bash
npm install
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

### 5. Google認証の設定（オプション）

1. Supabaseダッシュボードで Authentication > Providers へ移動
2. Googleプロバイダーを有効化
3. Google Cloud ConsoleでOAuth 2.0クライアントIDを作成
4. リダイレクトURIに `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback` を追加

## プロジェクト構造

```
meal-diary/
├── app/              # Next.js App Router
├── components/       # 共通コンポーネント
├── hooks/           # カスタムフック
├── lib/             # ライブラリ設定
│   └── supabase/    # Supabaseクライアント
├── types/           # TypeScript型定義
└── utils/           # ユーティリティ関数
```

## 開発の進め方

各グループごとに並行開発が可能です。詳細は`DEVELOPMENT_TICKETS.md`を参照してください。