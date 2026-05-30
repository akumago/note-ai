# Codex Automation 設定

作成日: 2026-05-29

## 基本方針

外部投稿・外部送信・購入・削除は自動化しない。  
OpenAI API課金を避け、Business / Codex内でAI作業を行う。  
Codex Automationで自動化するのは、以下の内部作業に限定する。

- リサーチ
- ドラフト作成
- 週次編集会議
- 投稿用最終パッケージ作成
- コメント返信案作成

noteへの公開、Xへの投稿、購入者対応の送信は社長が手動で承認する。

## 作成済みAutomation

| Automation | 役割 | 実行タイミング | 出力先 |
| --- | --- | --- | --- |
| 毎朝 note リサーチ部 | Codex Business内で5部署リサーチとネタ精査を回す | 毎朝7時 | `outputs/research/`, `outputs/topic-queue/` |
| 毎朝 note 制作部 | 承認済みネタからドラフトと投稿パッケージを作る | 毎朝9時 | `outputs/drafts/`, `outputs/post-ready/` |
| 週次 note 編集会議 | 公開記事の反応を見てシリーズ化・有料化・撤退を提案する | 毎週日曜20時 | `outputs/metrics/` |

## 毎朝 note リサーチ部

参照:

- `prompts/codex-business-daily-run.md`
- `agents/リサーチ部長.md`
- `inputs/`
- `operations/codex-business-runbook.md`
- `operations/free-research-policy.md`

やること:

- note / X / YouTube / Google・SEO / 無料商品市場の5部署リサーチを回す。
- ネタ候補を媒体横断で採点する。
- 社長への採用 / 却下候補を出す。
- 承認済みネタがあればドラフトと投稿パッケージまで作る。

やらないこと:

- note投稿。
- X投稿。
- 外部送信。
- 上位記事の焼き直し。

## 毎朝 note 制作部

参照:

- `prompts/codex-business-draft-run.md`
- `agents/制作部編集長.md`
- `outputs/approvals/`
- `operations/note-article-writing-method.md`
- `operations/note-quality-upgrade-methods.md`

やること:

- 最新の承認済みネタを確認する。
- 体験素材ヒアリングを作る。
- noteドラフトを作る。
- X投稿案を作る。
- シリーズ化メモを作る。
- 品質スコアを付ける。
- 公開候補キューと投稿用最終パッケージを作る。

承認済みネタがない場合:

- 制作せず、承認待ちとして必要な確認事項だけを出す。

## 週次 note 編集会議

参照:

- `prompts/codex-business-weekly-run.md`
- `operations/weekly-editorial-meeting-template.md`
- `operations/note-series-decision-rule.md`
- `outputs/published/`
- `outputs/metrics/`

やること:

- 今週公開した記事を振り返る。
- ビュー、スキ、コメント、フォロー増、購入数を見る。
- シリーズ化候補を出す。
- 有料化候補を出す。
- 撤退候補を出す。
- 来週の制作指示を出す。

数値が未入力の場合:

- 入力待ちとして明記する。
- 推測で数値を作らない。

## 日次運用

```text
07:00 リサーチ部がネタ候補を出す
↓
社長が採用 / 却下を決済
↓
09:00 制作部が承認済みネタをドラフト化
↓
社長が体験談・検証ログを追記
↓
画像担当が必要画像を作る
↓
社長が手動でnote投稿
```

## 週次運用

```text
公開記事の数字を outputs/metrics/ に入力
↓
日曜20時に週次編集会議
↓
シリーズ化 / 有料化 / 撤退を判断
↓
翌週のリサーチ・制作へ反映
```

## 今後追加する候補

まだ自動化しないが、将来追加候補にするもの:

- 投稿24時間後のメトリクス確認リマインド
- 72時間後のタイトル改善提案
- 公開記事のWordPress保存版作成
- 有料テンプレート化候補の抽出

ただし、外部投稿・自動送信は引き続き社長承認を必須にする。

## GitHub Actions

GitHub ActionsではAI生成をしない。  
API課金を避けるため、リマインド、preflight、ダッシュボード整理だけに使う。
