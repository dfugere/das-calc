// calc.js — Core calculation engine for Quebec payroll deductions and remittances
// All amounts are in cents internally to avoid floating-point issues.
// Inputs and outputs are in cents unless otherwise noted.

import { RATES } from './data.js';

/**
 * Round to nearest cent (standard rounding).
 */
function round(cents) {
  return Math.round(cents);
}

/**
 * Find the bracket for a given taxable income and return rate + K constant.
 * Brackets use the T×I - K formula (not progressive subtraction).
 */
function findBracket(taxableIncome, brackets) {
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.upTo) {
      return bracket;
    }
  }
  return brackets[brackets.length - 1];
}

/**
 * Get QC personal tax credits (E) based on status.
 *
 * Statuses:
 *   celi                    - Single: basic personal only
 *   celi_enfant             - Single parent: basic + person living alone + single-parent supplement
 *   marie_conjoint          - Married, dependent spouse: basic + spouse transfer amount (= basic)
 *   marie_conjoint_pas_charge - Married, non-dependent spouse: basic personal only
 *   second_emploi           - Second job: 0 (no personal credits)
 */
function getQcPersonalCredits(r, status) {
  switch (status) {
    case 'celi':
    case 'marie_conjoint_pas_charge':
      return r.qcBasicPersonal;
    case 'celi_enfant':
      return r.qcBasicPersonal + (r.qcPersonLivingAlone || 0) + (r.qcSingleParentSupplement || 0);
    case 'marie_conjoint':
      return r.qcBasicPersonal + r.qcBasicPersonal; // spouse transfer = basic personal
    case 'second_emploi':
      return 0;
    default:
      return r.qcBasicPersonal;
  }
}

/**
 * Get federal personal amount based on status.
 */
function getFedPersonalAmount(r, status) {
  switch (status) {
    case 'celi':
    case 'celi_enfant':
    case 'marie_conjoint_pas_charge':
      return r.fedBasicPersonal;
    case 'marie_conjoint':
      return r.fedBasicPersonal + r.fedBasicPersonal; // spouse amount
    case 'second_emploi':
      return 0;
    default:
      return r.fedBasicPersonal;
  }
}

/**
 * Calculate payroll source deductions for a single pay period.
 *
 * @param {Object} params
 * @param {number} params.year - Tax year (2019-2025)
 * @param {number} params.payFrequency - Number of pay periods per year (1, 12, 24, 26, 52)
 * @param {number} params.grossPay - Gross pay for the period in cents
 * @param {string} [params.status='celi'] - Employee status
 * @param {boolean} [params.eiSubject=true] - Subject to EI
 * @param {boolean} [params.qppSubject=true] - Subject to QPP
 * @param {number} [params.cumulQPP=0] - Cumulative QPP contributions paid so far (cents)
 * @param {number} [params.cumulQPP2=0] - Cumulative QPP2 contributions paid so far (cents)
 * @param {number} [params.cumulQPIP=0] - Cumulative QPIP premiums paid so far (cents)
 * @param {number} [params.cumulEI=0] - Cumulative EI premiums paid so far (cents)
 * @param {number} [params.cumulSalary=0] - Cumulative salary paid so far (cents)
 * @param {boolean} [params.useJulyRates=false] - Use July 2025 federal rates (only for 2025)
 * @returns {Object} Deduction breakdown
 */
