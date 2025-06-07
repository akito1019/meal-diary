# Git Flow 運用仕様書 - Meal Diary Project

## 1. ブランチ戦略

### ブランチの種類と役割

#### 1.1 永続的ブランチ

**main (本番環境ブランチ)**
- 本番環境にデプロイされるコード
- 直接のコミットは禁止
- タグ付けされたリリースバージョンのみ存在
- 全てのコミットは動作確認済みであること

**develop (開発ブランチ)**
- 次回リリースの開発用ブランチ
- feature ブランチからのマージ先
- 常に最新の開発状態を保持
- CI/CD による自動テストを通過していること

#### 1.2 一時的ブランチ

**feature (機能開発ブランチ)**
- 新機能・機能改善の開発
- develop から分岐し、develop へマージ
- 開発完了後は削除

**release (リリース準備ブランチ)**
- リリース前の最終調整用
- develop から分岐し、main と develop の両方へマージ
- バージョン番号の更新、リリースノート作成など
- リリース完了後は削除

**hotfix (緊急修正ブランチ)**
- 本番環境の緊急バグ修正用
- main から分岐し、main と develop の両方へマージ
- 修正完了後は削除

## 2. ブランチ命名規則

### 2.1 基本フォーマット

```
<type>/<ticket-number>-<short-description>
```

### 2.2 各ブランチタイプの命名規則

**feature ブランチ**
```
feature/MD-123-user-authentication
feature/MD-456-ai-meal-recognition
feature/MD-789-calendar-view
```

**release ブランチ**
```
release/1.0.0
release/1.1.0
release/2.0.0-beta
```

**hotfix ブランチ**
```
hotfix/1.0.1-fix-login-bug
hotfix/1.0.2-security-patch
```

### 2.3 命名規則の詳細

- **type**: ブランチの種類（feature, release, hotfix）
- **ticket-number**: 課題管理システムのチケット番号（例：MD-123）
- **short-description**: 簡潔な説明（kebab-case、英語、最大30文字）

## 3. PR（プルリクエスト）作成ルール

### 3.1 PRタイトル規約

```
[<type>] <ticket-number>: <description>
```

**例：**
```
[feat] MD-123: ユーザー認証機能の実装
[fix] MD-456: AI画像認識のエラーハンドリング修正
[docs] MD-789: API仕様書の更新
[refactor] MD-101: 食事記録コンポーネントのリファクタリング
```

### 3.2 PR説明テンプレート

```markdown
## 概要
このPRで実装・修正した内容の簡潔な説明

## 変更内容
- [ ] 実装した機能や修正内容1
- [ ] 実装した機能や修正内容2
- [ ] 実装した機能や修正内容3

## 技術的な変更点
- 使用した新しいライブラリやAPIの説明
- アーキテクチャの変更点
- パフォーマンスへの影響

## テスト方法
1. テスト手順1
2. テスト手順2
3. テスト手順3

## スクリーンショット（UI変更がある場合）
| Before | After |
|--------|-------|
| ![before](url) | ![after](url) |

## チェックリスト
- [ ] コードレビューの準備完了
- [ ] テストコードを追加/更新
- [ ] ドキュメントを更新
- [ ] TypeScriptの型エラーなし
- [ ] ESLintエラーなし
- [ ] ビルドが成功

## 関連Issue
- #123
- #456

## レビュアー
@reviewer1 @reviewer2
```

### 3.3 レビュープロセス

1. **セルフレビュー**
   - PR作成前に自身でコードを確認
   - 不要なコメント、console.logの削除
   - コーディング規約の遵守確認

2. **自動チェック**
   - CI/CDによる自動テスト
   - TypeScript型チェック
   - ESLint/Prettier
   - ビルドテスト

3. **ピアレビュー**
   - 最低1名のレビュアーによる承認が必要
   - セキュリティ関連の変更は2名以上
   - コード品質、設計、パフォーマンスの観点でレビュー

4. **フィードバック対応**
   - レビューコメントへの返信
   - 必要な修正の実施
   - 再レビューの依頼

## 4. コミットメッセージ規約

### 4.1 フォーマット

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 4.2 Type（必須）

- **feat**: 新機能
- **fix**: バグ修正
- **docs**: ドキュメントのみの変更
- **style**: コードの意味に影響しない変更（空白、フォーマット等）
- **refactor**: バグ修正や機能追加を伴わないコード変更
- **perf**: パフォーマンス改善
- **test**: テストの追加・修正
- **chore**: ビルドプロセスやツールの変更
- **ci**: CI/CD設定の変更
- **revert**: 以前のコミットの取り消し

