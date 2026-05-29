# GitHub Actions クラウド実行セットアップ

## 目的

PCを起動していなくても、GitHub Actions上でnote運用の内部作業を回す。

自動化すること:

- 毎朝のnoteリサーチ
- 毎朝のnoteドラフト作成
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

## 作成したworkflow

| Workflow | ファイル | 実行時刻 |
| --- | --- | --- |
| Daily note research | `.github/workflows/daily-research.yml` | 07:00 JST |
| Daily note draft | `.github/workflows/daily-draft.yml` | 09:00 JST |
| Weekly note editorial meeting | `.github/workflows/weekly-editorial.yml` | 日曜20:00 JST |

GitHub ActionsのcronはUTCなので、JSTに合わせて以下にしている。

- 07:00 JST = 22:00 UTC（前日）
- 09:00 JST = 00:00 UTC
- 日曜20:00 JST = 日曜11:00 UTC

## ローカルでの手動実行

```bash
npm install
OPENAI_API_KEY=... npm run cloud:research
OPENAI_API_KEY=... npm run cloud:draft
OPENAI_API_KEY=... npm run cloud:weekly
```

Windows PowerShell:

```powershell
$env:OPENAI_API_KEY="..."
npm run cloud:research
```

## 出力先

- リサーチ: `outputs/research/`
- ドラフト: `outputs/drafts/`
- 週次編集会議: `outputs/metrics/`
- ダッシュボード: `outputs/dashboard.md`

workflowは成果物Markdownを自動コミットする。

## ダッシュボード

GitHub Actions実行後、`outputs/dashboard.md` が更新される。

ここを見ると以下が分かる。

- 最新リサーチ
- 社長への決済依頼
- 最新ドラフト
- 公開済み記事
- メトリクス
- 手動でやるべきこと

## 注意

- GitHub Actionsはネットワーク接続とOpenAI APIキーが必要。
- noteランキングなどリアルタイム情報の精度は、モデルのWeb検索機能や参照可能情報に依存する。
- リサーチworkflowではOpenAI Responses APIのWeb検索ツールを使う。
- 外部投稿は絶対に自動化しない。
- 生成物は必ず社長が確認してから使う。
