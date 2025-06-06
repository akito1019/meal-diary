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

### 5. Google認証の設定（推奨）

#### Supabaseでの設定
1. Supabaseダッシュボードで Authentication > Providers へ移動
2. Googleプロバイダーを有効化
3. 以下の情報を後で設定するためメモしておく：
   - Redirect URL: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

#### Google Cloud Consoleでの設定
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. APIs & Services > Credentials に移動
4. 「+ CREATE CREDENTIALS」> 「OAuth client ID」を選択
5. アプリケーションタイプで「Web application」を選択
6. 承認済みリダイレクトURIに以下を追加：
   - `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback`（開発用）
7. 作成後、Client IDとClient Secretをコピー
8. SupabaseのGoogle Provider設定に貼り付け

#### 注意事項
- 本番環境では適切なドメインを設定してください
- Google OAuth同意画面の設定も必要な場合があります

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