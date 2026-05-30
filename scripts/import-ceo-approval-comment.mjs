import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;

async function api(route, options = {}) {
  const response = await fetch(`https://api.github.com${route}`, {
    ...options,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "x-github-api-version": "2022-11-28",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API failed ${response.status}: ${text}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

function formatDateInTokyo(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function parseDecision(body) {
  const text = body.trim();
  const adopted = text.match(/^([123])\s*採用\b/);
  if (adopted) return { type: "adopt", candidate: adopted[1] };
  if (/^全部却下\b/.test(text)) return { type: "reject" };
  if (/^保留\b/.test(text)) return { type: "hold" };
  return { type: "ignore" };
}

function extractCandidateBlock(issueBody, candidateNumber) {
  const pattern = new RegExp(`## Candidate ${candidateNumber}\\n([\\s\\S]*?)(?=\\n## Candidate [123]|\\n## Recommended pick|\\n## Approval file|$)`);
  return issueBody.match(pattern)?.[1]?.trim() || "";
}

function extractLine(block, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return block.match(new RegExp(`- ${escaped}:\\s*(.*)`))?.[1]?.trim() || "";
}

function safeFilePart(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9一-龠ぁ-んァ-ヶー]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "candidate";
}

async function main() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) throw new Error("GITHUB_EVENT_PATH is required.");
  if (!token) throw new Error("GITHUB_TOKEN or GH_TOKEN is required.");
  if (!repo) throw new Error("GITHUB_REPOSITORY is required.");

  const event = JSON.parse(await fs.readFile(eventPath, "utf8"));
  const { issue, comment } = event;
  if (!issue?.title?.startsWith("CEO approval:") || !comment) {
    console.log("Not a CEO approval issue comment. Skipping.");
    return;
  }

  const decision = parseDecision(comment.body || "");
  if (decision.type === "ignore") {
    console.log("Comment is not an approval command. Skipping.");
    return;
  }

  const [owner, name] = repo.split("/");

  if (decision.type !== "adopt") {
    const reply = decision.type === "reject"
      ? "全部却下として受け取りました。承認ログは作成しません。"
      : "保留として受け取りました。承認ログは作成しません。";
    await api(`/repos/${owner}/${name}/issues/${issue.number}/comments`, {
      method: "POST",
      body: JSON.stringify({ body: reply }),
    });
    console.log(reply);
    return;
  }

  const date = issue.title.match(/(\d{4}-\d{2}-\d{2})/)?.[1] || formatDateInTokyo(new Date());
  const block = extractCandidateBlock(issue.body || "", decision.candidate);
  const title = extractLine(block, "Title") || `Candidate ${decision.candidate}`;
  const outputPath = path.join(
    ROOT,
    "outputs/approvals",
    `${date}-github-issue-${issue.number}-${safeFilePart(title)}.md`,
  );

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `# Approval

- Date: ${date}
- Decision: 採用
- Candidate: ${decision.candidate}
- Title: ${title}
- Source issue: #${issue.number}
- Source issue URL: ${issue.html_url}
- CEO comment: ${comment.body.trim()}

## Candidate brief

${block || "- Candidate block was not found in the issue body."}
`, "utf8");

  await api(`/repos/${owner}/${name}/issues/${issue.number}/comments`, {
    method: "POST",
    body: JSON.stringify({ body: "承認ログを作成しました。制作部が次回この採用ネタを拾います。" }),
  });
  await api(`/repos/${owner}/${name}/issues/${issue.number}`, {
    method: "PATCH",
    body: JSON.stringify({ state: "closed" }),
  });

  console.log(`Wrote ${path.relative(ROOT, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