export function calculateDAS(params) {
  const {
    year,
    payFrequency,
    grossPay,
    status = 'celi',
    eiSubject = true,
    qppSubject = true,
    cumulQPP = 0,
    cumulQPP2 = 0,
    cumulQPIP = 0,
    cumulEI = 0,
    cumulSalary = 0,
    useJulyRates = false,
  } = params;

  const r = RATES[year];
  if (!r) throw new Error(`No rates available for year ${year}`);

  const P = payFrequency;
  const G = grossPay;

  // --- QPP (RRQ) contribution ---
  let qppEmployee = 0;
  let qppEmployer = 0;
  let qpp2Employee = 0;
  let qpp2Employer = 0;

  if (qppSubject) {
    const exemptionPerPeriod = round(r.qppBasicExemption / P);
    const pensionableForPeriod = Math.max(0, G - exemptionPerPeriod);
    const qppMaxRemaining = Math.max(0, r.qppEmployeeMax - cumulQPP);
    qppEmployee = Math.min(round(pensionableForPeriod * r.qppRate), qppMaxRemaining);
    qppEmployer = qppEmployee;

    // QPP2 (second additional contribution) — 2024+
    if (r.qpp2Rate && r.qpp2MaxEarnings) {
      const cumulSalaryWithCurrent = cumulSalary + G;
      const qpp2EarningsTotal = Math.max(0,
        Math.min(cumulSalaryWithCurrent, r.qpp2MaxEarnings) - r.qppMaxPensionable
      );
      const qpp2EarningsPrev = Math.max(0,
        Math.min(cumulSalary, r.qpp2MaxEarnings) - r.qppMaxPensionable
      );
      const qpp2EarningsThisPeriod = Math.max(0, qpp2EarningsTotal - qpp2EarningsPrev);
      const qpp2MaxRemaining = Math.max(0, r.qpp2EmployeeMax - cumulQPP2);
      qpp2Employee = Math.min(round(qpp2EarningsThisPeriod * r.qpp2Rate), qpp2MaxRemaining);
      qpp2Employer = qpp2Employee;
    }
  }

  // --- QPIP (RQAP) premium ---
  const qpipMaxPremium = round(r.qpipMaxInsurable * r.qpipEmployeeRate);
  const qpipRemaining = Math.max(0, qpipMaxPremium - cumulQPIP);
  const qpipEmployee = Math.min(round(G * r.qpipEmployeeRate), qpipRemaining);

  const qpipEmployerMaxPremium = round(r.qpipMaxInsurable * r.qpipEmployerRate);
  const qpipEmployerPaidSoFar = round(cumulQPIP * (r.qpipEmployerRate / r.qpipEmployeeRate));
  const qpipEmployerRemaining = Math.max(0, qpipEmployerMaxPremium - qpipEmployerPaidSoFar);
  const qpipEmployer = Math.min(round(G * r.qpipEmployerRate), qpipEmployerRemaining);

  // --- EI (PAE) premium ---
  let eiEmployee = 0;
  let eiEmployer = 0;

  if (eiSubject) {
    const eiMaxPremium = round(r.eiMaxInsurable * r.eiEmployeeRate);
    const eiRemaining = Math.max(0, eiMaxPremium - cumulEI);
    eiEmployee = Math.min(round(G * r.eiEmployeeRate), eiRemaining);
    eiEmployer = round(eiEmployee * r.eiEmployerMultiplier);
  }

  // =====================================================
  // Quebec Provincial Income Tax (TP-1015.F-V formula)
  // =====================================================
  // Step 1: I = P × (G − H − CSA)
  // Step 2: Y = (T × I) − K − (lowestRate × E)
  // Step 3: A = Y / P

  // H = Deduction for workers: min(6% of gross, max deduction / P)
  const H = Math.min(
    round(G * 0.06),
    round(r.qcDeductionForWorkers / P)
  );

  // CSA = Additional QPP deduction for QC income tax
  // CS = QPP_contribution × (firstAdditionalRate / totalRate) + QPP2_contribution
  // CSA = CS (when no lump sums: B2=0, so multiplier is 1)
  const firstAdditionalRate = r.qppFirstAdditionalRate || 0;
  const CS = r.qppRate > 0
    ? round(qppEmployee * (firstAdditionalRate / r.qppRate)) + qpp2Employee
    : 0;
  const CSA = CS;

  // Annualized QC taxable income
  const qcTaxableIncome = Math.max(0, P * (G - H - CSA));

  // Personal tax credits (E)
  const E = getQcPersonalCredits(r, status);

  // Find bracket and compute tax
  const qcBracket = findBracket(qcTaxableIncome, r.qcBrackets);
  const annualQcTax = Math.max(0,
    round(qcBracket.rate * qcTaxableIncome) - qcBracket.K - round(r.qcLowestRate * E)
  );
  const qcTaxPerPeriod = Math.max(0, round(annualQcTax / P));

  // =====================================================
  // Federal Income Tax (T4127 formula for Quebec)
  // =====================================================
  // Step 1: A = gross_annual − QPP_first_additional − QPP2 (income deductions)
  // Step 2: T3 = (R × A) − K − K1 − K2Q − K4
  //   K1 = lowestRate × personal_amount
  //   K2Q = lowestRate × (base_QPP + EI + QPIP)
  //   K4 = lowestRate × min(A, CEA)
  // Step 3: T1 = T3 × (1 − 0.165)  [Quebec abatement]

  // QPP first additional contribution (annual) = income deduction
  const qppFirstAdditional = r.qppRate > 0
    ? round(qppEmployee * (firstAdditionalRate / r.qppRate))
    : 0;
  const annualQppFirstAdditional = round(qppFirstAdditional * P);
  const annualQpp2 = round(qpp2Employee * P);

  // Annualized federal taxable income (QPP additional + QPP2 reduce income)
  const fedTaxableIncome = Math.max(0,
    G * P - annualQppFirstAdditional - annualQpp2
  );

  // Select federal brackets and lowest rate (handle July 2025)
  const fedBrackets = (year === 2025 && useJulyRates && r.fedBracketsJuly)
    ? r.fedBracketsJuly
    : r.fedBrackets;
  const fedLowestRate = (year === 2025 && useJulyRates && r.fedLowestRateJuly !== undefined)
    ? r.fedLowestRateJuly
    : r.fedLowestRate;

  // Base QPP contribution for credit (at base rate, not total rate)
  const qppBaseContrib = r.qppRate > 0
    ? round(qppEmployee * (r.qppBaseRate / r.qppRate))
    : 0;
  const annualQppBaseContrib = round(qppBaseContrib * P);

  // Credits
  const fedPersonalAmount = getFedPersonalAmount(r, status);
  const K1 = round(fedLowestRate * fedPersonalAmount);
  const K2Q = round(fedLowestRate * (annualQppBaseContrib + round(eiEmployee * P) + round(qpipEmployee * P)));
  const K4 = round(fedLowestRate * Math.min(fedTaxableIncome, r.fedCEA));

  // Find bracket and compute tax
  const fedBracket = findBracket(fedTaxableIncome, fedBrackets);
  const T3 = Math.max(0,
    round(fedBracket.rate * fedTaxableIncome) - fedBracket.K - K1 - K2Q - K4
  );

  // Quebec abatement: 16.5%
  const annualFedTax = round(T3 * (1 - r.fedAbatementRate));
  const fedTaxPerPeriod = Math.max(0, round(annualFedTax / P));

  // --- Totals ---
  const totalQPP = qppEmployee + qpp2Employee; // merged RRQ line
  const totalEmployeeDeductions = totalQPP + qpipEmployee + eiEmployee + qcTaxPerPeriod + fedTaxPerPeriod;
  const netPay = G - totalEmployeeDeductions;

  const totalEmployerQPP = qppEmployer + qpp2Employer;
  const totalEmployerContributions = totalEmployerQPP + qpipEmployer + eiEmployer;

  return {
    grossPay: G,
    // Employee deductions
    qcTax: qcTaxPerPeriod,
    fedTax: fedTaxPerPeriod,
    qppEmployee: totalQPP,          // merged QPP1 + QPP2
    qpipEmployee,
    eiEmployee,
    totalEmployeeDeductions,
    netPay,
    // Employer contributions
    qppEmployer: totalEmployerQPP,  // merged QPP1 + QPP2
    qpipEmployer,
    eiEmployer,
    totalEmployerContributions,
    // Detailed QPP breakdown (for internal use)
    _qpp1Employee: qppEmployee,
    _qpp2Employee: qpp2Employee,
    _qpp1Employer: qppEmployer,
    _qpp2Employer: qpp2Employer,
    // Intermediate values for debugging
    _qcTaxableIncome: qcTaxableIncome,
    _fedTaxableIncome: fedTaxableIncome,
    _annualQcTax: annualQcTax,
    _annualFedTax: annualFedTax,
    _H: H,
    _CSA: CSA,
    _E: E,
    _K1: K1,
    _K2Q: K2Q,
    _K4: K4,
    _T3: T3,
  };
}

