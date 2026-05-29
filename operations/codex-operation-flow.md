# CodexでAI会社組織を運用する流れ

## 全体像

Codexでは、AI会社組織を以下の4要素で運用する。

1. 役割MD: 各エージェントの人格・責任範囲・禁止事項を定義する。
2. 入力ファイル: 社長が与える事業情報、競合、キーワード、文体サンプルを置く。
3. Automation: 決まった時刻に部署を起動し、成果物を作らせる。
4. 承認ログ: 社長の採用 / 却下 / 修正を残し、次回以降の品質改善に使う。

## 推奨ディレクトリ

```text
agents/
  社長.md
  リサーチ部長.md
  制作部編集長.md
  営業部SNS担当.md
  カスタマーサポート担当.md
  社長秘書.md
inputs/
  business-profile.md
  competitors.md
  keywords.md
  style-samples.md
outputs/
  research/
  drafts/
  approvals/
operations/
  phase1-checklist.md
  approval-log-template.md
  codex-operation-flow.md
  note-compliance-checklist.md
  note-monetization-roadmap.md
  note-vs-wordpress-strategy.md
  note-article-writing-method.md
  note-topic-selection-method.md
  note-series-decision-rule.md
  weekly-editorial-meeting-template.md
  note-image-strategy.md
  note-quality-upgrade-methods.md
  post-publish-workflow.md
prompts/
  daily-research.md
  daily-draft.md
  weekly-editorial-meeting.md
  image-plan.md
```

## Step 1: 社長情報を入力する

最初に `inputs/` に以下を用意する。

- `business-profile.md`: 何を売るか、誰に売るか、収益導線、禁止したい表現。
- `competitors.md`: 競合YouTube、Xアカウント、Note記事、参考メディア。
- `keywords.md`: 調査対象キーワード、避けたいキーワード。
- `style-samples.md`: 社長の過去投稿、Note本文、よく使う言い回し、避ける文体。

この4つがない状態で自動化すると、AIが一般論を量産しやすくなる。

## Step 2: Phase 1だけを動かす

最初の2週間は以下の2部署だけを使う。

- リサーチ部
- 制作部

営業部、カスタマーサポート部、社長秘書部は、Phase 1の品質が安定してから追加する。

## Step 3: Codex Automationを設定する

### Automation 1: 毎朝7時 リサーチ部

目的: 競合・トレンド・売れ筋を調査し、社長が採用判断できるレポートを作る。

設定内容:

- 名前: 毎朝リサーチ部
- 実行環境: このワークスペース
- 実行頻度: 毎日 07:00
- 使用ファイル:
  - `agents/リサーチ部長.md`
  - `inputs/business-profile.md`
  - `inputs/competitors.md`
  - `inputs/keywords.md`
- 出力先:
  - `outputs/research/YYYY-MM-DD-research.md`

プロンプト例:

```text
prompts/daily-research.md に従って、今日のnoteネタ候補レポートを作成してください。
```

### Automation 2: 毎朝9時 制作部

目的: 社長が採用したリサーチ結果だけをもとに、Note、X、YouTubeショートのドラフトを作る。

設定内容:

- 名前: 毎朝制作部
- 実行環境: このワークスペース
- 実行頻度: 毎日 09:00
- 使用ファイル:
  - `agents/制作部編集長.md`
  - `inputs/business-profile.md`
  - `inputs/style-samples.md`
  - `outputs/research/`
  - `outputs/approvals/`
- 出力先:
  - `outputs/drafts/YYYY-MM-DD-drafts.md`

プロンプト例:

```text
prompts/daily-draft.md に従って、社長が承認した最新ネタのnoteドラフトを作成してください。
```

## Step 4: 社長が毎日やること

社長の作業は以下に絞る。

1. `outputs/research/` の最新レポートを読む。
2. 採用 / 却下 / 修正を決める。
3. `operations/approval-log-template.md` を使って `outputs/approvals/` に決済ログを残す。
4. `outputs/drafts/` のドラフトを確認する。
5. `operations/note-article-writing-method.md` に沿って体験談・失敗談・具体例を追記する。
6. `operations/note-compliance-checklist.md` でnote投稿前チェックを行う。
7. 公開してよいものだけ手動で投稿する。

Phase 1では、自動投稿は行わない。

## Step 5: 修正ログを育てる

毎日、社長が直した表現を以下の形で残す。

