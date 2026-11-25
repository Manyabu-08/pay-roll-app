export interface TaxSlab {
  id: string;
  upper: number | null; // null represents Infinity ("Above previous")
  rate: number; // Decimal rate e.g. 0.05 for 5%
}

export interface SlabBreakdownRow {
  label: string;
  lower: number;
  upper: number | null;
  rate: number;
  taxableAmount: number;
  taxAmount: number;
}

export interface PayslipResult {
  emp_id: string;
  name: string;
  annual_salary: number;
  annual_tax: number;
  monthly_gross: number;
  monthly_tax: number;
  other_deductions: number;
  total_deductions: number;
  net_pay: number;
  breakdown: SlabBreakdownRow[];
}

export interface TestCaseExecutionResult {
  id: string;
  name: string;
  inputSummary: string;
  requirementIds: string;
  expectedSummary: string;
  actualSummary: string;
  passed: boolean;
  riskLikelihood: number | null;
  riskImpact: number | null;
  riskScore: number | null;
  isTopFiveRisk: boolean;
}

export interface FairnessProfileResult {
  empId: string;
  name: string;
  gender: string;
  region: string;
  annualSalary: number;
  otherDeductions: number;
  netPay: number;
}

export interface ReliabilityRunSummary {
  executions: number;
  failures: number;
  failureRatePct: number;
  sampleMinSalary: number;
  sampleMaxSalary: number;
  invariantChecked: string;
}

/**
 * Case 58 - Digital Payroll illustrative placeholder slabs.
 * Note: Illustrative placeholders only; not official tax advice or current tax law.
 */
export const DEFAULT_SLABS: TaxSlab[] = [
  { id: 'slab-1', upper: 300000, rate: 0.0 },
  { id: 'slab-2', upper: 700000, rate: 0.05 },
  { id: 'slab-3', upper: 1000000, rate: 0.1 },
  { id: 'slab-4', upper: 1200000, rate: 0.15 },
  { id: 'slab-5', upper: 1500000, rate: 0.2 },
  { id: 'slab-6', upper: null, rate: 0.3 },
];

export function round2(value: number): number {
  return Math.round((value + 1e-12) * 100) / 100;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function validateNonNegativeNumber(v: unknown, label: string): number {
  if (
    typeof v === 'boolean' ||
    typeof v !== 'number' ||
    !Number.isFinite(v) ||
    v < 0
  ) {
    throw new Error(`${label} must be a non-negative number`);
  }
  return v;
}

export function validateSlabs(slabs: TaxSlab[]): void {
  if (!slabs.length) {
    throw new Error('at least one tax slab is required');
  }
  let prevUpper = 0;
  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];
    if (
      typeof slab.rate !== 'number' ||
      !Number.isFinite(slab.rate) ||
      slab.rate < 0 ||
      slab.rate > 1
    ) {
      throw new Error('slab rate must be between 0% and 100%');
    }
    if (slab.upper === null) {
      if (i !== slabs.length - 1) {
        throw new Error('open-ended slab must be the final bracket');
      }
    } else {
      if (!Number.isFinite(slab.upper) || slab.upper <= prevUpper) {
        throw new Error('slab upper bounds must increase strictly');
      }
      prevUpper = slab.upper;
    }
  }
}

export function calculateAnnualTaxWithBreakdown(
  taxable: unknown,
  slabs: TaxSlab[] = DEFAULT_SLABS
): { annualTax: number; breakdown: SlabBreakdownRow[] } {
  const validTaxable = validateNonNegativeNumber(taxable, 'taxable income');
  validateSlabs(slabs);

  let tax = 0;
  let lower = 0;
  const breakdown: SlabBreakdownRow[] = [];

  for (const slab of slabs) {
    const upper = slab.upper === null ? Infinity : slab.upper;
    const taxableSlice =
      validTaxable > lower ? Math.min(validTaxable, upper) - lower : 0;
    const sliceTax = taxableSlice * slab.rate;
    tax += sliceTax;

    const label =
      slab.upper === null
        ? `Above ${lower.toLocaleString('en-IN')}`
        : `${lower.toLocaleString('en-IN')} – ${slab.upper.toLocaleString('en-IN')}`;

    breakdown.push({
      label,
      lower,
      upper: slab.upper,
      rate: slab.rate,
      taxableAmount: round2(taxableSlice),
      taxAmount: round2(sliceTax),
    });

    lower = upper;
  }

  return {
    annualTax: round2(tax),
    breakdown,
  };
}

