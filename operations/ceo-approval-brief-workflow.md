# CEO approval brief workflow

## Purpose

The research department should not make the CEO search through raw files.
After research, Codex creates a short approval brief with three choices.

## Schedule

- 19:00 JST: research department
- 19:10 JST: CEO approval brief
- 20:15 JST: research catch-up
- 22:00 JST: draft department

## CEO action

The CEO replies with one short decision:

- `1 採用`
- `2 採用`
- `3 採用`
- `全部却下`
- `保留`

## Output

Approval briefs are saved to:

- `outputs/ceo-briefs/`

Approved decisions are saved to:

- `outputs/approvals/`

## Safety

This step does not publish, send messages, buy anything, delete anything, or call paid external APIs.
