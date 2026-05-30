# note投稿用最終パッケージ運用

## 目的

承認済み、または公開候補になったドラフトを、noteに貼り付けるだけの最終投稿パッケージへ変換する。  
この工程はnoteへの自動投稿ではなく、投稿前の整形・確認・有料境界設計を自動化する。

## 出力先

```text
outputs/post-ready/
```

## パッケージに含めるもの

- noteタイトル
- 推奨公開設定
- 価格案
- 有料境界案
- 見出し画像案
- 画像生成プロンプト
- 推奨ハッシュタグ
- note貼り付け本文
- 投稿前チェック
- 公開後に記録するメトリクス欄

## 実行方法

### ローカル

```bash
npm run cloud:post-ready
```

特定ドラフトを指定する場合:

```bash
node scripts/build-post-ready.mjs outputs/drafts/example.md
```

### GitHub Actions

`Build note post-ready package` を手動実行する。  
`draft_path` に対象ドラフトのパスを入れる。空欄なら最新候補を使う。

## 公開判定

- `READY_TO_POST`: 投稿パッケージ化可能
- `NEEDS_PRIMARY_INFO`: 社長の一次情報追記が必要
- `NEEDS_REVIEW`: 品質確認が必要
- `BLOCKED`: 危険表現があるため公開しない

## 注意

- `【要追記】` が残っている記事は公開しない。
- note投稿は社長が手動で行う。
- 有料化する場合は、無料部分と有料部分の境界を公開前に確認する。
- 価格案は初期値であり、実際の価格は社長が決める。