/**
 * Calculate employer remittance for a pay period.
 *
 * @param {Object} params
 * @param {number} params.year - Tax year (2019-2025)
 * @param {number} params.grossPayroll - Taxable salary/wages for the period (cents)
 * @param {number} params.qcTaxWithheld - Provincial tax withheld (cents)
 * @param {number} params.fedTaxWithheld - Federal tax withheld (cents)
 * @param {number} params.qppEmployee - Employee QPP contribution (cents) — merged QPP1+QPP2
 * @param {number} params.qpipEmployee - Employee QPIP premium (cents)
 * @param {number} params.eiEmployee - Employee EI premium (cents)
 * @param {number} [params.cnesstRate=0] - CNESST rate per $100 of payroll (e.g. 1.65)
 * @returns {Object} Remittance breakdown
 */
export function calculateRemittance(params) {
  const {
    year,
    grossPayroll,
    qcTaxWithheld,
    fedTaxWithheld,
    qppEmployee,
    qpipEmployee,
    eiEmployee,
    cnesstRate,
  } = params;

  const r = RATES[year];
  if (!r) throw new Error(`No rates available for year ${year}`);

  const effectiveCnesstRate = cnesstRate !== undefined ? cnesstRate : (r.cnesstRate || 0);

  // Employer matches QPP 1:1 (merged amount)
  const qppEmployer = qppEmployee;

  // Employer QPIP at employer rate
  const qpipInsurableEarnings = r.qpipEmployeeRate > 0
    ? round(qpipEmployee / r.qpipEmployeeRate)
    : 0;
  const qpipEmployer = round(qpipInsurableEarnings * r.qpipEmployerRate);

  // Employer EI at 1.4x employee
  const eiEmployer = round(eiEmployee * r.eiEmployerMultiplier);

  // CNESST: rate per $100 of gross payroll
  const cnesst = round(grossPayroll * effectiveCnesstRate / 100);

  // Health Services Fund (FSS)
  const hsf = round(grossPayroll * r.hsfBaseRate);

  // Labour Standards (CNT)
  const cntSubjectEarnings = r.cntMaxRemuneration
    ? Math.min(grossPayroll, r.cntMaxRemuneration)
    : grossPayroll;
  const cnt = round(cntSubjectEarnings * r.cntRate);

  // Total remittance
  const totalQPP = qppEmployee + qppEmployer;
  const totalQPIP = qpipEmployee + qpipEmployer;
  const totalEI = eiEmployee + eiEmployer;

  const totalRemittance =
    qcTaxWithheld +
    fedTaxWithheld +
    totalQPP +
    totalQPIP +
    totalEI +
    cnesst +
    hsf +
    cnt;

  return {
    qcTaxWithheld,
    fedTaxWithheld,
    qppEmployee,
    qppEmployer,
    totalQPP,
    qpipEmployee,
    qpipEmployer,
    totalQPIP,
    eiEmployee,
    eiEmployer,
    totalEI,
    cnesst,
    hsf,
    cnt,
    totalRemittance,
  };
}

/**
 * Format cents as a dollar string (e.g., 250000 → "$2,500.00").
 */
export function formatMoney(cents) {
  const dollars = cents / 100;
  return '$' + dollars.toLocaleString('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Parse a dollar amount string to cents.
 * Accepts: "2500", "2,500", "2500.00", "$2,500.00"
 */
export function parseMoney(str) {
  if (typeof str === 'number') return round(str * 100);
  const cleaned = str.replace(/[$,\s]/g, '');
  const dollars = parseFloat(cleaned);
  if (isNaN(dollars)) return 0;
  return round(dollars * 100);
}
