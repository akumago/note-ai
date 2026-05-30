import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const requiredFiles = [
  "package.json",
  "scripts/cloud-agent.mjs",
  "scripts/build-dashboard.mjs",
  "scripts/check-approval.mjs",
  "scripts/build-publish-queue.mjs",
  "scripts/build-post-ready.mjs",
  "scripts/build-codex-reminder.mjs",
  "scripts/create-ceo-approval-issue.mjs",
  "scripts/import-ceo-approval-comment.mjs",
  "prompts/codex-business-daily-run.md",
  "prompts/codex-business-research-catchup-run.md",
  "prompts/codex-business-ceo-approval-brief.md",
  "prompts/codex-business-draft-run.md",
  "prompts/codex-business-weekly-run.md",
  "prompts/comment-reply.md",
  "prompts/daily-research.md",
  "prompts/research-note.md",
  "prompts/research-x.md",
  "prompts/research-youtube.md",
  "prompts/research-seo.md",
  "prompts/research-market.md",
  "prompts/topic-curation.md",
  "prompts/daily-draft.md",
  "prompts/weekly-editorial-meeting.md",
  "agents/リサーチ部長.md",
  "agents/制作部編集長.md",
  "operations/note-compliance-checklist.md",
  "operations/note-topic-selection-method.md",
  "operations/note-article-writing-method.md",
  "operations/note-quality-upgrade-methods.md",
  "operations/note-series-decision-rule.md",
  "operations/free-research-policy.md",
  "operations/comment-reply-workflow.md",
  "operations/codex-business-runbook.md",
  "operations/research-catchup-automation.md",
  "operations/ceo-approval-brief-workflow.md",
  "operations/github-issue-approval-workflow.md",
  ".github/workflows/daily-research.yml",
  ".github/workflows/daily-draft.yml",
  ".github/workflows/comment-reply.yml",
  ".github/workflows/ceo-approval.yml",
  ".github/workflows/weekly-editorial.yml",
];

const requiredDirs = [
  "outputs/research",
  "outputs/topic-queue",
  "outputs/drafts",
  "outputs/publish-queue",
  "outputs/post-ready",
  "outputs/replies",
  "outputs/reminders",
  "outputs/approvals",
  "outputs/ceo-briefs",
  "outputs/published",
  "outputs/metrics",
];

async function exists(relativePath) {
  try {
    await fs.access(path.join(ROOT, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const missingFiles = [];

  for (const file of requiredFiles) {
    if (!(await exists(file))) {
      missingFiles.push(file);
    }
  }

  for (const dir of requiredDirs) {
    await fs.mkdir(path.join(ROOT, dir), { recursive: true });
  }

  if (missingFiles.length) {
    console.error("Preflight failed. Missing required files:");
    for (const file of missingFiles) {
      console.error(`- ${file}`);
    }
    process.exit(1);
  }

  console.log("Preflight passed.");
  console.log("Required files exist.");
  console.log("Output directories are ready.");

  if (!process.env.OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY is not set. This is OK for preflight, but cloud jobs need it.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
