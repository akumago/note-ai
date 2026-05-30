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

async function readText(relativePath, fallback = "") {
  try {
    return await fs.readFile(path.join(ROOT, relativePath), "utf8");
  } catch {
    return fallback;
  }
}

function latest(names, count = 5) {
  return names.slice(-count).reverse();
}

function mdLink(dir, name) {
  return `[${name}](${dir}/${encodeURIComponent(name).replaceAll("%2F", "/")})`;
}

async function buildSection(title, dir, count = 5) {
  const names = latest(await listMarkdown(dir), count);
  if (!names.length) return `## ${title}\n\n- なし\n`;
  return `## ${title}\n\n${names.map((name) => `- ${mdLink(dir, name)}`).join("\n")}\n`;
}

async function extractDecisionHints() {
  const researchNames = latest(await listMarkdown("outputs/research"), 3);
  const hints = [];

  for (const name of researchNames) {
    const rel = `outputs/research/${name}`;
    const text = await readText(rel);
    const match = text.match(/## 社長への決済依頼[\s\S]*?(?=\n## |\n# |$)/);
    if (match) {
      hints.push(`### ${name}\n\n${match[0].trim()}\n`);
    }
  }

  return hints.length ? hints.join("\n") : "なし\n";
}

async function main() {
  await fs.mkdir(path.join(ROOT, "outputs"), { recursive: true });

  const dashboard = `# note運用ダッシュボード

更新日: ${today}

## 今日見る順番

1. リサーチ結果を確認する
2. 社長への決済依頼に採用 / 却下を書く
3. 承認済みネタがあれば制作ドラフトを確認する
4. 公開済み記事の数字をメトリクスに入力する
5. 日曜の週次編集会議を見る

## 社長への決済依頼

${await extractDecisionHints()}

${await buildSection("最新リサーチ", "outputs/research")}

${await buildSection("ネタ候補キュー", "outputs/topic-queue")}

${await buildSection("最新承認ログ", "outputs/approvals")}

${await buildSection("最新ドラフト", "outputs/drafts")}

${await buildSection("公開候補キュー", "outputs/publish-queue")}

${await buildSection("投稿用最終パッケージ", "outputs/post-ready")}

${await buildSection("コメント返信案", "outputs/replies")}

${await buildSection("公開済み記事", "outputs/published")}

${await buildSection("メトリクス", "outputs/metrics")}

## 手動作業

- note公開は手動
- X投稿は手動
- noteコメント返信は手動
- メール送信、購入者返信、削除、購入は手動
- 自動生成物は必ず社長が確認してから使う
`;

  await fs.writeFile(path.join(ROOT, "outputs", "dashboard.md"), dashboard, "utf8");
  console.log("Wrote outputs/dashboard.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
