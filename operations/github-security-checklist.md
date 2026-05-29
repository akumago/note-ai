# GitHub運用セキュリティチェックリスト

このリポジトリはnote運用の戦略、入力条件、生成ログ、OpenAI連携を扱うため、公開リポジトリではなくPrivate運用を推奨する。

## 初回に必ず確認すること

- GitHubリポジトリをPrivateに変更する
- `OPENAI_API_KEY` はSecretsに登録し、ファイルには書かない
- `.env` やAPIキー入りメモをcommitしない
- note/Xへの自動投稿は有効化しない
- 自動化の成果物はMarkdown下書きまでに止める
- 公開前に人間がnote規約、一次情報、引用、画像、価格を確認する

## GitHub Actionsの設定

Repository Settingsから以下を設定する。

### Secrets

- `OPENAI_API_KEY`: OpenAI APIキー

### Variables

- `OPENAI_MODEL`: 利用モデル名。未設定の場合はスクリプト側の既定値を使う
- `ENABLE_WEB_SEARCH`: `true` でリサーチ時にWeb検索を使う

## 最初の動作確認

1. GitHubのActionsタブを開く
2. `Daily note research` を選ぶ
3. `Run workflow` で手動実行する
4. `outputs/research/` に新しいMarkdownがcommitされるか確認する
5. 問題なければ `Daily note draft` も手動実行する

## 事故りやすい設定

- noteへ直接投稿するブラウザ自動操作を入れる
- AI生成記事をそのまま大量投稿する
- 架空の体験談を実体験として断定する
- 出典不明の数字や公式発表風の表現を入れる
- 売上、実績、必ず儲かる系の煽りを入れる

## 現在の安全設計

- 自動化はリサーチ、下書き、週次分析まで
- 投稿は手動
- note規約チェックリストを通してから公開
- 伸びた記事だけシリーズ化
- 閲覧、スキ、コメント、購入反応が落ちたら撤退