```markdown
| 修正前 | 修正後 | 理由 | 次回ルール化 |
| --- | --- | --- | --- |
| 断定が強い表現 | 可能性として表現 | 信頼を落とさないため | 収益・成果は断定しない |
```

このログを `inputs/style-samples.md` または専用の `inputs/revision-rules.md` に反映する。

## Step 6: 3週間後に営業部を追加する

営業部は、社長が最低3週間、目視で投稿してから追加する。

追加条件:

- 反応がよい投稿パターンが見えている。
- 避けるべき表現がログ化されている。
- 投稿頻度、時間帯、媒体ごとのルールが決まっている。
- 社長確認なしに投稿しない設計になっている。

営業部Automationの役割は、投稿そのものではなく「投稿前確認シートの作成」から始める。

noteについては、営業部に公開操作を任せない。営業部は整形、チェック、予約準備までを担当し、公開ボタンは社長承認後のみ扱う。

## Step 7: CS部と社長秘書部を追加する

### カスタマーサポート部

購入後メール、特典配布、質問一次返信を担当する。ただし、返金、クレーム、法務、個別相談は社長確認に回す。

### 社長秘書部

LINE Bot / Discord Botで一次Q&Aを行う。社長本人として約束するのではなく、公開情報に基づく案内役として動かす。

## Step 8: note収益化を始める

無料記事で信頼を作り、反応が出てから有料記事・有料マガジン・メンバーシップを検討する。

最初から有料化せず、以下の順番で進める。

```text
自己紹介記事
↓
代表作の無料記事
↓
週1-2本の一次情報記事
↓
SNS連携
↓
反応分析
↓
小さな有料記事
```

詳細は `operations/note-monetization-roadmap.md` を参照する。

## Step 9: WordPressとの併用を始める

最初の90日はnoteを優先し、記事作成・読者反応・一次情報の蓄積に集中する。反応が出た記事は、WordPress向けに再編集して資産化する。

```text
note: 体験談、失敗談、検証ログ、読者との関係構築
WordPress: SEO網羅記事、問い合わせ導線、保存版、独自ドメイン資産
```

WordPress記事をnoteに流用する場合も、note記事をWordPressに流用する場合も、本文をそのままコピペしない。媒体に合わせて構成、文体、導線を作り替える。

詳細は `operations/note-vs-wordpress-strategy.md` を参照する。

## Step 10: 週次編集会議を回す

毎週1回、公開したnoteの反応を見て、シリーズ化・有料化・撤退を判断する。

```text
バズネタを分析
↓
反応がよい記事をシリーズ化
↓
続編または有料版を作る
↓
反応が落ちたテーマは撤退
```

会議テンプレートは `operations/weekly-editorial-meeting-template.md` を使う。判断基準は `operations/note-series-decision-rule.md` を参照する。
実行時のプロンプトは `prompts/weekly-editorial-meeting.md` を使う。

## Step 11: 公開後メトリクスを記録する

公開した記事は `outputs/metrics/` に記録し、24時間後・72時間後・7日後・14日後に反応を見る。

```text
公開
↓
24時間後に初速確認
↓
72時間後に反応の質を確認
↓
7日後にシリーズ化・有料化・撤退判断
↓
14日後に保存版 / WordPress化を検討
```

詳細は `operations/post-publish-workflow.md` を参照する。

## 運用上の禁止事項

- 社長承認なしに外部投稿しない。
- 社長承認なしにメール、DM、LINE返信を送信しない。
- AI生成記事を未編集のままnoteへ投稿しない。
- noteで機械的な大量投稿を行わない。
- スキ、フォロー、コメントの自動化を行わない。
- note有料記事で「必ず儲かる」「絶対成功する」などの保証表現を使わない。
- 売上公開や残り部数などで過度に購入を煽らない。
- WordPress記事や他媒体の記事をnoteへそのままコピペしない。
- note記事のバックアップを定期的に取る。
- 収益保証や成果保証をしない。
- プラットフォーム規約に反する自動化をしない。
- 個人情報や購入者情報を不要にAIへ渡さない。

## 最初の完成形

まず目指す状態は以下。

```text
07:00 リサーチ部がレポート作成
08:00 社長が採用 / 却下
09:00 制作部がドラフト作成
昼   社長が30分で修正
夕方 社長が手動投稿
夜   修正ログを翌日に反映
```

この状態が2週間安定してから、営業部、CS部、社長秘書部を足す。