export function annualTax(
  taxable: unknown,
  slabs: TaxSlab[] = DEFAULT_SLABS
): number {
  return calculateAnnualTaxWithBreakdown(taxable, slabs).annualTax;
}

export function generatePayslip(
  empId: unknown,
  name: unknown,
  annualSalary: unknown,
  otherDeductions: unknown = 0,
  slabs: TaxSlab[] = DEFAULT_SLABS
): PayslipResult {
  const cleanId = typeof empId === 'string' ? empId.trim() : String(empId ?? '').trim();
  const cleanName = typeof name === 'string' ? name.trim() : String(name ?? '').trim();

  if (!cleanId || !cleanName) {
    throw new Error('employee ID and name are required');
  }

  const validSalary = validateNonNegativeNumber(annualSalary, 'annual salary');
  const validDeductions = validateNonNegativeNumber(otherDeductions, 'deductions');

  const { annualTax: yearlyTax, breakdown } = calculateAnnualTaxWithBreakdown(
    validSalary,
    slabs
  );

  const monthlyGross = round2(validSalary / 12);
  const monthlyTax = round2(yearlyTax / 12);
  const totalDeductions = round2(monthlyTax + validDeductions);

  if (totalDeductions > monthlyGross) {
    throw new Error('deductions exceed gross pay');
  }

  const netPay = round2(monthlyGross - totalDeductions);

  return {
    emp_id: cleanId,
    name: cleanName,
    annual_salary: validSalary,
    annual_tax: yearlyTax,
    monthly_gross: monthlyGross,
    monthly_tax: monthlyTax,
    other_deductions: round2(validDeductions),
    total_deductions: totalDeductions,
    net_pay: netPay,
    breakdown,
  };
}

