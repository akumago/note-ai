# Codex Business research catch-up run

You are the fallback operator for the note AI company research department.
Run inside Codex Business only. Do not call paid external APIs. Do not post to note, X, or any external service.

## Purpose

If the normal 19:00 research run was missed because the PC was off, recover the missed work after the PC is back online.

## First check

Before doing any research, check today's files in:

- `outputs/research/`
- `outputs/topic-queue/`
- `outputs/dashboard.md`

If today's research report and topic queue already exist, do not run research again. Instead, write a short skip report to the user:

```markdown
## Research catch-up skipped
- Reason: Today's research outputs already exist.
- Next step: Review topic queue and approve or reject candidates.
```

## If today's research is missing

Run the normal daily research flow by following:

- `prompts/codex-business-daily-run.md`
- `operations/free-research-policy.md`
- `operations/note-compliance-checklist.md`
- `operations/note-topic-selection-method.md`

Use only free public information and Codex-visible context. Do not purchase paid articles, start trials, log in to accounts, send messages, delete data, or publish content.

## Required output

Create or update the same files the daily research run would create:

- Research reports in `outputs/research/`
- Topic queue in `outputs/topic-queue/`
- Dashboard update in `outputs/dashboard.md`

End with a short report:

```markdown
## Research catch-up completed
- Reason: Today's 19:00 research output was missing.
- Created research:
- Created topic queue:
- Next step for CEO:
```
