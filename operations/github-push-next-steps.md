# GitHubへpushする次の手順

## 現在の状態

- 初回コミット済み。
- Git remoteは未設定。
- `gh` CLIはローカルで見つからなかった。

## 次にやること

GitHub上で新しいリポジトリを作成する。

推奨リポジトリ名:

```text
note-ai-company
```

公開範囲:

```text
Private 推奨
```

理由:

- `inputs/` に事業情報や文体情報が入る。
- 今後、note運用データや売上導線の情報が増える。
- GitHub Actionsに `OPENAI_API_KEY` を登録する。

## remote追加

GitHubでリポジトリを作ったら、表示されるURLを使って以下を実行する。

```powershell
git remote add origin https://github.com/USER/note-ai-company.git
git branch -M main
git push -u origin main
```

## GitHub Actions設定

push後、GitHubのリポジトリ画面で以下を設定する。

Repository Settings → Secrets and variables → Actions → Secrets:

```text
OPENAI_API_KEY
```

Repository Settings → Secrets and variables → Actions → Variables:

```text
OPENAI_MODEL=gpt-5.2
ENABLE_WEB_SEARCH=true
```

## 動作テスト

GitHubのActionsタブで以下を手動実行する。

1. `Daily note research`
2. `Daily note draft`
3. `Weekly note editorial meeting`

確認すること:

- workflowが成功する。
- `outputs/research/` に新しいMarkdownが作成される。
- `outputs/drafts/` に新しいMarkdownが作成される。
- `outputs/dashboard.md` が更新される。

## 注意

- GitHub ActionsはUTCで動く。
- 現在の設定ではJSTに合わせている。
- note投稿やX投稿は自動化しない。
- 生成物は必ず社長確認後に使う。
