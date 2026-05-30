import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const mode = process.argv[2] || "daily";
const today = formatDateInTokyo(new Date());

function formatDateInTokyo(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

const prompts = {
  daily: {
    title: "Codex日次運用リマインド",
    prompt: "prompts/codex-business-daily-run.md",
    next: "Codexで日次一括実行プロンプトを実行する",
  },
  draft: {
    title: "Codex制作部リマインド",
    prompt: "prompts/codex-business-draft-run.md",
    next: "承認ログがある場合だけCodexで制作部を実行する",
  },
  weekly: {
    title: "Codex週次編集会議リマインド",
    prompt: "prompts/codex-business-weekly-run.md",
    next: "Codexで週次編集会議を実行する",
  },
};

const config = prompts[mode] || prompts.daily;

async function main() {
  await fs.mkdir(path.join(ROOT, "outputs/reminders"), { recursive: true });
  const body = `# ${config.title}

## 日付

${today}

## 実行するCodexプロンプト

\`${config.prompt}\`

## 次にやること

${config.next}

## 注意

- GitHub ActionsではAI生成しない
- OpenAI API課金を使わない
- Codex Business内で実行する
- note投稿、X投稿、コメント返信は手動
`;

  const outputPath = path.join(ROOT, "outputs/reminders", `${today}-${mode}-codex-reminder.md`);
  await fs.writeFile(outputPath, body, "utf8");
  console.log(`Wrote ${path.relative(ROOT, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
