# AI会社組織システム

Codex / Claude Code上で、MDファイルに定義したAIエージェント群を階層的に連携させ、副業コンテンツ制作・販売ワークフローを自動化するための設計リポジトリです。

## 構成

- `requirements.md`: システム全体の要件定義
- `agents/`: 各AIエージェントの役割定義
- `agents/templates/role-template.md`: 新しい役職を追加するためのテンプレート
- `operations/phase1-checklist.md`: 初期構築フェーズの運用チェックリスト
- `operations/approval-log-template.md`: 社長決済と修正ログの記録テンプレート
- `operations/note-compliance-checklist.md`: note投稿前の規約・品質チェック
- `operations/note-monetization-roadmap.md`: note収益化ロードマップ
- `operations/note-vs-wordpress-strategy.md`: note優先・WordPress併用戦略
- `operations/note-article-writing-method.md`: AI風に見えないnote記事の作り方
- `operations/note-topic-selection-method.md`: noteランキングと有料購入意欲からネタを選ぶ方法
- `operations/note-series-decision-rule.md`: 反応がよい記事のシリーズ化・撤退判断
- `operations/weekly-editorial-meeting-template.md`: 週次note編集会議テンプレート
- `operations/note-image-strategy.md`: note記事用の画像・図解戦略
- `operations/note-quality-upgrade-methods.md`: note記事を高品質化する手法集
- `operations/post-publish-workflow.md`: note公開後の分析・改善フロー
- `operations/manual-note-posting-checklist.md`: note手動投稿チェックリスト
- `operations/automation-setup.md`: Codex Automationの設定内容
- `operations/github-actions-cloud-setup.md`: GitHub Actionsでクラウド実行する設定
- `prompts/`: Codex Automationや手動実行で使う部署別プロンプト

## 初期構築の進め方

1. `requirements.md` を確認する。
2. `agents/社長.md`、`agents/リサーチ部長.md`、`agents/制作部編集長.md` を使ってPhase 1を開始する。
3. `operations/phase1-checklist.md` に沿って、リサーチ部と制作部だけを2週間運用する。
4. 毎回の社長修正を `operations/approval-log-template.md` に記録する。
5. 制作フローが安定してから、CS部、営業部、社長秘書部を段階的に追加する。
6. note収益化は `operations/note-monetization-roadmap.md` に沿って、無料記事で信頼を作ってから有料化する。
7. 中長期の資産化は `operations/note-vs-wordpress-strategy.md` に沿って、noteとWordPressを併用する。

## 重要ルール

- 営業部（SNS運用）は、最低3週間の人間による目視投稿期間を経てから引き継ぐ。
- 投稿、送信、購入、契約、削除など外部に影響する操作は、社長承認なしに実行しない。
- 本システムは短期的な収益保証ではなく、3ヶ月以上の継続運用による作業圧縮を目的とする。
- note有料記事は、誇大表現・売上煽り・自己購入・専門助言の断定を避ける。
- note依存を避けるため、公開原稿とエクスポートデータを定期的にバックアップする。
- note記事はAIが完成させるのではなく、社長の体験談・失敗談・検証結果をAIが編集する形で作る。
