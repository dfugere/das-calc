#!/usr/bin/env node
// cli.js — Command-line interface for DAS calculator
// Usage:
//   node cli.js das --year 2025 --freq 26 --gross 2500 [--status celi] [--no-ei] [--no-qpp] [--july]
//   node cli.js remit --year 2025 --gross 2500 --qctax 232.73 --fedtax 210.82 --qpp 151.38 --qpip 12.35 --ei 32.75 [--cnesst 1.65]

import { calculateDAS, calculateRemittance, formatMoney, parseMoney } from './calc.js';

function usage() {
  console.log(`
DAS Calculator — Quebec Payroll Deductions & Remittances (2016-2025)

Usage:
  node cli.js das [options]     Calculate payroll deductions
  node cli.js remit [options]   Calculate employer remittance

DAS options:
  --year <year>        Tax year (2016-2025)
  --freq <n>           Pay frequency: 1 (annual), 12 (monthly), 24 (semi-monthly), 26 (bi-weekly), 52 (weekly)
  --gross <amount>     Gross pay per period in dollars
  --status <status>    Employee status (default: celi)
                         celi                    — Single
                         celi_enfant             — Single parent (person living alone with dependants)
                         marie_conjoint          — Married, dependent spouse
                         marie_conjoint_pas_charge — Married, non-dependent spouse
                         second_emploi           — Second job (no personal credits)
  --no-ei              Not subject to EI
  --no-qpp             Not subject to QPP
  --july               Use July 2025 federal rates (14% lowest bracket; only for 2025)
  --cumul-salary <$>   Cumulative salary paid so far
  --cumul-qpp <$>      Cumulative QPP contributions paid
  --cumul-qpp2 <$>     Cumulative QPP2 contributions paid
  --cumul-qpip <$>     Cumulative QPIP premiums paid
  --cumul-ei <$>       Cumulative EI premiums paid

Remittance options:
  --year <year>        Tax year (2016-2025)
  --gross <amount>     Gross payroll for the period in dollars
  --qctax <amount>     QC provincial tax withheld
  --fedtax <amount>    Federal tax withheld
  --qpp <amount>       Employee QPP contribution (merged QPP1+QPP2)
  --qpip <amount>      Employee QPIP premium
  --ei <amount>        Employee EI premium
  --cnesst <rate>      CNESST rate per $100 (default: from data.js for year)

Examples:
  node cli.js das --year 2025 --freq 26 --gross 2500 --status celi
  node cli.js das --year 2025 --freq 1 --gross 85000 --status marie_conjoint_pas_charge --july
  node cli.js remit --year 2025 --gross 2500 --qctax 232.73 --fedtax 210.82 --qpp 151.38 --qpip 12.35 --ei 32.75 --cnesst 1.65
`);
}

function parseArgs(args) {
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--no-ei') {
      opts.noEi = true;
    } else if (arg === '--no-qpp') {
      opts.noQpp = true;
    } else if (arg === '--july') {
      opts.july = true;
    } else if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const val = args[++i];
      opts[key] = val;
    } else if (!opts._command) {
      opts._command = arg;
    }
  }
  return opts;
}

function padRight(str, len) {
  return str + ' '.repeat(Math.max(0, len - str.length));
}

function printRow(label, value, indent = 0) {
  const prefix = ' '.repeat(indent);
  console.log(`${prefix}${padRight(label, 50 - indent)} ${value.padStart(12)}`);
}

function printSep() {
  console.log('-'.repeat(63));
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  usage();
  process.exit(0);
}

const opts = parseArgs(args);
const command = opts._command;

