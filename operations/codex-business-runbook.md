# Codex Business内で回すnote AI会社 Runbook

## 方針

OpenAI API課金を使わず、ChatGPT Business / Codex内でAI会社運用を回す。  
GitHub ActionsはAI生成を行わず、ダッシュボード整理とリマインドだけに使う。

## 毎日の使い方

Codexで以下を実行する。

```text
prompts/codex-business-daily-run.md に沿って、今日のnote会社を回して。
外部投稿・購入・送信はせず、成果物をMarkdownに保存して。
```

Codexがやること:

- 無料リサーチ5部署
- ネタ精査
- 採用候補提示
- 承認済みネタがあればドラフト作成
- 公開候補キュー
- 投稿用最終パッケージ
- ダッシュボード更新

## 承認後の使い方

ネタを採用したら `outputs/approvals/` に承認ログを作る。  
その後、Codexで以下を実行する。

```text
prompts/codex-business-draft-run.md に沿って、承認済みネタだけドラフト化して。
```

## 週次の使い方

日曜または週末に、Codexで以下を実行する。

```text
prompts/codex-business-weekly-run.md に沿って、週次編集会議をして。
```

## GitHub Actionsの役割

GitHub ActionsではAI生成を行わない。  
API課金を避けるため、以下だけに限定する。

- preflight
- dashboard更新
- Codex実行リマインド作成

## note投稿

note投稿は手動。  
`outputs/post-ready/` の投稿パッケージを確認し、`【要追記】` が残っていないものだけ投稿する。

## コメント返信

コメント返信も手動。  
Codexにコメント本文を渡して返信案を作り、社長が確認してからnote上で返信する。
