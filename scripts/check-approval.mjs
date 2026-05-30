import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const today = formatDateInTokyo(new Date());
const allowOldApproval = process.env.ALLOW_OLD_APPROVAL === "true";

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

function extractDecision(text) {
  const match = text.match(/- 判断:\s*(.+)/);
  return match?.[1]?.trim() || "";
}

function extractDate(text) {
  const match = text.match(/- 日付:\s*(\d{4}-\d{2}-\d{2})/);
  return match?.[1] || "";
}

async function writeGitHubOutput(values) {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (!outputFile) return;
  const lines = Object.entries(values).map(([key, value]) => `${key}=${value}`);
  await fs.appendFile(outputFile, `${lines.join("\n")}\n`, "utf8");
}

async function main() {
  const names = await listMarkdown("outputs/approvals");
  const approved = [];

  for (const name of names) {
    const rel = `outputs/approvals/${name}`;
    const text = await readText(rel);
    const decision = extractDecision(text);
    const date = extractDate(text) || name.slice(0, 10);

    if (decision.includes("採用") && (allowOldApproval || date === today)) {
      approved.push({ name, rel, date });
    }
  }

  const latest = approved.at(-1);
  const shouldRun = Boolean(latest);

  await writeGitHubOutput({
    should_run: shouldRun ? "true" : "false",
    approval_file: latest?.rel || "",
    approval_date: latest?.date || "",
  });

  if (shouldRun) {
    console.log(`Approved topic found: ${latest.rel}`);
    return;
  }

  console.log(`No approved topic for ${today}. Draft generation will be skipped.`);
  if (!allowOldApproval) {
    console.log("Set ALLOW_OLD_APPROVAL=true only when intentionally drafting from older approvals.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