if (command === 'das') {
  const year = parseInt(opts.year);
  const freq = parseInt(opts.freq);
  const gross = parseMoney(opts.gross || '0');
  const status = opts.status || 'celi';
  const eiSubject = !opts.noEi;
  const qppSubject = !opts.noQpp;
  const useJulyRates = !!opts.july;
  const cumulSalary = parseMoney(opts['cumul-salary'] || '0');
  const cumulQPP = parseMoney(opts['cumul-qpp'] || '0');
  const cumulQPP2 = parseMoney(opts['cumul-qpp2'] || '0');
  const cumulQPIP = parseMoney(opts['cumul-qpip'] || '0');
  const cumulEI = parseMoney(opts['cumul-ei'] || '0');

  if (!year || !freq || gross <= 0) {
    console.error('Error: --year, --freq, and --gross are required.');
    process.exit(1);
  }

  const result = calculateDAS({
    year, payFrequency: freq, grossPay: gross, status,
    eiSubject, qppSubject, useJulyRates,
    cumulQPP, cumulQPP2, cumulQPIP, cumulEI, cumulSalary,
  });

  const periodLabel = (year === 2025 && useJulyRates) ? '(July 2025+)' : '';
  console.log(`\nDAS — ${year} ${periodLabel} | Freq: ${freq}x/yr | Gross: ${formatMoney(gross)} | Status: ${status}`);
  printSep();
  printRow('Salaire brut (Gross pay)', formatMoney(result.grossPay));
  printSep();
  printRow('RETENUES EMPLOYE (EMPLOYEE DEDUCTIONS)', '');
  printRow('Impot provincial QC (QC tax)', formatMoney(result.qcTax), 2);
  printRow('Impot federal (Federal tax)', formatMoney(result.fedTax), 2);
  printRow('RRQ (QPP)', formatMoney(result.qppEmployee), 2);
  printRow('RQAP (QPIP)', formatMoney(result.qpipEmployee), 2);
  printRow('AE (EI)', formatMoney(result.eiEmployee), 2);
  printSep();
  printRow('Total retenues (Total deductions)', formatMoney(result.totalEmployeeDeductions));
  printRow('SALAIRE NET (NET PAY)', formatMoney(result.netPay));
  printSep();
  printRow('COTISATIONS EMPLOYEUR (EMPLOYER)', '');
  printRow('RRQ (QPP)', formatMoney(result.qppEmployer), 2);
  printRow('RQAP (QPIP)', formatMoney(result.qpipEmployer), 2);
  printRow('AE (EI)', formatMoney(result.eiEmployer), 2);
  printSep();
  printRow('Total employeur (Total employer)', formatMoney(result.totalEmployerContributions));
  console.log('');

} else if (command === 'remit') {
  const year = parseInt(opts.year);
  const grossPayroll = parseMoney(opts.gross || '0');
  const qcTaxWithheld = parseMoney(opts.qctax || '0');
  const fedTaxWithheld = parseMoney(opts.fedtax || '0');
  const qppEmployee = parseMoney(opts.qpp || '0');
  const qpipEmployee = parseMoney(opts.qpip || '0');
  const eiEmployee = parseMoney(opts.ei || '0');
  const cnesstRate = opts.cnesst !== undefined ? parseFloat(opts.cnesst) : undefined;

  if (!year) {
    console.error('Error: --year is required.');
    process.exit(1);
  }

  const result = calculateRemittance({
    year, grossPayroll, qcTaxWithheld, fedTaxWithheld,
    qppEmployee, qpipEmployee, eiEmployee,
    cnesstRate,
  });

  console.log(`\nRemise — ${year} | Salaire brut: ${formatMoney(grossPayroll)}`);
  printSep();
  printRow('Impot provincial QC (QC tax)', formatMoney(result.qcTaxWithheld));
  printRow('Impot federal (Federal tax)', formatMoney(result.fedTaxWithheld));
  printSep();
  printRow('RRQ (QPP)', '');
  printRow('Employe (Employee)', formatMoney(result.qppEmployee), 2);
  printRow('Employeur (Employer)', formatMoney(result.qppEmployer), 2);
  printRow('Sous-total (Subtotal)', formatMoney(result.totalQPP), 2);
  printRow('RQAP (QPIP)', '');
  printRow('Employe (Employee)', formatMoney(result.qpipEmployee), 2);
  printRow('Employeur (Employer)', formatMoney(result.qpipEmployer), 2);
  printRow('Sous-total (Subtotal)', formatMoney(result.totalQPIP), 2);
  printRow('AE (EI)', '');
  printRow('Employe (Employee)', formatMoney(result.eiEmployee), 2);
  printRow('Employeur (Employer)', formatMoney(result.eiEmployer), 2);
  printRow('Sous-total (Subtotal)', formatMoney(result.totalEI), 2);
  printSep();
  printRow('CNESST', formatMoney(result.cnesst));
  printRow('FSS (HSF)', formatMoney(result.hsf));
  printRow('Normes du travail (Labour standards)', formatMoney(result.cnt));
  printSep();
  printRow('REMISE TOTALE (TOTAL REMITTANCE)', formatMoney(result.totalRemittance));
  console.log('');

} else {
  console.error(`Unknown command: ${command}`);
  usage();
  process.exit(1);
}
