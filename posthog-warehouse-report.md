# PostHog Data Warehouse Setup Report

## Summary

The wizard detected a **PostgreSQL** data source (via `pg` in `package.json`) and attempted to connect it to the PostHog data warehouse. Credential collection was cancelled, so the source was not created automatically.

## Changes Made

No source-code changes were made. This skill does not modify application code.

## Sources

| Source | Kind | Status |
|--------|------|--------|
| PostgreSQL | Postgres | Needs browser setup — credentials not provided |

## Manual Steps

To finish connecting your PostgreSQL database to the PostHog data warehouse, open the link below in your browser and fill in the connection details:

**[Connect PostgreSQL in PostHog](https://us.posthog.com/project/512593/data-warehouse/new-source?kind=Postgres&utm_source=wizard&utm_campaign=warehouse-source)**

### Connection requirements

- **Host** — must be publicly reachable (no `localhost`, no private IPs like `10.x`, `172.16–31.x`, `192.168.x`). PostHog connects from its own infrastructure.
- **PostHog egress IPs to allowlist** (US region): `44.205.89.55`, `52.4.194.122`, `44.208.188.173`
- **SSL/TLS** is required for Postgres sources created after February 18, 2026.
- **Supabase users**: use the Session pooler host (`aws-0-<region>.pooler.supabase.com`), username `postgres.<project-ref>`, port `6543`, and your database password (not the JWT keys).

### Files modified or created

| File | Action |
|------|--------|
| `posthog-warehouse-report.md` | Created (this report) |