export function runCase58UnitTestSuite(
  slabs: TaxSlab[] = DEFAULT_SLABS
): TestCaseExecutionResult[] {
  const riskMeta: Record<string, { l: number; i: number; top5: boolean }> = {
    'TC-14': { l: 4, i: 5, top5: true },
    'TC-05': { l: 4, i: 4, top5: true },
    'TC-08': { l: 4, i: 4, top5: true },
    'TC-13': { l: 3, i: 5, top5: true },
    'TC-07': { l: 3, i: 5, top5: true },
    'TC-11': { l: 3, i: 4, top5: false },
    'TC-12': { l: 3, i: 3, top5: false },
    'TC-09': { l: 2, i: 3, top5: false },
    'TC-01': { l: 2, i: 3, top5: false },
    'TC-10': { l: 2, i: 2, top5: false },
  };

  interface RawCase {
    id: string;
    name: string;
    inputSummary: string;
    requirementIds: string;
    expectedSummary: string;
    run: () => { actual: string; passed: boolean };
  }

  const cases: RawCase[] = [
    {
      id: 'TC-01',
      name: 'test_tc01_below_slab1',
      inputSummary: 'annual_tax(299999)',
      requirementIds: 'FR-04',
      expectedSummary: '0.00',
      run: () => {
        const res = annualTax(299999, slabs);
        return { actual: res.toFixed(2), passed: res === 0.0 };
      },
    },
    {
      id: 'TC-02',
      name: 'test_tc02_at_slab1',
      inputSummary: 'annual_tax(300000)',
      requirementIds: 'FR-04',
      expectedSummary: '0.00',
      run: () => {
        const res = annualTax(300000, slabs);
        return { actual: res.toFixed(2), passed: res === 0.0 };
      },
    },
    {
      id: 'TC-03',
      name: 'test_tc03_above_slab1',
      inputSummary: 'annual_tax(300001)',
      requirementIds: 'FR-04',
      expectedSummary: '0.05',
      run: () => {
        const res = annualTax(300001, slabs);
        return { actual: res.toFixed(2), passed: res === 0.05 };
      },
    },
    {
      id: 'TC-04',
      name: 'test_tc04_below_slab2',
      inputSummary: 'annual_tax(699999)',
      requirementIds: 'FR-04',
      expectedSummary: '19999.95',
      run: () => {
        const res = annualTax(699999, slabs);
        return { actual: res.toFixed(2), passed: res === 19999.95 };
      },
    },
    {
      id: 'TC-05',
      name: 'test_tc05_at_slab2',
      inputSummary: 'annual_tax(700000)',
      requirementIds: 'FR-04',
      expectedSummary: '20000.00',
      run: () => {
        const res = annualTax(700000, slabs);
        return { actual: res.toFixed(2), passed: res === 20000.0 };
      },
    },
    {
      id: 'TC-06',
      name: 'test_tc06_above_slab2',
      inputSummary: 'annual_tax(700001)',
      requirementIds: 'FR-04',
      expectedSummary: '20000.10',
      run: () => {
        const res = annualTax(700001, slabs);
        return { actual: res.toFixed(2), passed: res === 20000.1 };
      },
    },
    {
      id: 'TC-07',
      name: 'test_tc07_top_slab',
      inputSummary: 'annual_tax(2000000)',
      requirementIds: 'FR-04',
      expectedSummary: '290000.00',
      run: () => {
        const res = annualTax(2000000, slabs);
        return { actual: res.toFixed(2), passed: res === 290000.0 };
      },
    },
    {
      id: 'TC-08',
      name: 'test_tc08_payslip_net',
      inputSummary: "payslip('E001', 'Asha Rao', 1200000, 2000)",
      requirementIds: 'FR-01, FR-05..08',
      expectedSummary: 'net_pay 91333.33',
      run: () => {
        const p = generatePayslip('E001', 'Asha Rao', 1200000, 2000, slabs);
        return {
          actual: `net_pay ${p.net_pay.toFixed(2)}`,
          passed: p.net_pay === 91333.33 && p.monthly_tax === 6666.67,
        };
      },
    },
    {
      id: 'TC-09',
      name: 'test_tc09_missing_id',
      inputSummary: "payslip('', 'Asha Rao', 1200000, 0)",
      requirementIds: 'FR-02, NFR-05',
      expectedSummary: 'Error: employee ID and name are required',
      run: () => {
        try {
          generatePayslip('', 'Asha Rao', 1200000, 0, slabs);
          return { actual: 'No error raised', passed: false };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return {
            actual: `Error: ${msg}`,
            passed: msg === 'employee ID and name are required',
          };
        }
      },
    },
    {
      id: 'TC-10',
      name: 'test_tc10_missing_name',
      inputSummary: "payslip('E001', '   ', 1200000, 0)",
      requirementIds: 'FR-02, NFR-05',
      expectedSummary: 'Error: employee ID and name are required',
      run: () => {
        try {
          generatePayslip('E001', '   ', 1200000, 0, slabs);
          return { actual: 'No error raised', passed: false };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return {
            actual: `Error: ${msg}`,
            passed: msg === 'employee ID and name are required',
          };
        }
      },
    },
    {
      id: 'TC-11',
      name: 'test_tc11_negative_salary',
      inputSummary: "payslip('E001', 'Asha Rao', -1, 0)",
      requirementIds: 'FR-03, NFR-05',
      expectedSummary: 'Error: annual salary must be a non-negative number',
      run: () => {
        try {
          generatePayslip('E001', 'Asha Rao', -1, 0, slabs);
          return { actual: 'No error raised', passed: false };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return {
            actual: `Error: ${msg}`,
            passed: msg === 'annual salary must be a non-negative number',
          };
        }
      },
    },
    {
      id: 'TC-12',
      name: 'test_tc12_negative_deduction',
      inputSummary: "payslip('E001', 'Asha Rao', 600000, -5)",
      requirementIds: 'FR-03, NFR-05',
      expectedSummary: 'Error: deductions must be a non-negative number',
      run: () => {
        try {
          generatePayslip('E001', 'Asha Rao', 600000, -5, slabs);
          return { actual: 'No error raised', passed: false };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return {
            actual: `Error: ${msg}`,
            passed: msg === 'deductions must be a non-negative number',
          };
        }
      },
    },
    {
      id: 'TC-13',
      name: 'test_tc13_negative_net_blocked',
      inputSummary: "payslip('E001', 'Asha Rao', 120000, 15000)",
      requirementIds: 'FR-09, NFR-05',
      expectedSummary: 'Error: deductions exceed gross pay',
      run: () => {
        try {
          generatePayslip('E001', 'Asha Rao', 120000, 15000, slabs);
          return { actual: 'No error raised', passed: false };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return {
            actual: `Error: ${msg}`,
            passed: msg === 'deductions exceed gross pay',
          };
        }
      },
    },
    {
      id: 'TC-14',
      name: 'test_tc14_nan_rejected',
      inputSummary: "payslip('E001', 'Asha Rao', NaN, 0)",
      requirementIds: 'FR-03, NFR-05',
      expectedSummary: 'Error: annual salary must be a non-negative number',
      run: () => {
        try {
          generatePayslip('E001', 'Asha Rao', Number.NaN, 0, slabs);
          return { actual: 'No error raised', passed: false };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return {
            actual: `Error: ${msg}`,
            passed: msg === 'annual salary must be a non-negative number',
          };
        }
      },
    },
  ];

  return cases.map((tc) => {
    const { actual, passed } = tc.run();
    const meta = riskMeta[tc.id];
    return {
      id: tc.id,
      name: tc.name,
      inputSummary: tc.inputSummary,
      requirementIds: tc.requirementIds,
      expectedSummary: tc.expectedSummary,
      actualSummary: actual,
      passed,
      riskLikelihood: meta ? meta.l : null,
      riskImpact: meta ? meta.i : null,
      riskScore: meta ? meta.l * meta.i : null,
      isTopFiveRisk: meta ? meta.top5 : false,
    };
  });
}

