# 自動化されたGitHub開発ワークフロー

このプロジェクトでは、GitHub Actionsを使用して開発フローを自動化しています。

## 🚀 主な自動化機能

### 1. PR自動作成（Auto Create PR）

**機能概要:**
- feature/release/hotfixブランチをプッシュすると自動的にPRが作成されます
- Claude Codeでghコマンドが使用できない問題を解決

**動作条件:**
- `feature/**`、`release/**`、`hotfix/**` ブランチへのプッシュ時
- 同じブランチのPRが存在しない場合のみ作成

**自動設定内容:**
- PRタイトル: ブランチ名とコミットメッセージから自動生成
- ベースブランチ: feature/release → develop、hotfix → main
- 初期状態: ドラフトPRとして作成
- ラベル: ブランチタイプに応じて自動付与

### 2. Claude自動レビュー（Claude Auto Review）

**機能概要:**
- PRが作成・更新されると、Claude APIが自動でコードレビューを実施
- プロジェクト固有のルールに基づいた詳細なフィードバック

**レビュー内容:**
- TypeScript型安全性
- React/Next.jsベストプラクティス
- Mantine UIの適切な使用
- セキュリティチェック
- パフォーマンス考慮事項

**動作条件:**
- ドラフトでないPRの作成・更新時
- PRへのコメント追加時

### 3. 自動ラベリング

**ファイルベースのラベル:**
- frontend: フロントエンドコードの変更
- backend: API/バックエンドの変更
- ui: UIコンポーネントやスタイリングの変更
- ai: AI機能関連の変更
- database: データベーススキーマの変更
- documentation: ドキュメントの更新
- config: 設定ファイルの変更
- test: テストコードの変更
- dependencies: パッケージ依存関係の変更

**PRサイズラベル:**
- size/XS: 10行以下
- size/S: 100行以下
- size/M: 500行以下
- size/L: 1000行以下
- size/XL: 1000行超

## 📝 開発フローの例

### 1. 新機能開発

```bash
# 1. featureブランチを作成して作業
git checkout -b feature/MD-123-new-feature

# 2. 変更をコミット
git add .
git commit -m "feat: 新機能の実装"

# 3. プッシュ（PR自動作成）
git push -u origin feature/MD-123-new-feature
```

→ GitHub Actionsが自動的にドラフトPRを作成
→ PRページで「Ready for review」にすると自動レビュー開始

### 2. 緊急修正

```bash
# 1. mainから hotfixブランチを作成
git checkout main
git checkout -b hotfix/1.0.1-critical-bug

# 2. 修正をコミット
git add .
git commit -m "fix: 重要なバグの修正"

# 3. プッシュ（PR自動作成）
git push -u origin hotfix/1.0.1-critical-bug
```

→ mainブランチへのPRが自動作成（urgentラベル付き）
→ Claude自動レビューで迅速なフィードバック

## 🔧 設定方法

### 必要なシークレット

GitHubリポジトリの Settings > Secrets and variables > Actions で以下を設定:

```
ANTHROPIC_API_KEY: Claude APIキー
```

### カスタマイズ

各ワークフローファイルは `.github/workflows/` にあります：
- `auto-create-pr.yml`: PR自動作成の設定
- `claude-auto-review.yml`: 自動レビューの設定
- `labeler.yml`: ラベル付けルール

## 💡 Tips

### PR作成を自動化したくない場合

通常通り手動でPRを作成することも可能です。その場合も自動レビューは実行されます。

### ドラフトPRの活用

自動作成されるPRはドラフト状態で作成されるため：
- 作業継続中は自動レビューが実行されない
- 準備ができたら「Ready for review」で本格的なレビュー開始

### レビューコメントへの対応

Claude自動レビューのコメントは参考情報です。必要に応じて：
- 提案を採用して修正
- 理由を説明してそのまま進める
- 人間のレビュアーと議論

## 🚨 注意事項

1. **自動PRの重複**: 同じブランチで既にPRが存在する場合は新規作成されません
2. **ベースブランチ**: hotfixはmain、それ以外はdevelopがベースになります
3. **APIレート制限**: Claude APIの使用量に注意してください
4. **セキュリティ**: シークレットは絶対にコードに含めないでください

---

この自動化により、開発者は本質的なコーディングに集中でき、定型的な作業は自動化されます。