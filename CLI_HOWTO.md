# DAS Calculator CLI — How-To for Agents

Quebec payroll source deduction and remittance calculator. Computes employee deductions (QC tax, federal tax, QPP, QPIP, EI) and employer contributions for tax years 2016-2025.

## Setup

```bash
cd /Users/dfugere/projects/thinkering/das_calculator
```

No dependencies to install. Requires Node.js with ES module support (v14+).

## Two Commands

### 1. `das` — Compute payroll deductions for a pay period

```bash
node cli.js das --year <YEAR> --freq <FREQ> --gross <AMOUNT> [options]
```

**Required:**
- `--year` — Tax year (2016-2025)
- `--freq` — Pay periods per year: `1` (annual), `12` (monthly), `24` (semi-monthly), `26` (bi-weekly), `52` (weekly)
- `--gross` — Gross pay per period in dollars (e.g. `2500` or `2,500.00`)

**Optional:**
- `--status` — Employee status (default: `celi`). Values:
  - `celi` — Single
  - `celi_enfant` — Single parent (person living alone with dependants)
  - `marie_conjoint` — Married, dependent spouse
  - `marie_conjoint_pas_charge` — Married, non-dependent spouse
  - `second_emploi` — Second job (no personal credits)
- `--no-ei` — Employee not subject to EI
- `--no-qpp` — Employee not subject to QPP
- `--july` — Use July 2025 federal rates (14% lowest bracket). Only meaningful for year 2025.
- `--cumul-salary` — Cumulative gross salary paid before this period
- `--cumul-qpp` — Cumulative QPP contributions paid before this period
- `--cumul-qpp2` — Cumulative QPP2 contributions paid before this period
- `--cumul-qpip` — Cumulative QPIP premiums paid before this period
- `--cumul-ei` — Cumulative EI premiums paid before this period

**Output:** Table showing employee deductions (QC tax, federal tax, QPP, QPIP, EI), net pay, and employer contributions (QPP, QPIP, EI).

### 2. `remit` — Compute employer remittance for a pay period

```bash
node cli.js remit --year <YEAR> --gross <AMOUNT> --qctax <$> --fedtax <$> --qpp <$> --qpip <$> --ei <$> [--cnesst <RATE>]
```

**Required:**
- `--year` — Tax year (2016-2025)
- `--gross` — Gross payroll for the period in dollars
- `--qctax` — QC provincial tax withheld (dollars)
- `--fedtax` — Federal tax withheld (dollars)
- `--qpp` — Employee QPP contribution (dollars, merged QPP1+QPP2)
- `--qpip` — Employee QPIP premium (dollars)
- `--ei` — Employee EI premium (dollars)

**Optional:**
- `--cnesst` — CNESST rate per $100 of payroll (e.g. `1.65`). Default: 0.

**Output:** Table showing taxes, QPP/QPIP/EI (employee + employer shares), CNESST, HSF, CNT, and total remittance.

## Typical Workflows

### Verify annual deductions for one employee across multiple years

To check whether the correct amounts were withheld each year, run `das` with `--freq 1` (annual) and the total annual salary:

```bash
for year in 2020 2021 2022 2023 2024 2025; do
  echo "=== $year ==="
  node cli.js das --year $year --freq 1 --gross 85000 --status celi
done
```

### Verify a bi-weekly payroll run

For a single bi-weekly pay period (26 periods/year):

```bash
node cli.js das --year 2025 --freq 26 --gross 2500 --status celi
```

### Verify deductions for an employee who started mid-year

If an employee started mid-year and has already accumulated some salary/contributions, use the cumulative fields. Example: employee starts their 14th bi-weekly pay (has received 13 periods at $2,500 = $32,500 cumulative salary):

```bash
node cli.js das --year 2025 --freq 26 --gross 2500 --status celi \
  --cumul-salary 32500 \
  --cumul-qpp 1969 \
  --cumul-qpip 160.55 \
  --cumul-ei 425.75
```

The cumulative fields ensure QPP/QPIP/EI caps are respected — once an employee hits the annual maximum, the contribution drops to zero.

### Compute total employer remittance

After computing deductions, feed the results into the remittance calculator to get the total amount the employer must remit:

```bash
node cli.js remit --year 2025 --gross 2500 \
  --qctax 232.73 --fedtax 210.82 \
  --qpp 151.38 --qpip 12.35 --ei 32.75 \
  --cnesst 1.65
```

### Compare pre-July vs post-July 2025 federal rates

In 2025, the federal lowest bracket dropped from 15% to 14% on July 1:

```bash
echo "=== Before July 2025 ==="
node cli.js das --year 2025 --freq 1 --gross 85000 --status celi

echo "=== After July 2025 ==="
node cli.js das --year 2025 --freq 1 --gross 85000 --status celi --july
```

### Batch verification script

To verify tax reports across years for the same employee, loop over years and capture output:

```bash
GROSS=85000
STATUS=marie_conjoint_pas_charge

for year in 2016 2017 2018 2019 2020 2021 2022 2023 2024 2025; do
  echo ""
  node cli.js das --year $year --freq 1 --gross $GROSS --status $STATUS
done
```

## Reading the Output

The `das` command outputs a table like:

```
DAS — 2025  | Freq: 26x/yr | Gross: $2,500.00 | Status: celi
---------------------------------------------------------------
Salaire brut (Gross pay)                              $2,500.00
---------------------------------------------------------------
RETENUES EMPLOYE (EMPLOYEE DEDUCTIONS)
  Impot provincial QC (QC tax)                          $257.72
  Impot federal (Federal tax)                           $216.11
  RRQ (QPP)                                             $151.38
  RQAP (QPIP)                                           $12.35
  AE (EI)                                                $32.75
---------------------------------------------------------------
Total retenues (Total deductions)                       $670.31
SALAIRE NET (NET PAY)                                 $1,829.69
---------------------------------------------------------------
COTISATIONS EMPLOYEUR (EMPLOYER)
  RRQ (QPP)                                             $151.38
  RQAP (QPIP)                                           $17.30
  AE (EI)                                                $45.85
---------------------------------------------------------------
Total employeur (Total employer)                        $214.53
```

Key lines for verification:
- **Total retenues** = sum of all employee deductions (should match total deductions on pay stub)
- **SALAIRE NET** = gross minus total deductions (should match net pay on pay stub)
- **Total employeur** = employer-only costs above the gross salary

## Important Notes

- All calculations use the **formula method** (TP-1015.F-V), not the table method. Results may differ from table-based calculators by up to ~$1 per period due to rounding.
- QPP for 2016-2018 has no "first additional" contribution — the full rate is the base rate.
- QPP2 (second additional contribution on earnings above the first ceiling) only exists for 2024+.
- The `--july` flag only affects year 2025. For all other years it is ignored.
- CNESST rate varies by industry. It is not built into the calculator — you must provide it via `--cnesst`.