export function runFairnessCheck(
  slabs: TaxSlab[] = DEFAULT_SLABS
): { profiles: FairnessProfileResult[]; allIdentical: boolean } {
  const syntheticPeople = [
    { empId: 'S001', name: 'Anita', gender: 'F', region: 'Bengaluru' },
    { empId: 'S002', name: 'Rahul', gender: 'M', region: 'Delhi' },
    { empId: 'S003', name: 'Priya', gender: 'F', region: 'Guwahati' },
    { empId: 'S004', name: 'Mohammed', gender: 'M', region: 'Chennai' },
    { empId: 'S005', name: 'Alex', gender: 'NB', region: 'Pune' },
  ];

  const profiles = syntheticPeople.map((person) => {
    const slip = generatePayslip(person.empId, person.name, 1200000, 2000, slabs);
    return {
      empId: person.empId,
      name: person.name,
      gender: person.gender,
      region: person.region,
      annualSalary: 1200000,
      otherDeductions: 2000,
      netPay: slip.net_pay,
    };
  });

  const uniqueNetPays = new Set(profiles.map((p) => p.netPay));
  return {
    profiles,
    allIdentical: uniqueNetPays.size === 1,
  };
}

export function runReliabilityStressTest(
  runs = 50,
  slabs: TaxSlab[] = DEFAULT_SLABS
): ReliabilityRunSummary {
  let failures = 0;
  let minSal = Infinity;
  let maxSal = 0;

  for (let i = 0; i < runs; i++) {
    const annualSalary = Math.round(120000 + Math.random() * 2880000);
    minSal = Math.min(minSal, annualSalary);
    maxSal = Math.max(maxSal, annualSalary);
    const otherDeductions = Math.round(Math.random() * 2500);
    try {
      const slip = generatePayslip(
        `SYN-${String(i + 1).padStart(3, '0')}`,
        `Synthetic User ${i + 1}`,
        annualSalary,
        otherDeductions,
        slabs
      );
      const recomputedNet = round2(slip.monthly_gross - slip.total_deductions);
      if (slip.net_pay < 0 || Math.abs(slip.net_pay - recomputedNet) > 0.001) {
        failures++;
      }
    } catch {
      failures++;
    }
  }

  return {
    executions: runs,
    failures,
    failureRatePct: round2((failures / runs) * 100),
    sampleMinSalary: minSal === Infinity ? 0 : minSal,
    sampleMaxSalary: maxSal,
    invariantChecked: 'net = gross - deductions and net >= 0',
  };
}