### 4.3 Scope（オプション）

プロジェクトの主要なコンポーネントを指定：
- auth（認証）
- meals（食事記録）
- ai（AI機能）
- ui（UIコンポーネント）
- api（APIエンドポイント）
- db（データベース）

### 4.4 コミットメッセージ例

```
feat(auth): Google認証機能を追加

Supabase AuthのGoogle OAuth providerを使用した認証機能を実装。
ユーザーはGoogleアカウントでログインできるようになった。

Closes #123
```

```
fix(ai): 画像アップロード時のメモリリーク修正

大きな画像ファイルをアップロードした際にメモリが解放されない
問題を修正。画像処理後に明示的にクリーンアップを実行。

Fixes #456
```

## 5. マージ戦略

### 5.1 基本ルール

- **Squash and merge**: feature → develop
  - 複数のコミットを1つにまとめてマージ
  - クリーンな履歴を保持

- **Create a merge commit**: release/hotfix → main
  - マージコミットを作成
  - リリース履歴を明確に保持

- **Fast-forward merge**: hotfix → develop
  - 可能な限りfast-forwardマージ
  - コンフリクトがある場合はマージコミット

### 5.2 マージ前チェックリスト

- [ ] CI/CDのテストが全て成功
- [ ] レビューが承認済み
- [ ] コンフリクトが解決済み
- [ ] ブランチが最新のターゲットブランチと同期済み

## 6. タグ付けルール

### 6.1 バージョニング

セマンティックバージョニング（SemVer）を採用：
```
v<major>.<minor>.<patch>[-<pre-release>]
```

**例：**
- `v1.0.0` - 初回リリース
- `v1.1.0` - 新機能追加
- `v1.1.1` - バグ修正
- `v2.0.0-beta.1` - メジャーバージョンのベータ版

### 6.2 タグ作成タイミング

1. **本番リリース時**
   - main ブランチへのマージ後
   - リリースノートを含む annotated tag を作成

2. **プレリリース時**
   - ベータ版、RC版のリリース
   - `-beta.n`、`-rc.n` のサフィックスを付与

### 6.3 タグ作成コマンド

```bash
# 本番リリース
git tag -a v1.0.0 -m "Release version 1.0.0

Features:
- User authentication
- AI meal recognition
- Calendar view

Bug fixes:
- Fixed login timeout issue
- Improved image upload performance"

# プレリリース
git tag -a v2.0.0-beta.1 -m "Beta release for v2.0.0"

# タグをリモートにプッシュ
git push origin v1.0.0
```

## 7. ブランチ保護ルール

### 7.1 main ブランチ

- 直接プッシュを禁止
- PR経由でのみ変更可能
- 最低1名のレビュー承認が必要
- CI/CDテストの成功が必須
- 管理者のみマージ可能

### 7.2 develop ブランチ

- 直接プッシュを禁止
- PR経由でのみ変更可能
- 最低1名のレビュー承認が必要
- CI/CDテストの成功が必須

## 8. リリースフロー

### 8.1 通常リリース

1. develop から release ブランチを作成
2. バージョン番号の更新、リリースノート作成
3. QAテスト実施
4. バグ修正（必要に応じて）
5. main へマージ & タグ付け
6. develop へマージ
7. release ブランチを削除

### 8.2 ホットフィックス

1. main から hotfix ブランチを作成
2. バグ修正実施
3. バージョン番号の更新（パッチバージョン）
4. main へマージ & タグ付け
5. develop へマージ
6. hotfix ブランチを削除

## 9. 例外事項とトラブルシューティング

### 9.1 緊急時の対応

- 本番環境の重大なバグ：hotfix ブランチで即座に対応
- セキュリティ脆弱性：専用のsecurity/ブランチで対応（非公開）

### 9.2 コンフリクト解決

1. ターゲットブランチの最新を取得
2. ローカルでマージ/リベース
3. コンフリクトを解決
4. テスト実施
5. プッシュ

## 10. ツールとの連携

### 10.1 推奨ツール

- **課題管理**: GitHub Issues / Jira
- **CI/CD**: GitHub Actions / Vercel
- **コードレビュー**: GitHub Pull Requests
- **自動化**: Husky（pre-commit hooks）

### 10.2 自動化設定例

**.husky/pre-commit**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run type-check
npm run test
```

**.github/workflows/pr-check.yml**
```yaml
name: PR Check
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
```

---

この仕様書は、プロジェクトの成長に応じて適宜更新してください。
最終更新日: 2025年6月7日