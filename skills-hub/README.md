# Durable Skills Hub (isolated MVP)

Status: **implementation candidate, NOT deployed**. This is a Cloudflare Worker + D1 API skeleton, not yet an MCP server or a GitHub Actions executor.

## Scope
- Bearer-token protected API; token must be configured as a secret.
- GET /health, GET /skills, POST /jobs, GET /jobs/:id.
- D1 allowlist: only approved skills can be queued.
- No arbitrary shell commands, unreviewed installation or execution.
- No inference provider or paid dependency assumed.

## Required before deployment
1. Verify existing Cloudflare accounts, domains, D1 quotas and GitHub Actions permissions.
2. Provision D1 and apply schema.sql; bind DB in wrangler.toml.
3. Set HUB_TOKEN secret; do not commit credentials.
4. Implement authenticated GitHub Actions dispatcher with per-job idempotency, limited permissions, pinned dependencies, lease/retry policy and cancellation.
5. Implement results ingestion and R2 artifact storage, with short-lived signed access.
6. Implement MCP Streamable HTTP facade and private ChatGPT plugin integration.
7. Validate real find-skills discovery, human approval of external skills, Hyperresearch execution, source retrieval and recovery tests.
8. Rate limiting, redaction, audit log, job expiry and failure-mode tests.
9. Verify billing/quota remains within R$0 incremental budget.

No production claim until end-to-end proof. This repository's research-agent skill is prompt-only and requires a compatible runtime with subagent tools.
