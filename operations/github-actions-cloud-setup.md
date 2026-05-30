# GitHub Actions クラウド実行セットアップ

## 目的

PCを起動していなくても、GitHub Actions上でnote運用の内部作業を回す。

自動化すること:

- 毎朝のnoteリサーチ
- 毎朝のXリサーチ
- 毎朝のYouTubeリサーチ
- 毎朝のGoogle/SEOリサーチ
- 毎朝の無料商品市場リサーチ
- 毎朝のネタ精査と候補キュー作成
- 毎朝のnoteドラフト作成
- 公開候補キュー作成
- 投稿用最終パッケージ作成
- 週次編集会議

自動化しないこと:

- note公開
- X投稿
- メール送信
- 購入者返信
- 削除
- 購入

## 必要なGitHub設定

### 1. Secretを追加

Repository Settings → Secrets and variables → Actions → Secrets に追加。

```text
OPENAI_API_KEY
```

### 2. 任意のVariableを追加

Repository Settings → Secrets and variables → Actions → Variables に追加。

```text
OPENAI_MODEL=gpt-5.2
```

未設定の場合は `gpt-5.2` を使う。

リサーチ時のWeb検索を止めたい場合のみ、以下を追加する。

```text
ENABLE_WEB_SEARCH=false
```

古い承認ログから手動でドラフト生成したい場合のみ、以下を一時的に追加する。

```text
ALLOW_OLD_APPROVAL=true
```

通常運用では未設定または `false` にする。

## 作成したworkflow

| Workflow | ファイル | 実行時刻 |
| --- | --- | --- |
| Automation preflight | `.github/workflows/automation-preflight.yml` | push時 / 手動 |
| Daily note research | `.github/workflows/daily-research.yml` | 07:00 JST |
| Daily note draft | `.github/workflows/daily-draft.yml` | 09:00 JST |
| Build note post-ready package | `.github/workflows/post-ready.yml` | 手動 |
| Weekly note editorial meeting | `.github/workflows/weekly-editorial.yml` | 日曜20:00 JST |

GitHub ActionsのcronはUTCなので、JSTに合わせて以下にしている。

- 07:00 JST = 22:00 UTC（前日）
- 09:00 JST = 00:00 UTC
- 日曜20:00 JST = 日曜11:00 UTC

## ローカルでの手動実行

```bash
npm install
npm run cloud:preflight
OPENAI_API_KEY=... npm run cloud:research
OPENAI_API_KEY=... npm run cloud:research:note
OPENAI_API_KEY=... npm run cloud:research:x
OPENAI_API_KEY=... npm run cloud:research:youtube
OPENAI_API_KEY=... npm run cloud:research:seo
OPENAI_API_KEY=... npm run cloud:research:market
OPENAI_API_KEY=... npm run cloud:curate
OPENAI_API_KEY=... npm run cloud:draft
npm run cloud:publish-queue
npm run cloud:post-ready
OPENAI_API_KEY=... npm run cloud:weekly
```

Windows PowerShell:

```powershell
$env:OPENAI_API_KEY="..."
npm run cloud:preflight
npm run cloud:research
npm run cloud:research:note
npm run cloud:research:x
npm run cloud:research:youtube
npm run cloud:research:seo
npm run cloud:research:market
npm run cloud:curate
npm run cloud:draft
npm run cloud:publish-queue
npm run cloud:post-ready
```

`cloud:preflight` はAPIキーなしで実行できる。必要ファイル、出力ディレクトリ、スクリプト構文の確認に使う。

`cloud:check-approval` は今日の日付の承認ログに `判断: 採用` があるか確認する。承認がない日は制作部を走らせない。

## 出力先

- リサーチ: `outputs/research/`
- ネタ候補キュー: `outputs/topic-queue/`
- ドラフト: `outputs/drafts/`
- 公開候補キュー: `outputs/publish-queue/`
- 投稿用最終パッケージ: `outputs/post-ready/`
- コメント返信案: `outputs/replies/`
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

- GitHub Actionsはネットワーク接続とOpenAI APIキーが必要。
- noteランキングなどリアルタイム情報の精度は、モデルのWeb検索機能や参照可能情報に依存する。
- リサーチworkflowではOpenAI Responses APIのWeb検索ツールを使う。
- リサーチは無料公開情報のみを使う。購入、無料トライアル登録、クレジットカード登録、有料記事の閲覧はしない。
- 外部投稿は絶対に自動化しない。
- 生成物は必ず社長が確認してから使う。
