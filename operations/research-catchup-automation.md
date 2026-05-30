# Research catch-up automation

## Purpose

This automation is a safety net for days when the PC is off at the normal 19:00 research time.

## Schedule

- Normal research: daily 19:00 JST
- Catch-up research: daily 20:15 JST

## Prompt

Use:

- `prompts/codex-business-research-catchup-run.md`

## Behavior

1. Check today's `outputs/research/` and `outputs/topic-queue/`.
2. If today's research and topic queue already exist, skip to avoid duplicate work.
3. If today's files are missing, run the normal research flow.
4. Do not publish, purchase, send messages, delete data, or call paid external APIs.

## Late PC startup

If the PC starts around 20:00, the 20:15 catch-up should recover the missed 19:00 research run.
If the PC starts after 20:15, run `prompts/codex-business-research-catchup-run.md` manually from Codex.
