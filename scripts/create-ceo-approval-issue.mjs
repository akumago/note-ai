import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;

function requireEnv() {
  if (!token) throw new Error("GITHUB_TOKEN or GH_TOKEN is required.");
  if (!repo) throw new Error("GITHUB_REPOSITORY is required.");
}

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

async function latestBrief() {
  const dir = "outputs/ceo-briefs";
  const names = (await fs.readdir(path.join(ROOT, dir)))
    .filter((name) => name.endsWith(".md"))
    .sort();
  if (!names.length) throw new Error("No CEO approval brief found in outputs/ceo-briefs.");
  return path.join(dir, names.at(-1));
}

function extractDate(filePath, body) {
  return body.match(/^Date:\s*(\d{4}-\d{2}-\d{2})/m)?.[1]
    || path.basename(filePath).match(/(\d{4}-\d{2}-\d{2})/)?.[1]
    || new Date().toISOString().slice(0, 10);
}

async function main() {
  requireEnv();

  const briefPath = process.argv[2] || (await latestBrief());
  const body = await fs.readFile(path.join(ROOT, briefPath), "utf8");
  const date = extractDate(briefPath, body);
  const title = `CEO approval: ${date}`;
  const [owner, name] = repo.split("/");

  const openIssues = await api(`/repos/${owner}/${name}/issues?state=open&per_page=100`);
  const existing = openIssues.find((issue) => issue.title === title && !issue.pull_request);
  if (existing) {
    console.log(`Issue already exists: ${existing.html_url}`);
    return;
  }

  const issueBody = `スマホ確認用の社長承認です。\n\nコメントで \`1 採用\` / \`2 採用\` / \`3 採用\` / \`全部却下\` / \`保留\` のどれかを返信してください。\n\nSource brief: \`${briefPath}\`\n\n---\n\n${body}`;
  const issue = await api(`/repos/${owner}/${name}/issues`, {
    method: "POST",
    body: JSON.stringify({ title, body: issueBody }),
  });

  console.log(`Created issue: ${issue.html_url}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
