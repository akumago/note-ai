# GitHub Issue approval workflow

## Purpose

The CEO should approve topics from a smartphone without opening local files.

## Flow

1. Codex creates a CEO approval brief in `outputs/ceo-briefs/`.
2. The brief file is pushed to GitHub.
3. GitHub Actions creates an issue titled `CEO approval: YYYY-MM-DD`.
4. The CEO comments one of:
   - `1 採用`
   - `2 採用`
   - `3 採用`
   - `全部却下`
   - `保留`
5. If the CEO comments `1 採用`, `2 採用`, or `3 採用`, GitHub Actions writes an approval log to `outputs/approvals/`.
6. The draft department can pick up that approval at the next draft run.

## Safety

This workflow only creates GitHub issues and approval log files.
It does not post to note, post to X, send replies, purchase content, or call paid AI APIs.
