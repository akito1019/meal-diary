# 食事記録アプリ「Meal Diary」要件定義書

## 概要
筋トレ・体づくりのための食事内容を記録するWebアプリケーション。
写真から食事内容をAIが自動認識し、カロリーやPFC（タンパク質・脂質・炭水化物）を記録できる。

## 技術スタック
- **フロントエンド**: Next.js 14 (App Router)
- **スタイリング**: Mantine UI v8
- **アイコン**: @tabler/icons-react
- **バックエンド**: Supabase
  - 認証（Auth）
  - データベース（PostgreSQL）
  - ファイルストレージ（Storage）
- **AI画像認識**: OpenAI Vision API (gpt-4o)
- **開発言語**: TypeScript

## 機能要件

### 1. ユーザー認証
- メール/パスワードによる認証
- Googleアカウントによる認証
- ログイン/ログアウト機能
- パスワードリセット機能

### 2. 食事記録機能
- **写真アップロード**
  - 最大ファイルサイズ: 5MB
  - 対応形式: JPEG, PNG, WebP
  - Supabase Storageに保存
  
- **AI食事認識**
  - OpenAI Vision API (gpt-4o)を使用
  - 認識精度目標: 80%
  - 複数の候補を提示（ユーザーが選択可能）
  - 認識できなかった場合の手動入力対応
  - 画像類似度による過去の食事提案機能
  - 信頼度スコアと推論理由の表示
  
- **栄養情報記録**
  - カロリー（kcal）
  - タンパク質（g）
  - 脂質（g）
  - 炭水化物（g）
  - メモ欄（自由記述）
  
- **食事タイプ機能**
  - 既存タイプから選択（ドロップダウン）
  - 新規タイプの作成機能（モーダル）
  - デフォルトタイプ：朝食、昼食、夕食、間食、プロテイン
  - ユーザーごとにタイプを管理
  - ドラッグ＆ドロップで並び替え可能
  
- **記録の管理**
  - 編集機能
  - 削除機能
  - 記録日時の自動保存

### 3. 記録閲覧機能
- **表示形式の切り替え**
  - カレンダービュー（月表示）※未実装
  - ポートフォリオビュー（写真グリッド表示）
  - 表示切り替えボタン
- 日別の記録一覧
- 月間サマリー表示
- 写真のサムネイル表示
- 今日の栄養摂取量サマリー（ダッシュボード）

### 4. レスポンシブ対応
- モバイルファースト設計
- スマートフォンでの使いやすさを重視
- タブレット・PCでも適切に表示
- ボトムナビゲーション（モバイルのみ）
- Mantineのレスポンシブユーティリティ使用

## 非機能要件
- **パフォーマンス**: 画像アップロード後3秒以内にAI認識結果を表示
- **セキュリティ**: Supabase RLS（Row Level Security）によるデータ保護
- **可用性**: Supabaseの可用性に準拠

## データベース設計

### users（Supabase Auth標準）
- id (UUID)
- email
- created_at

### profiles
- id (UUID, users.idを参照)
- username (text)
- email (text)
- created_at (timestamp)
- updated_at (timestamp)

### meals
- id (UUID)
- user_id (UUID, users.idを参照)
- meal_type_id (UUID, meal_types.idを参照)
- image_url (text)
- meal_name (text)
- calories (integer)
- protein (decimal)
- fat (decimal)
- carbs (decimal)
- memo (text, nullable)
- recorded_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)

### meal_types
- id (UUID)
- user_id (UUID, users.idを参照)
- name (text, unique per user)
- display_order (integer)
- created_at (timestamp)
- updated_at (timestamp)

### meal_suggestions
- id (UUID)
- meal_id (UUID, meals.idを参照)
- suggestion_name (text)
- confidence (decimal)
- selected (boolean)
- created_at (timestamp)

## 画面構成
1. **ログイン/登録画面**
2. **ホーム画面**
   - カレンダービュー/ポートフォリオビュー切り替え
   - 表示切り替えボタン
3. **食事記録画面**（写真アップロード・入力）
   - 食事タイプ選択（新規作成可能）
4. **食事詳細画面**（個別の記録表示・編集）
5. **プロフィール画面**

## 実装済みの追加機能
- 画像類似度による過去食事の検索
- 食事タイプの並び替え機能
- トースト通知（Mantine Notifications）
- スケルトンローダー
- プログレッシブな画像アップロード

## 今後の拡張予定
- 目標設定機能（現在はハードコード）
- 進捗グラフ表示
- データエクスポート機能（CSV）
- 決済機能（プレミアムプラン）
- PWA対応（manifest.tsは実装済み、service worker未実装）
- カレンダービューの実装

## API設計

### エンドポイント一覧
- `GET /api/auth/callback` - Supabase認証コールバック
- `POST /api/auth/signout` - ログアウト
- `GET /api/meals` - 食事記録一覧取得
- `POST /api/meals` - 食事記録作成
- `GET /api/meals/[id]` - 食事記録取得
- `PUT /api/meals/[id]` - 食事記録更新
- `DELETE /api/meals/[id]` - 食事記録削除
- `GET /api/meals/suggestions` - 画像類似度による提案取得
- `POST /api/ai/analyze-meal` - 画像AI分析
- `GET /api/meal-types` - 食事タイプ一覧取得
- `POST /api/meal-types` - 食事タイプ作成
- `PUT /api/meal-types/[id]` - 食事タイプ更新
- `DELETE /api/meal-types/[id]` - 食事タイプ削除
- `POST /api/meal-types/reorder` - 食事タイプ並び替え
- `POST /api/upload` - 画像アップロード

※認証処理は主にSupabase Auth直接使用

## 環境変数
```env
NEXT_PUBLIC_SUPABASE_URL=      # Supabase プロジェクトURL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase アノニマスキー
OPENAI_API_KEY=                # OpenAI APIキー（Vision API用）
```

## UI/UXガイドライン
- **UIフレームワーク**: Mantine UI v8
- **カラーパレット**: Mantineのデフォルトテーマ（カスタマイズ可能）
- **アイコン**: @tabler/icons-react
- **レイアウト**: カード型デザインでコンテンツを整理
- **アニメーション**: Mantineのトランジション効果
- **エラーハンドリング**: トースト通知システム（Mantine Notifications）
- **モバイルUI**: ボトムナビゲーション実装

## テスト計画
- **単体テスト**: Jest + React Testing Library
- **E2Eテスト**: Playwright（将来的に）
- **パフォーマンステスト**: Lighthouse

## デプロイ
- **ホスティング**: Vercel
- **データベース**: Supabase (PostgreSQL)
- **ストレージ**: Supabase Storage
- **ドメイン**: 未定

## 開発フェーズ
1. **Phase 1**: 基本機能実装（認証、記録、閲覧）✅ 完了
2. **Phase 2**: AI認識機能実装 ✅ 完了
3. **Phase 3**: UI/UX改善 ✅ 部分的に完了
4. **Phase 4**: 拡張機能実装（進行中）
   - カレンダービュー実装
   - 目標設定機能
   - 進捗グラフ表示
   - データエクスポート
   - PWA対応