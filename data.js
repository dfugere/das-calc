// data.js — Year-specific rates and thresholds for Quebec payroll deductions (2016-2025)
// Source of truth: TP-1015.G-V guides (Quebec) and T4001/T4127 guides (Federal)
// All dollar amounts in cents to avoid floating-point issues

export const RATES = {
  2016: {
    // Quebec provincial income tax brackets with K constants
    // 2016-2017: QC lowest rate is 16%
    qcBrackets: [
      { upTo: 4239000, rate: 0.16, K: 0 },
      { upTo: 8478000, rate: 0.20, K: 169560 },
      { upTo: 10315000, rate: 0.24, K: 508680 },
      { upTo: Infinity, rate: 0.2575, K: 689193 },
    ],
    qcLowestRate: 0.16,
    qcBasicPersonal: 1155000,
    qcDeductionForWorkers: 113000,
    qcPersonLivingAlone: 135500,
    qcSingleParentSupplement: 167500,

    // QPP (RRQ) — pre-2019: no first additional contribution
    qppMaxPensionable: 5490000,
    qppBasicExemption: 350000,
    qppRate: 0.05325,
    qppBaseRate: 0.05325,           // entire rate is base (no additional)
    qppFirstAdditionalRate: 0,      // no first additional before 2019
    qppEmployeeMax: 273705,
    qpp2MaxEarnings: null,
    qpp2Rate: null,
    qpp2EmployeeMax: null,

    // QPIP (RQAP)
    qpipMaxInsurable: 7150000,
    qpipEmployeeRate: 0.00548,
    qpipEmployerRate: 0.00767,

    // EI (PAE) - Quebec reduced rates
    eiMaxInsurable: 5080000,
    eiEmployeeRate: 0.0152,
    eiEmployerMultiplier: 1.4,

    // Federal income tax brackets with K constants
    fedBrackets: [
      { upTo: 4528200, rate: 0.15, K: 0 },
      { upTo: 9056300, rate: 0.205, K: 249051 },
      { upTo: 14038800, rate: 0.26, K: 747148 },
      { upTo: 20000000, rate: 0.29, K: 1168312 },
      { upTo: Infinity, rate: 0.33, K: 1968312 },
    ],
    fedLowestRate: 0.15,
    fedBasicPersonal: 1147400,
    fedCEA: 116100,
    fedAbatementRate: 0.165,

    // CNESST (employer-specific rate per $100 of payroll)
    cnesstRate: 0.5,

    // Health Services Fund (FSS)
    hsfBaseRate: 0.0165,

    // Labour Standards (CNT) — 0.08% for 2016
    cntRate: 0.0008,
    cntMaxRemuneration: 7150000,
  },

  2017: {
    qcBrackets: [
      { upTo: 4270500, rate: 0.16, K: 0 },
      { upTo: 8540500, rate: 0.20, K: 170820 },
      { upTo: 10391500, rate: 0.24, K: 512440 },
      { upTo: Infinity, rate: 0.2575, K: 694291 },
    ],
    qcLowestRate: 0.16,
    qcBasicPersonal: 1163500,
    qcDeductionForWorkers: 114000,
    qcPersonLivingAlone: 136500,
    qcSingleParentSupplement: 168500,

    qppMaxPensionable: 5530000,
    qppBasicExemption: 350000,
    qppRate: 0.054,
    qppBaseRate: 0.054,
    qppFirstAdditionalRate: 0,
    qppEmployeeMax: 279720,
    qpp2MaxEarnings: null,
    qpp2Rate: null,
    qpp2EmployeeMax: null,

    qpipMaxInsurable: 7250000,
    qpipEmployeeRate: 0.00548,
    qpipEmployerRate: 0.00767,

    eiMaxInsurable: 5130000,
    eiEmployeeRate: 0.0127,
    eiEmployerMultiplier: 1.4,

    fedBrackets: [
      { upTo: 4591600, rate: 0.15, K: 0 },
      { upTo: 9183100, rate: 0.205, K: 252538 },
      { upTo: 14235300, rate: 0.26, K: 757609 },
      { upTo: 20280000, rate: 0.29, K: 1184668 },
      { upTo: Infinity, rate: 0.33, K: 1995868 },
    ],
    fedLowestRate: 0.15,
    fedBasicPersonal: 1163500,
    fedCEA: 117800,
    fedAbatementRate: 0.165,

    cnesstRate: 0.5,
    hsfBaseRate: 0.0165,
    cntRate: 0.0007,
    cntMaxRemuneration: 7250000,
  },

  2018: {
    // 2018: QC lowest rate decreased from 16% to 15%
    qcBrackets: [
      { upTo: 4305500, rate: 0.15, K: 0 },
      { upTo: 8610500, rate: 0.20, K: 215275 },
      { upTo: 10476500, rate: 0.24, K: 559695 },
      { upTo: Infinity, rate: 0.2575, K: 743034 },
    ],
    qcLowestRate: 0.15,
    qcBasicPersonal: 1501200,
    qcDeductionForWorkers: 115000,
    qcPersonLivingAlone: 172100,
    qcSingleParentSupplement: 212400,

    qppMaxPensionable: 5590000,
    qppBasicExemption: 350000,
    qppRate: 0.054,
    qppBaseRate: 0.054,
    qppFirstAdditionalRate: 0,
    qppEmployeeMax: 282960,
    qpp2MaxEarnings: null,
    qpp2Rate: null,
    qpp2EmployeeMax: null,

    qpipMaxInsurable: 7400000,
    qpipEmployeeRate: 0.00548,
    qpipEmployerRate: 0.00767,

    eiMaxInsurable: 5170000,
    eiEmployeeRate: 0.0130,
    eiEmployerMultiplier: 1.4,

    fedBrackets: [
      { upTo: 4660500, rate: 0.15, K: 0 },
      { upTo: 9320800, rate: 0.205, K: 256328 },
      { upTo: 14448900, rate: 0.26, K: 768972 },
      { upTo: 20584200, rate: 0.29, K: 1202439 },
      { upTo: Infinity, rate: 0.33, K: 2025807 },
    ],
    fedLowestRate: 0.15,
    fedBasicPersonal: 1180900,
    fedCEA: 119500,
    fedAbatementRate: 0.165,

    cnesstRate: 0.5,
    hsfBaseRate: 0.0165,
    cntRate: 0.0007,
    cntMaxRemuneration: 7400000,
  },

  2019: {
    // Quebec provincial income tax brackets with K constants
    qcBrackets: [
      { upTo: 4379000, rate: 0.15, K: 0 },
      { upTo: 8757500, rate: 0.20, K: 218950 },      // (0.20-0.15)*4379000 = 218950
      { upTo: 10655500, rate: 0.24, K: 569250 },      // (0.24-0.15)*4379000 + (0.24-0.20)*4378500 = 394110+175140=569250... let me use formula: K = 0.24*upTo_prev - sum
      { upTo: Infinity, rate: 0.2575, K: 755721 },
    ],
    qcLowestRate: 0.15,
    qcBasicPersonal: 1526900,
    qcDeductionForWorkers: 117000,
    // QC personal credit amounts by status
    qcPersonLivingAlone: 175000,
    qcSingleParentSupplement: 216000,

    // QPP (RRQ)
    qppMaxPensionable: 5740000,
    qppBasicExemption: 350000,
    qppRate: 0.0555,
    qppBaseRate: 0.0540,           // base rate (for federal credit)
    qppFirstAdditionalRate: 0.0015, // first additional starts 2019
    qppEmployeeMax: 299145,
    qpp2MaxEarnings: null,
    qpp2Rate: null,
    qpp2EmployeeMax: null,

    // QPIP (RQAP)
    qpipMaxInsurable: 7650000,
    qpipEmployeeRate: 0.00526,
    qpipEmployerRate: 0.00736,

    // EI (PAE) - Quebec reduced rates
    eiMaxInsurable: 5310000,
    eiEmployeeRate: 0.0125,
    eiEmployerMultiplier: 1.4,

    // Federal income tax brackets with K constants
    // 2019: lowest rate is 15%
    fedBrackets: [
      { upTo: 4763000, rate: 0.15, K: 0 },
      { upTo: 9525900, rate: 0.205, K: 261965 },    // (0.205-0.15)*4763000
      { upTo: 14766700, rate: 0.26, K: 785890 },
      { upTo: 21037100, rate: 0.29, K: 1228890 },
      { upTo: Infinity, rate: 0.33, K: 2070375 },
    ],
    fedLowestRate: 0.15,
    fedBasicPersonal: 1206900,
    fedCEA: 122200,
    fedAbatementRate: 0.165,

    cnesstRate: 0.47,

    // Health Services Fund (FSS)
    hsfBaseRate: 0.0165,

    // Labour Standards (CNT)
    cntRate: 0.0007,
    cntMaxRemuneration: null,
  },

  2020: {
    qcBrackets: [
      { upTo: 4454500, rate: 0.15, K: 0 },
      { upTo: 8908000, rate: 0.20, K: 222725 },
      { upTo: 10839000, rate: 0.24, K: 579045 },
      { upTo: Infinity, rate: 0.2575, K: 768728 },
    ],
    qcLowestRate: 0.15,
    qcBasicPersonal: 1553200,
    qcDeductionForWorkers: 119000,
    qcPersonLivingAlone: 178000,
    qcSingleParentSupplement: 219700,

    qppMaxPensionable: 5870000,
    qppBasicExemption: 350000,
    qppRate: 0.0570,
    qppBaseRate: 0.0540,
    qppFirstAdditionalRate: 0.0030,
    qppEmployeeMax: 314640,
    qpp2MaxEarnings: null,
    qpp2Rate: null,
    qpp2EmployeeMax: null,

    qpipMaxInsurable: 7850000,
    qpipEmployeeRate: 0.00494,
    qpipEmployerRate: 0.00692,

    eiMaxInsurable: 5420000,
    eiEmployeeRate: 0.0120,
    eiEmployerMultiplier: 1.4,

    fedBrackets: [
      { upTo: 4853500, rate: 0.15, K: 0 },
      { upTo: 9706900, rate: 0.205, K: 266942 },
      { upTo: 15047300, rate: 0.26, K: 800822 },
      { upTo: 21436800, rate: 0.29, K: 1252241 },
      { upTo: Infinity, rate: 0.33, K: 2109713 },
    ],
    fedLowestRate: 0.15,
    fedBasicPersonal: 1322900,
    fedCEA: 124500,
    fedAbatementRate: 0.165,

    cnesstRate: 0.44,
    hsfBaseRate: 0.0165,
    cntRate: 0.0007,
    cntMaxRemuneration: null,
  },

  2021: {
    qcBrackets: [
      { upTo: 4510500, rate: 0.15, K: 0 },
      { upTo: 9020000, rate: 0.20, K: 225525 },
      { upTo: 10975500, rate: 0.24, K: 586325 },
      { upTo: Infinity, rate: 0.2575, K: 778396 },
    ],
    qcLowestRate: 0.15,
    qcBasicPersonal: 1572800,
    qcDeductionForWorkers: 120500,
    qcPersonLivingAlone: 180200,
    qcSingleParentSupplement: 222500,

    qppMaxPensionable: 6160000,
    qppBasicExemption: 350000,
    qppRate: 0.0590,
    qppBaseRate: 0.0540,
    qppFirstAdditionalRate: 0.0050,
    qppEmployeeMax: 342790,
    qpp2MaxEarnings: null,
    qpp2Rate: null,
    qpp2EmployeeMax: null,

    qpipMaxInsurable: 8350000,
    qpipEmployeeRate: 0.00494,
    qpipEmployerRate: 0.00692,

    eiMaxInsurable: 5630000,
    eiEmployeeRate: 0.0118,
    eiEmployerMultiplier: 1.4,

    fedBrackets: [
      { upTo: 4902000, rate: 0.15, K: 0 },
      { upTo: 9804000, rate: 0.205, K: 269610 },
      { upTo: 15197800, rate: 0.26, K: 808830 },
      { upTo: 21651100, rate: 0.29, K: 1264764 },
      { upTo: Infinity, rate: 0.33, K: 2130808 },
    ],
    fedLowestRate: 0.15,
    fedBasicPersonal: 1380800,
    fedCEA: 125700,
    fedAbatementRate: 0.165,

    cnesstRate: 0.42,
    hsfBaseRate: 0.0165,
    cntRate: 0.0007,
    cntMaxRemuneration: null,
  },

  2022: {
    qcBrackets: [
      { upTo: 4629500, rate: 0.15, K: 0 },
      { upTo: 9258000, rate: 0.20, K: 231475 },
      { upTo: 11265500, rate: 0.24, K: 601795 },
      { upTo: Infinity, rate: 0.2575, K: 798941 },
    ],
    qcLowestRate: 0.15,
    qcBasicPersonal: 1614300,
    qcDeductionForWorkers: 123500,
    qcPersonLivingAlone: 185000,
    qcSingleParentSupplement: 228400,

    qppMaxPensionable: 6490000,
    qppBasicExemption: 350000,
    qppRate: 0.0615,
    qppBaseRate: 0.0540,
    qppFirstAdditionalRate: 0.0075,
    qppEmployeeMax: 377610,
    qpp2MaxEarnings: null,
    qpp2Rate: null,
    qpp2EmployeeMax: null,

    qpipMaxInsurable: 8800000,
    qpipEmployeeRate: 0.00494,
    qpipEmployerRate: 0.00692,

    eiMaxInsurable: 6030000,
    eiEmployeeRate: 0.0120,
    eiEmployerMultiplier: 1.4,

    fedBrackets: [
      { upTo: 5019700, rate: 0.15, K: 0 },
      { upTo: 10039200, rate: 0.205, K: 276083 },
      { upTo: 15562500, rate: 0.26, K: 828240 },
      { upTo: 22170800, rate: 0.29, K: 1295114 },
      { upTo: Infinity, rate: 0.33, K: 2181947 },
    ],
    fedLowestRate: 0.15,
    fedBasicPersonal: 1439800,
    fedCEA: 128700,
    fedAbatementRate: 0.165,

    cnesstRate: 0.44,
    hsfBaseRate: 0.0165,
    cntRate: 0.0006,
    cntMaxRemuneration: 8800000,
  },

  2023: {
    // 2023+: QC lowest rate is 14%
    qcBrackets: [
      { upTo: 4927500, rate: 0.14, K: 0 },
      { upTo: 9854000, rate: 0.19, K: 246375 },     // (0.19-0.14)*4927500
      { upTo: 11991000, rate: 0.24, K: 739075 },    // 246375 + (0.24-0.19)*9854000
      { upTo: Infinity, rate: 0.2575, K: 948918 },
    ],
    qcLowestRate: 0.14,
    qcBasicPersonal: 1718300,
    qcDeductionForWorkers: 131500,
    qcPersonLivingAlone: 196900,
    qcSingleParentSupplement: 243100,

    qppMaxPensionable: 6660000,
    qppBasicExemption: 350000,
    qppRate: 0.0640,
    qppBaseRate: 0.0540,
    qppFirstAdditionalRate: 0.0100,
    qppEmployeeMax: 403840,
    qpp2MaxEarnings: null,
    qpp2Rate: null,
    qpp2EmployeeMax: null,

    qpipMaxInsurable: 9100000,
    qpipEmployeeRate: 0.00494,
    qpipEmployerRate: 0.00692,

    eiMaxInsurable: 6150000,
    eiEmployeeRate: 0.0127,
    eiEmployerMultiplier: 1.4,

    fedBrackets: [
      { upTo: 5335900, rate: 0.15, K: 0 },
      { upTo: 10671700, rate: 0.205, K: 293474 },
      { upTo: 16543000, rate: 0.26, K: 880418 },
      { upTo: 23567500, rate: 0.29, K: 1376708 },
      { upTo: Infinity, rate: 0.33, K: 2319408 },
    ],
    fedLowestRate: 0.15,
    fedBasicPersonal: 1500000,
    fedCEA: 136800,
    fedAbatementRate: 0.165,

    cnesstRate: 0.41,
    hsfBaseRate: 0.0165,
    cntRate: 0.0006,
    cntMaxRemuneration: 9100000,
  },

  2024: {
    qcBrackets: [
      { upTo: 5178000, rate: 0.14, K: 0 },
      { upTo: 10354500, rate: 0.19, K: 258900 },
      { upTo: 12600000, rate: 0.24, K: 776625 },
      { upTo: Infinity, rate: 0.2575, K: 997125 },
    ],
    qcLowestRate: 0.14,
    qcBasicPersonal: 1805600,
    qcDeductionForWorkers: 138000,
    qcPersonLivingAlone: 206900,
    qcSingleParentSupplement: 255400,

    qppMaxPensionable: 6850000,
    qppBasicExemption: 350000,
    qppRate: 0.0640,
    qppBaseRate: 0.0540,
    qppFirstAdditionalRate: 0.0100,
    qppEmployeeMax: 416000,
    qpp2MaxEarnings: 7320000,
    qpp2Rate: 0.04,
    qpp2EmployeeMax: 18800,

    qpipMaxInsurable: 9400000,
    qpipEmployeeRate: 0.00494,
    qpipEmployerRate: 0.00692,

    eiMaxInsurable: 6320000,
    eiEmployeeRate: 0.0132,
    eiEmployerMultiplier: 1.4,

    fedBrackets: [
      { upTo: 5586700, rate: 0.15, K: 0 },
      { upTo: 11173300, rate: 0.205, K: 307268 },
      { upTo: 17320500, rate: 0.26, K: 921800 },
      { upTo: 24675200, rate: 0.29, K: 1441415 },
      { upTo: Infinity, rate: 0.33, K: 2428423 },
    ],
    fedLowestRate: 0.15,
    fedBasicPersonal: 1570500,
    fedCEA: 143300,
    fedAbatementRate: 0.165,

    cnesstRate: 0.36,
    hsfBaseRate: 0.0165,
    cntRate: 0.0006,
    cntMaxRemuneration: 9400000,
  },

  // 2025 has two periods: before July 1 (15% federal) and after July 1 (14% federal)
  // QC rates are the same for both periods
  2025: {
    qcBrackets: [
      { upTo: 5325500, rate: 0.14, K: 0 },
      { upTo: 10649500, rate: 0.19, K: 266275 },
      { upTo: 12959000, rate: 0.24, K: 798750 },
      { upTo: Infinity, rate: 0.2575, K: 1025533 },
    ],
    qcLowestRate: 0.14,
    qcBasicPersonal: 1857100,
    qcDeductionForWorkers: 142000,
    qcPersonLivingAlone: 212800,
    qcSingleParentSupplement: 262700,

    qppMaxPensionable: 7130000,
    qppBasicExemption: 350000,
    qppRate: 0.0640,
    qppBaseRate: 0.0540,
    qppFirstAdditionalRate: 0.0100,
    qppEmployeeMax: 433920,
    qpp2MaxEarnings: 8120000,
    qpp2Rate: 0.04,
    qpp2EmployeeMax: 39600,

    qpipMaxInsurable: 9800000,
    qpipEmployeeRate: 0.00494,
    qpipEmployerRate: 0.00692,

    eiMaxInsurable: 6570000,
    eiEmployeeRate: 0.0131,
    eiEmployerMultiplier: 1.4,

    // Federal brackets — January 2025 (15% lowest rate)
    fedBrackets: [
      { upTo: 5737500, rate: 0.15, K: 0 },
      { upTo: 11475000, rate: 0.205, K: 315562 },
      { upTo: 17788200, rate: 0.26, K: 946688 },
      { upTo: 24132900, rate: 0.29, K: 1480333 },
      { upTo: Infinity, rate: 0.33, K: 2445650 },
    ],
    fedLowestRate: 0.15,

    // Federal brackets — July 2025 (14% lowest rate)
    fedBracketsJuly: [
      { upTo: 5737500, rate: 0.14, K: 0 },
      { upTo: 11475000, rate: 0.205, K: 372937 },
      { upTo: 17788200, rate: 0.26, K: 1004063 },
      { upTo: 24132900, rate: 0.29, K: 1537708 },
      { upTo: Infinity, rate: 0.33, K: 2503025 },
    ],
    fedLowestRateJuly: 0.14,

    fedBasicPersonal: 1612900,
    fedCEA: 147100,
    fedAbatementRate: 0.165,

    cnesstRate: 0.31,
    hsfBaseRate: 0.0165,
    cntRate: 0.0006,
    cntMaxRemuneration: 9800000,
  },
};

// Pay frequency labels (French primary, English in parentheses)
export const PAY_FREQUENCIES = [
  { value: 1, label: 'Annuellement (Annually)' },
  { value: 12, label: 'Mensuel (Monthly)' },
  { value: 24, label: 'Bimensuel (Semi-monthly)' },
  { value: 26, label: 'Aux deux semaines (Bi-weekly)' },
  { value: 52, label: 'Hebdomadaire (Weekly)' },
];

// Employee status options (matching impot.net)
// These affect the personal tax credits (E) for QC tax and federal tax
export const STATUS_OPTIONS = [
  { value: 'celi', label: 'Célibataire (Single)' },
  { value: 'celi_enfant', label: 'Célibataire, personne vivant seule avec enfant(s) à charge (Single parent)' },
  { value: 'marie_conjoint', label: 'Marié(e) avec conjoint à charge (Married, dependent spouse)' },
  { value: 'marie_conjoint_pas_charge', label: 'Marié(e) avec conjoint pas à charge (Married, non-dependent spouse)' },
  { value: 'second_emploi', label: 'Deuxième emploi (Second job)' },
];
