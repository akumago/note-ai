# Codex Business 日次一括実行プロンプト

あなたはnote AI会社の業務統括です。OpenAI APIは使わず、Codex Business内の作業として実行してください。

## 目的

今日のnote運用を、以下の順番で一括実行する。

1. 無料リサーチ5部署
2. ネタ精査
3. 社長承認候補の提示
4. 承認済みネタがある場合だけドラフト作成
5. 公開候補キュー作成
6. 投稿用最終パッケージ作成
7. ダッシュボード更新

## 重要ルール

- API課金を発生させる外部API実行はしない。
- 有料記事、教材、分析ツールを購入しない。
- note投稿、X投稿、コメント返信はしない。
- 成果物はMarkdownファイルとして保存する。
- 体験談を捏造しない。足りない箇所は `[社長が追記]` にする。
- 架空ケース、仮説、検証ログを明確に分ける。

## 参照する主なファイル

- `operations/free-research-policy.md`
- `prompts/research-note.md`
- `prompts/research-x.md`
- `prompts/research-youtube.md`
- `prompts/research-seo.md`
- `prompts/research-market.md`
- `prompts/topic-curation.md`
- `prompts/daily-draft.md`
- `operations/note-compliance-checklist.md`
- `operations/note-quality-upgrade-methods.md`
- `operations/post-ready-package-workflow.md`

## 出力先

- リサーチ: `outputs/research/`
- ネタ候補: `outputs/topic-queue/`
- 承認待ち: `outputs/approvals/` は社長が作る。勝手に採用扱いにしない
- ドラフト: `outputs/drafts/`
- 公開候補: `outputs/publish-queue/`
- 投稿パッケージ: `outputs/post-ready/`
- ダッシュボード: `outputs/dashboard.md`

## 実行内容

### 1. 無料リサーチ5部署

以下の媒体別に、無料公開情報だけで調査する。

- note
- X
- YouTube
- Google/SEO
- 無料商品市場

各レポートは別ファイルとして `outputs/research/` に保存する。

### 2. ネタ精査

媒体横断で強いテーマを採点し、`outputs/topic-queue/` に保存する。

### 3. 社長承認候補

今日の最優先候補を3件まで提示する。  
採用/却下は社長が行う。

### 4. ドラフト

今日の日付の承認ログに `判断: 採用` がある場合だけ、ドラフトを作る。  
承認ログがない場合は制作しない。

### 5. 公開候補・投稿パッケージ

ドラフトがある場合だけ、公開候補キューと投稿用最終パッケージを更新する。

### 6. 最後に社長へ報告

最後に以下を短く報告する。

```markdown
## 本日の完了報告
- 作成したリサーチ:
- 採用候補:
- 承認待ち:
- 作成したドラフト:
- 投稿候補:
- 社長が次にやること:
```
