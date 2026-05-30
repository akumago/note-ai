import fs from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";

const ROOT = process.cwd();
const mode = process.argv[2];
const today = formatDateInTokyo(new Date());
const nowSlug = formatDateTimeInTokyo(new Date());

function formatDateInTokyo(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatDateTimeInTokyo(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}-${values.hour}${values.minute}${values.second}`;
}

const MODES = {
  research: {
    promptFile: "prompts/daily-research.md",
    outDir: "outputs/research",
    outName: `${today}-cloud-research.md`,
    title: "noteネタ候補レポート",
  },
  "research-note": {
    promptFile: "prompts/research-note.md",
    outDir: "outputs/research",
    outName: `${today}-research-note.md`,
    title: "noteリサーチレポート",
  },
  "research-x": {
    promptFile: "prompts/research-x.md",
    outDir: "outputs/research",
    outName: `${today}-research-x.md`,
    title: "Xリサーチレポート",
  },
  "research-youtube": {
    promptFile: "prompts/research-youtube.md",
    outDir: "outputs/research",
    outName: `${today}-research-youtube.md`,
    title: "YouTubeリサーチレポート",
  },
  "research-seo": {
    promptFile: "prompts/research-seo.md",
    outDir: "outputs/research",
    outName: `${today}-research-seo.md`,
    title: "Google/SEOリサーチレポート",
  },
  "research-market": {
    promptFile: "prompts/research-market.md",
    outDir: "outputs/research",
    outName: `${today}-research-market.md`,
    title: "無料商品市場リサーチレポート",
  },
  curate: {
    promptFile: "prompts/topic-curation.md",
    outDir: "outputs/topic-queue",
    outName: `${today}-topic-queue.md`,
    title: "noteネタ候補キュー",
  },
  draft: {
    promptFile: "prompts/daily-draft.md",
    outDir: "outputs/drafts",
    outName: `${today}-cloud-draft.md`,
    title: "note制作ドラフト",
  },
  reply: {
    promptFile: "prompts/comment-reply.md",
    outDir: "outputs/replies",
    outName: `${nowSlug}-comment-reply.md`,
    title: "コメント返信案",
  },
  weekly: {
    promptFile: "prompts/weekly-editorial-meeting.md",
    outDir: "outputs/metrics",
    outName: `${today}-weekly-editorial-meeting.md`,
    title: "週次note編集会議",
  },
};

if (!MODES[mode]) {
  console.error(`Usage: node scripts/cloud-agent.mjs ${Object.keys(MODES).join("|")}`);
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is required.");
  process.exit(1);
}

if (mode === "reply" && !process.env.COMMENT_TEXT?.trim()) {
  console.error("COMMENT_TEXT is required for reply mode.");
  process.exit(1);
}

const config = MODES[mode];
const model = process.env.OPENAI_MODEL || "gpt-5";
const fallbackModel = process.env.OPENAI_FALLBACK_MODEL || "gpt-5";
const enableWebSearch = process.env.ENABLE_WEB_SEARCH !== "false";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function readText(relativePath, fallback = "") {
  try {
    return await fs.readFile(path.join(ROOT, relativePath), "utf8");
  } catch {
    return fallback;
  }
}

async function listMarkdown(dir) {
  try {
    const names = await fs.readdir(path.join(ROOT, dir));
    return names.filter((name) => name.endsWith(".md")).sort();
  } catch {
    return [];
  }
}

async function readDirSnippets(dir, limit = 8) {
  const names = await listMarkdown(dir);
  const selected = names.slice(-limit);
  const chunks = [];
  for (const name of selected) {
    const rel = path.join(dir, name).replaceAll("\\", "/");
    const text = await readText(rel);
    chunks.push(`\n\n--- FILE: ${rel} ---\n${text.slice(0, 12000)}`);
  }
  return chunks.join("");
}

async function buildContext() {
  const commonFiles = [
    "requirements.md",
    "inputs/business-profile.md",
    "inputs/competitors.md",
    "inputs/keywords.md",
    "inputs/style-samples.md",
    "inputs/revision-rules.md",
    "operations/note-compliance-checklist.md",
    "operations/note-topic-selection-method.md",
    "operations/note-article-writing-method.md",
    "operations/note-quality-upgrade-methods.md",
    "operations/note-series-decision-rule.md",
    "operations/note-monetization-roadmap.md",
    "operations/free-research-policy.md",
  ];

  const modeFiles = {
    research: ["agents/リサーチ部長.md"],
    "research-note": ["agents/リサーチ部長.md"],
    "research-x": ["agents/リサーチ部長.md"],
    "research-youtube": ["agents/リサーチ部長.md"],
    "research-seo": ["agents/リサーチ部長.md"],
    "research-market": ["agents/リサーチ部長.md"],
    curate: ["operations/final-automation-architecture.md"],
    draft: ["agents/制作部編集長.md"],
    reply: ["agents/カスタマーサポート担当.md", "operations/comment-reply-workflow.md"],
    weekly: ["operations/weekly-editorial-meeting-template.md"],
  };

  const chunks = [];
  chunks.push(`--- DATE ---\n${today}`);
  chunks.push(`--- MODE ---\n${mode}`);
  chunks.push(`--- EXECUTION SAFETY ---
外部投稿、外部送信、購入、削除、アカウント操作は絶対に行わない。
このジョブはMarkdownの成果物だけを作成する。
note公開、X投稿、メール返信、購入者対応は人間の承認後に手動で行う。`);
  chunks.push(`--- MAIN PROMPT: ${config.promptFile} ---\n${await readText(config.promptFile)}`);

  for (const file of [...commonFiles, ...(modeFiles[mode] || [])]) {
    chunks.push(`--- FILE: ${file} ---\n${await readText(file)}`);
  }

  if (mode === "curate") {
    chunks.push(`--- RECENT RESEARCH ---${await readDirSnippets("outputs/research")}`);
    chunks.push(`--- RECENT METRICS ---${await readDirSnippets("outputs/metrics")}`);
    chunks.push(`--- RECENT PUBLISHED ---${await readDirSnippets("outputs/published")}`);
  }

  if (!mode.startsWith("research") && mode !== "curate") {
    chunks.push(`--- RECENT RESEARCH ---${await readDirSnippets("outputs/research")}`);
    chunks.push(`--- RECENT TOPIC QUEUE ---${await readDirSnippets("outputs/topic-queue")}`);
    chunks.push(`--- RECENT APPROVALS ---${await readDirSnippets("outputs/approvals")}`);
  }

  if (mode === "reply") {
    chunks.push(`--- COMMENT INPUT ---
対象記事: ${process.env.COMMENT_ARTICLE || "未指定"}
投稿者: ${process.env.COMMENT_AUTHOR || "未指定"}
コメント本文:
${process.env.COMMENT_TEXT || "未入力"}

補足:
${process.env.COMMENT_NOTE || "なし"}`);
    chunks.push(`--- RECENT REPLIES ---${await readDirSnippets("outputs/replies")}`);
  }

  if (mode === "weekly") {
    chunks.push(`--- RECENT DRAFTS ---${await readDirSnippets("outputs/drafts")}`);
    chunks.push(`--- PUBLISHED ---${await readDirSnippets("outputs/published")}`);
    chunks.push(`--- METRICS ---${await readDirSnippets("outputs/metrics")}`);
  }

  return chunks.join("\n\n");
}

async function main() {
  const context = await buildContext();
  const input = [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `${context}\n\n--- OUTPUT REQUIREMENTS ---\n${config.title}をMarkdownで作成してください。ファイル保存はこのスクリプトが行うため、本文のみを返してください。`,
        },
      ],
    },
  ];

  const response = await createResponseWithFallback({
    model,
    input,
    useWebSearch: mode.startsWith("research") && enableWebSearch,
  });

  const outputText = response.output_text?.trim();
  if (!outputText) {
    throw new Error("No output_text returned from OpenAI response.");
  }

  await fs.mkdir(path.join(ROOT, config.outDir), { recursive: true });
  const outputPath = path.join(ROOT, config.outDir, config.outName);
  await fs.writeFile(outputPath, `${outputText}\n`, "utf8");
  console.log(`Wrote ${path.relative(ROOT, outputPath)}`);
}

async function createResponseWithFallback({ model, input, useWebSearch }) {
  try {
    return await createResponse({ model, input, useWebSearch });
  } catch (error) {
    const message = String(error?.message || error);
    console.error(`OpenAI request failed with model=${model}, web_search=${useWebSearch}: ${message}`);

    if (useWebSearch) {
      console.error("Retrying without web_search.");
      return createResponse({ model, input, useWebSearch: false });
    }

    if (model !== fallbackModel && /model|not found|does not exist|unsupported/i.test(message)) {
      console.error(`Retrying with fallback model=${fallbackModel}.`);
      return createResponse({ model: fallbackModel, input, useWebSearch: false });
    }

    throw error;
  }
}

async function createResponse({ model, input, useWebSearch }) {
  return client.responses.create({
    model,
    ...(useWebSearch
      ? {
          tools: [
            {
              type: "web_search",
              search_context_size: "medium",
              user_location: {
                type: "approximate",
                country: "JP",
                timezone: "Asia/Tokyo",
              },
            },
          ],
          tool_choice: "auto",
        }
      : {}),
    input,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
