# note公開候補キュー

## 作成日

2026-07-18

## 公開判断ルール

- `READY_FOR_REVIEW`: 公開前レビューに進める
- `NEEDS_PRIMARY_INFO`: 社長の一次情報、失敗談、検証ログを追記してから再確認
- `NEEDS_REWRITE`: 構成や品質を修正
- `REJECTED`: 公開しない

## 候補一覧

| 状態 | 品質 | タイトル | ファイル | 理由 |
| --- | ---: | --- | --- | --- |
| NEEDS_PRIMARY_INFO | 33 | 有料でも買う読者の見分け方。note収益化は「誰に売るか」で決まる | `outputs/drafts/2026-05-29-draft-02-paid-reader.md` | 社長の一次情報追記が必要 |
| NEEDS_PRIMARY_INFO | - | noteランキングを見てネタを決める方法。有料でも買う人向けに絞る | `outputs/drafts/2026-05-29-drafts.md` | 社長の一次情報追記が必要 |

## 次に社長がやること

1. `NEEDS_PRIMARY_INFO` に体験談、失敗談、検証ログを追記する
2. `READY_FOR_REVIEW` だけnote投稿前チェックへ進める
3. 有料化する場合は、無料部分と有料部分の境界を確認する
4. 投稿後はメトリクスを入力し、週次編集会議でシリーズ化/撤退を判断する
