import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const today = formatDateInTokyo(new Date());
const targetFile = process.env.POST_READY_DRAFT || process.argv[2] || "";

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

function slugifyTitle(title) {
  return title
    .toLowerCase()
    .replace(/[\\/:*?"<>|#`]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60) || "note-post";
}

function extractSection(text, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`^## ${escaped}\\s*\\n([\\s\\S]*?)(?=\\n## |\\n# |$)`, "m"));
  return match?.[1]?.trim() || "";
}

function extractNoteDraft(text) {
  const match = text.match(/(?:^|\n)## Noteドラフト\s*\n([\s\S]*?)(?=\n## 社長が追記する一次情報|\n## 事実・意見・引用の整理|\n## X投稿案|\n## シリーズ化メモ|$)/);
  return match?.[1]?.trim() || extractSection(text, "Noteドラフト");
}

function extractTitle(text) {
  const noteDraft = extractNoteDraft(text);
  const noteTitle = noteDraft.match(/^#\s+(.+)/m);
  if (noteTitle) return noteTitle[1].trim();
  const firstHeading = text.match(/^#\s+(.+)/m);
  return firstHeading?.[1]?.trim() || "タイトル未取得";
}

function stripInternalSections(noteDraft) {
  return noteDraft
    .replace(/^#\s+.+\n+/, "")
    .replace(/\[社長が追記\]/g, "【要追記】")
    .trim();
}

function extractScore(text) {
  const match = text.match(/合計:\s*(\d+)\s*\/\s*40/);
  return match ? Number(match[1]) : null;
}

function hasPlaceholder(text) {
  return text.includes("[社長が追記]") || text.includes("【要追記】");
}

function hasRiskyExpression(text) {
  const riskyWords = ["必ず稼げる", "誰でも稼げる", "完全自動で稼ぐ", "放置で収益", "絶対に成功"];
  return riskyWords.some((word) => text.includes(word));
}

function classify(text) {
  const score = extractScore(text);
  if (hasRiskyExpression(text)) return { status: "BLOCKED", reason: "禁止・危険表現の可能性あり", score };
  if (hasPlaceholder(text)) return { status: "NEEDS_PRIMARY_INFO", reason: "社長の一次情報追記が必要", score };
  if (score !== null && score < 32) return { status: "NEEDS_REVIEW", reason: "品質スコアが低い", score };
  return { status: "READY_TO_POST", reason: "投稿パッケージ化可能", score };
}

function pickTags(text) {
  const base = ["#note", "#note運用", "#AI活用", "#記事作成"];
  const optional = [];
  if (text.includes("収益") || text.includes("有料")) optional.push("#note収益化");
  if (text.includes("WordPress") || text.includes("ブログ")) optional.push("#ブログ", "#WordPress");
  if (text.includes("副業")) optional.push("#副業");
  return [...new Set([...base, ...optional])].slice(0, 6);
}

function buildPaidBoundary(text) {
  if (text.includes("チェックリスト") || text.includes("テンプレート")) {
    return `無料部分では考え方と判断基準を公開し、有料部分では実行用チェックリスト、テンプレート、具体例を入れる。`;
  }
  return `初回は無料記事として公開し、反応がよければ有料版またはテンプレート版を別記事で作る。`;
}

async function findTargetDraft() {
  if (targetFile) {
    return targetFile.replaceAll("\\", "/");
  }

  const names = await listMarkdown("outputs/drafts");
  for (const name of names.reverse()) {
    const rel = `outputs/drafts/${name}`;
    const text = await readText(rel);
    const result = classify(text);
    if (result.status === "READY_TO_POST") {
      return rel;
    }
  }

  if (names.length) {
    return `outputs/drafts/${names.at(-1)}`;
  }

  throw new Error("No draft files found.");
}

async function main() {
  const draftPath = await findTargetDraft();
  const text = await readText(draftPath);
  const title = extractTitle(text);
  const noteDraft = extractNoteDraft(text);
  const body = stripInternalSections(noteDraft || text);
  const result = classify(text);
  const tags = pickTags(text);
  const slug = slugifyTitle(title);

  await fs.mkdir(path.join(ROOT, "outputs/post-ready"), { recursive: true });

  const packageText = `# note投稿用最終パッケージ

## 作成日

${today}

## 元ドラフト

\`${draftPath}\`

## 公開ステータス

- 判定: ${result.status}
- 理由: ${result.reason}
- 品質スコア: ${result.score ?? "未取得"}

## noteタイトル

${title}

## 推奨公開設定

- 公開方式: ${result.status === "READY_TO_POST" ? "無料公開または一部有料" : "まだ公開しない"}
- 価格案: 初回は無料。反応が出たら100円から300円の有料テンプレート版を検討
- 有料境界案: ${buildPaidBoundary(text)}

## 見出し画像案

- 種類: 横長アイキャッチ
- 方向性: 実務的、信頼感、AI感を出しすぎない
- 画像プロンプト:

\`\`\`text
note記事の見出し画像。テーマは「${title}」。
読者はnote運用、AI活用、個人収益化に関心がある人。
印象は知的、実務的、信頼感、落ち着いた雰囲気。
AI感の強い未来的な装飾は避ける。
文字は入れない。
横長のWeb記事用アイキャッチ。
\`\`\`

## 推奨ハッシュタグ

${tags.join(" ")}

## note貼り付け本文

${body}

## 投稿前チェック

- [ ] \`【要追記】\` が残っていない
- [ ] 実体験、検証ログ、仮説、架空ケースを区別している
- [ ] 収益保証、成果保証、専門助言の断定がない
- [ ] 有料境界が不自然ではない
- [ ] 画像を設定した
- [ ] スマホで読みやすい
- [ ] 最後の次アクションが明確
- [ ] note公開は社長が手動で行う

## 公開後に記録すること

- 公開URL:
- 公開日時:
- 価格:
- 24時間後ビュー:
- 24時間後スキ:
- コメント:
- フォロー増:
- 有料購入:
`;

  const outputPath = path.join(ROOT, "outputs/post-ready", `${today}-${slug}.md`);
  await fs.writeFile(outputPath, packageText, "utf8");
  console.log(`Wrote ${path.relative(ROOT, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
