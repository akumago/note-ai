import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const today = formatDateInTokyo(new Date());

function formatDateInTokyo(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

async function listMarkdown(dir) {
  try {
    const names = await fs.readdir(path.join(ROOT, dir));
    return names.filter((name) => name.endsWith(".md")).sort();
  } catch {
    return [];
  }
}

async function readText(relativePath) {
  return fs.readFile(path.join(ROOT, relativePath), "utf8");
}

function extractTitle(text) {
  const noteDraft = text.match(/## Noteドラフト\s+#\s+(.+)/);
  if (noteDraft) return noteDraft[1].trim();
  const firstHeading = text.match(/^#\s+(.+)/m);
  return firstHeading?.[1]?.trim() || "タイトル未取得";
}

function extractScore(text) {
  const match = text.match(/合計:\s*(\d+)\s*\/\s*40/);
  return match ? Number(match[1]) : null;
}

function hasRiskyExpression(text) {
  const riskyWords = ["必ず稼げる", "誰でも稼げる", "完全自動で稼ぐ", "放置で収益", "絶対に成功"];
  return riskyWords.some((word) => text.includes(word));
}

function classifyDraft(text) {
  const score = extractScore(text);
  const hasPlaceholder = text.includes("[社長が追記]");
  const risky = hasRiskyExpression(text);

  if (risky) return { status: "REJECTED", reason: "禁止・危険表現の可能性あり", score };
  if (hasPlaceholder) return { status: "NEEDS_PRIMARY_INFO", reason: "社長の一次情報追記が必要", score };
  if (score !== null && score < 32) return { status: "NEEDS_REWRITE", reason: "品質スコアが低い", score };
  return { status: "READY_FOR_REVIEW", reason: "公開前レビュー待ち", score };
}

async function main() {
  await fs.mkdir(path.join(ROOT, "outputs/publish-queue"), { recursive: true });

  const names = await listMarkdown("outputs/drafts");
  const rows = [];

  for (const name of names.slice(-20)) {
    const rel = `outputs/drafts/${name}`;
    const text = await readText(rel);
    const result = classifyDraft(text);
    rows.push({
      file: rel,
      title: extractTitle(text),
      ...result,
    });
  }

  const body = `# note公開候補キュー

## 作成日

${today}

## 公開判断ルール

- \`READY_FOR_REVIEW\`: 公開前レビューに進める
- \`NEEDS_PRIMARY_INFO\`: 社長の一次情報、失敗談、検証ログを追記してから再確認
- \`NEEDS_REWRITE\`: 構成や品質を修正
- \`REJECTED\`: 公開しない

## 候補一覧

| 状態 | 品質 | タイトル | ファイル | 理由 |
| --- | ---: | --- | --- | --- |
${rows
  .map((row) => `| ${row.status} | ${row.score ?? "-"} | ${row.title.replaceAll("|", "｜")} | \`${row.file}\` | ${row.reason} |`)
  .join("\n")}

## 次に社長がやること

1. \`NEEDS_PRIMARY_INFO\` に体験談、失敗談、検証ログを追記する
2. \`READY_FOR_REVIEW\` だけnote投稿前チェックへ進める
3. 有料化する場合は、無料部分と有料部分の境界を確認する
4. 投稿後はメトリクスを入力し、週次編集会議でシリーズ化/撤退を判断する
`;

  const outputPath = path.join(ROOT, "outputs/publish-queue", `${today}-publish-queue.md`);
  await fs.writeFile(outputPath, body, "utf8");
  console.log(`Wrote ${path.relative(ROOT, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
