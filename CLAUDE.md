# DAS Calculator - Quebec Payroll Source Deduction & Remittance Calculator

## Project Overview
Quebec payroll source deduction calculator (DAS) and remittance calculator supporting years 2016-2025.

## Tech Stack
- Vanilla JavaScript, no build tools, no frameworks
- `calc.js` and `data.js` are ES modules shared between browser and Node CLI
- `index.html` is fully self-contained for web deployment
- `cli.js` is the Node.js CLI entry point

## Key Files
- `data.js` — Year-specific rates/thresholds (2016-2025)
- `calc.js` — Core calculation engine (pure functions, no DOM)
- `index.html` — Web UI (two tabs: Payroll Deductions + Remittances)
- `cli.js` — Node CLI wrapper
- `reference/` — Government PDF references (TP-1015.G-V, T4001)

## Conventions
- All monetary calculations use cents internally to avoid floating-point issues
- Reference PDFs in `reference/` are the source of truth for rates
- Bilingual labels in UI: French primary, English in parentheses
- No npm dependencies — CLI uses only Node built-ins
