# GitHub Actions セットアップ

## 目的

OpenAI API課金を使わず、GitHub ActionsではCodex Businessで実行する作業のリマインドとダッシュボード整理だけを行う。

GitHub Actionsで自動化すること:

- preflight
- Codex実行リマインド作成
- ダッシュボード更新
- 公開候補キュー/投稿パッケージの機械的整理

自動化しないこと:

- OpenAI APIを使ったAI生成
- note公開
- X投稿
- メール送信
- 購入者返信
- 削除
- 購入

## 必要なGitHub設定

### 1. Workflow permissions

Repository Settings → Actions → General で `Read and write permissions` を選ぶ。

### 2. 任意のVariableを追加

Repository Settings → Secrets and variables → Actions → Variables に追加。

```text
ALLOW_OLD_APPROVAL=false
```

通常は未設定でもよい。古い承認ログから投稿パッケージを整理したい場合だけ `true` にする。

## 作成したworkflow

| Workflow | ファイル | 実行時刻 |
| --- | --- | --- |
| Automation preflight | `.github/workflows/automation-preflight.yml` | push時 / 手動 |
| Daily Codex research reminder | `.github/workflows/daily-research.yml` | 19:00 JST |
| Daily Codex draft reminder | `.github/workflows/daily-draft.yml` | 22:00 JST |
| Build note post-ready package | `.github/workflows/post-ready.yml` | 手動 |
| Weekly Codex editorial reminder | `.github/workflows/weekly-editorial.yml` | 日曜20:00 JST |

GitHub ActionsのcronはUTCなので、JSTに合わせて以下にしている。

- 19:00 JST = 10:00 UTC
- 22:00 JST = 13:00 UTC
- 日曜20:00 JST = 日曜11:00 UTC

## ローカルでの手動実行

```bash
npm install
npm run cloud:preflight
node scripts/build-codex-reminder.mjs daily
npm run cloud:publish-queue
npm run cloud:post-ready
npm run cloud:dashboard
```

Windows PowerShell:

```powershell
npm run cloud:preflight
node scripts/build-codex-reminder.mjs daily
npm run cloud:publish-queue
npm run cloud:post-ready
npm run cloud:dashboard
```

`cloud:preflight` はAPIキーなしで実行できる。必要ファイル、出力ディレクトリ、スクリプト構文の確認に使う。

`cloud:check-approval` は今日の日付の承認ログに `判断: 採用` があるか確認する。

## 出力先

- リサーチ: `outputs/research/`
- ネタ候補キュー: `outputs/topic-queue/`
- ドラフト: `outputs/drafts/`
- 公開候補キュー: `outputs/publish-queue/`
- 投稿用最終パッケージ: `outputs/post-ready/`
- コメント返信案: `outputs/replies/`
- Codex実行リマインド: `outputs/reminders/`
- 週次編集会議: `outputs/metrics/`
- ダッシュボード: `outputs/dashboard.md`

workflowは成果物Markdownを自動コミットする。

## ダッシュボード

GitHub Actions実行後、`outputs/dashboard.md` が更新される。

ここを見ると以下が分かる。

- 最新リサーチ
- ネタ候補キュー
- 社長への決済依頼
- 最新ドラフト
- 公開候補キュー
- 投稿用最終パッケージ
- コメント返信案
- 公開済み記事
- メトリクス
- 手動でやるべきこと

## 注意

- GitHub ActionsではOpenAI APIキーを使わない。
- AI生成はCodex Business内で行う。
- リサーチは無料公開情報のみを使う。購入、無料トライアル登録、クレジットカード登録、有料記事の閲覧はしない。
- 外部投稿は絶対に自動化しない。
- 生成物は必ず社長が確認してから使う。
