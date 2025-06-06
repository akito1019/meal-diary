# 🛠️ Meal Diary - 開発ガイドライン

## 📋 開発前の確認事項

### 必須チェックリスト
- [ ] `PROJECT_PROGRESS.md` で最新の進捗状況を確認
- [ ] 担当チケットの依存関係を確認
- [ ] 必要な環境変数が設定されているか確認
- [ ] データベースマイグレーションが最新か確認

### 環境設定
```bash
# 必要な環境変数 (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

---

## 🏗️ アーキテクチャ概要

### ディレクトリ構造
```
meal-diary/
├── app/                    # Next.js App Router
│   ├── api/               # API エンドポイント
│   ├── auth/              # 認証関連ページ
│   ├── components/        # ページ固有コンポーネント
│   └── (protected)/       # 認証必須ページ
├── components/            # 共通コンポーネント
│   ├── ai/               # AI関連UI
│   ├── auth/             # 認証コンポーネント
│   ├── common/           # 共通UI
│   ├── layout/           # レイアウト
│   ├── nutrition/        # 栄養関連
│   └── providers/        # コンテキストプロバイダー
├── hooks/                # カスタムフック
├── lib/                  # 外部ライブラリ設定
├── types/                # TypeScript型定義
├── utils/                # ユーティリティ関数
└── supabase/             # データベース関連
```

### 技術スタック
- **フレームワーク**: Next.js 15 (App Router)
- **スタイリング**: Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **AI**: OpenAI GPT-4V
- **言語**: TypeScript

---

## 🎯 グループ別開発ガイド

### 🔴 Group A: インフラ・基盤チーム

#### 完了済み機能
- ✅ プロジェクト初期設定
- ✅ データベース設計・構築
- ✅ 認証機能（メール/パスワード）

#### 残りタスク
- **Ticket #4: Google認証機能**

#### 開発時の注意点
- Supabase設定変更時は他チームに事前連絡
- 型定義変更時は影響範囲を確認
- セキュリティ関連の変更は必ずレビュー

### 🟢 Group B: UI/UXチーム

#### 完了済み機能
- ✅ レイアウト・ナビゲーション
- ✅ ホーム画面（カレンダービュー）
- ✅ ホーム画面（ポートフォリオビュー）

#### 残りタスク
- **Ticket #13: ローディング・エラー処理**
- **Ticket #14: アニメーション・トランジション**

#### 開発時の注意点
- レスポンシブ対応必須（モバイルファースト）
- アクセシビリティを考慮
- 既存のデザインシステムに準拠

### 🔵 Group C: 機能開発チーム

#### 完了済み機能
- ✅ 食事タイプ管理機能

#### 残りタスク (優先度高)
- **Ticket #9: 食事記録作成画面（基本機能）**
- **Ticket #10: 食事詳細・編集画面**

#### 開発時の注意点
- Group DのAI機能との統合が必要
- 画像アップロード機能はSupabase Storageを使用
- 栄養計算は `utils/nutrition.ts` の関数を活用

### 🟡 Group D: AI・最適化チーム

#### 完了済み機能
- ✅ AI画像認識API
- ✅ AI認識結果UI
- ✅ パフォーマンス最適化

#### 今後のタスク
- Group CのUI実装サポート
- AI機能の精度向上
- パフォーマンス監視

---

## 🔄 開発フロー

### 1. ブランチ戦略
```bash
# 新機能開発
git checkout -b feature/ticket-XX-feature-name

# バグ修正
git checkout -b fix/bug-description

# ホットフィックス
git checkout -b hotfix/urgent-fix
```

### 2. コミットメッセージ規約
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードフォーマット
refactor: リファクタリング
test: テスト追加・修正
chore: その他の変更

例: feat(auth): Google認証機能を追加
```

### 3. プルリクエスト
- チケット番号を含める
- 変更内容を明確に記載
- スクリーンショット添付（UI変更時）
- レビュワーを指定

---

## 🧪 テスト戦略

### API テスト
```bash
# API エンドポイントテスト
curl -X POST http://localhost:3000/api/meal-types \
  -H "Content-Type: application/json" \
  -d '{"name": "朝食", "color": "#FF6B6B"}'
```

### 統合テスト
- 認証フロー
- AI画像分析フロー
- 食事記録CRUD操作

---

## 🚀 デプロイ・運用

### 環境
- **開発**: localhost:3000
- **ステージング**: Vercel プレビューデプロイ
- **本番**: Vercel 本番環境

### デプロイ前チェックリスト
- [ ] TypeScriptエラーなし
- [ ] ESLintエラーなし
- [ ] ビルドエラーなし
- [ ] 主要機能の動作確認
- [ ] Lighthouse スコア確認（90点以上推奨）

---

## 🔧 トラブルシューティング

### よくある問題

#### Supabase接続エラー
```bash
# 環境変数を確認
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### OpenAI API エラー
```bash
# APIキーを確認
echo $OPENAI_API_KEY
```

#### ビルドエラー
```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install
```

### ログ確認
```bash
# 開発サーバーログ
npm run dev

# Vercelデプロイログ
vercel logs
```

---

## 📚 参考資料

### 外部ドキュメント
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Tailwind CSS](https://tailwindcss.com/docs)

### プロジェクト内ドキュメント
- `REQUIREMENTS.md` - 要件定義
- `DEVELOPMENT_TICKETS.md` - 開発チケット一覧
- `PROJECT_PROGRESS.md` - 進捗管理
- `README.md` - プロジェクト概要

---

## 🤝 コミュニケーション

### 定期ミーティング
- **スタンドアップ**: 毎日朝9:00
- **スプリントレビュー**: 毎週金曜16:00
- **振り返り**: 隔週金曜17:00

### 連絡事項
- **緊急**: Slackの #meal-diary-urgent チャンネル
- **質問**: Slackの #meal-diary-dev チャンネル
- **進捗報告**: `PROJECT_PROGRESS.md` を更新

### コードレビュー
- 必ず他のチームメンバーがレビュー
- セキュリティ関連は2人以上でレビュー
- UI/UX変更はデザイナーも確認

---

**最終更新日**: 2024-12-06  
**作成者**: Group D (AI・最適化チーム)  
**次回更新予定**: 新機能実装時