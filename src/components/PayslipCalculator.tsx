import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileCode2,
  RotateCcw,
} from 'lucide-react';
import {
  DEFAULT_SLABS,
  TaxSlab,
  formatCurrency,
  generatePayslip,
} from '../lib/payroll';

interface PayslipCalculatorProps {
  slabs: TaxSlab[];
  onExportPayslip?: (htmlContent: string, empId: string) => void;
}

interface PresetScenario {
  id: string;
  label: string;
  empId: string;
  name: string;
  salaryInput: string;
  deductionsInput: string;
}

const PRESETS: PresetScenario[] = [
  {
    id: 'asha-demo',
    label: 'E001 Asha Rao (TC-08)',
    empId: 'E001',
    name: 'Asha Rao',
    salaryInput: '1200000',
    deductionsInput: '2000',
  },
  {
    id: 'below-slab1',
    label: 'Below Slab 1 (TC-01)',
    empId: 'E002',
    name: 'Kiran Nair',
    salaryInput: '299999',
    deductionsInput: '0',
  },
  {
    id: 'top-slab',
    label: 'Top Slab 20L (TC-07)',
    empId: 'E003',
    name: 'Meera Iyer',
    salaryInput: '2000000',
    deductionsInput: '5000',
  },
  {
    id: 'blank-id',
    label: 'Blank ID (TC-09)',
    empId: '',
    name: 'Asha Rao',
    salaryInput: '1200000',
    deductionsInput: '0',
  },
  {
    id: 'neg-salary',
    label: 'Negative Salary (TC-11)',
    empId: 'E001',
    name: 'Asha Rao',
    salaryInput: '-1',
    deductionsInput: '0',
  },
  {
    id: 'over-ded',
    label: 'Deductions > Gross (TC-13)',
    empId: 'E001',
    name: 'Asha Rao',
    salaryInput: '120000',
    deductionsInput: '15000',
  },
];

export function buildPayslipHtml(
  payslip: ReturnType<typeof generatePayslip>
): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Digital Payroll Payslip — ${payslip.emp_id}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 40px; }
    .sheet { max-width: 560px; border: 1px solid #cbd5e1; padding: 24px; }
    h1 { font-size: 18px; margin: 0 0 4px; }
    p.note { font-size: 12px; color: #475569; margin: 0 0 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    td { padding: 8px 4px; border-bottom: 1px solid #e2e8f0; }
    td.num { text-align: right; font-variant-numeric: tabular-nums; font-family: monospace; }
    tr.total td { font-weight: 700; border-top: 2px solid #0f172a; border-bottom: none; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="sheet">
    <h1>Digital Payroll — Payslip (Synthetic Demo)</h1>
    <p class="note">Case 58 Prototype Output. Illustrative placeholder tax slabs only; not official tax advice.</p>
    <table>
      <tr><td>Employee ID</td><td class="num">${payslip.emp_id}</td></tr>
      <tr><td>Name</td><td class="num">${payslip.name}</td></tr>
      <tr><td>Annual salary</td><td class="num">${formatCurrency(payslip.annual_salary)}</td></tr>
      <tr><td>Monthly gross</td><td class="num">${formatCurrency(payslip.monthly_gross)}</td></tr>
      <tr><td>Income tax (monthly)</td><td class="num">${formatCurrency(payslip.monthly_tax)}</td></tr>
      <tr><td>Other deductions</td><td class="num">${formatCurrency(payslip.other_deductions)}</td></tr>
      <tr><td>Total deductions</td><td class="num">${formatCurrency(payslip.total_deductions)}</td></tr>
      <tr class="total"><td>Net pay</td><td class="num">${formatCurrency(payslip.net_pay)}</td></tr>
    </table>
  </div>
</body>
</html>`;
}

export const PayslipCalculator: React.FC<PayslipCalculatorProps> = ({ slabs }) => {
  const [empId, setEmpId] = useState('E001');
  const [name, setName] = useState('Asha Rao');
  const [salaryInput, setSalaryInput] = useState('1200000');
  const [deductionsInput, setDeductionsInput] = useState('2000');
  const [activePresetId, setActivePresetId] = useState<string>('asha-demo');

  const isCustomSlabs = useMemo(() => {
    return JSON.stringify(slabs) !== JSON.stringify(DEFAULT_SLABS);
  }, [slabs]);

  const computation = useMemo(() => {
    const trimmedSalary = salaryInput.trim();
    const trimmedDeductions = deductionsInput.trim();

    const parsedSalary =
      trimmedSalary === '' ? Number.NaN : Number(trimmedSalary);
    const parsedDeductions =
      trimmedDeductions === '' ? Number.NaN : Number(trimmedDeductions);

    try {
      const result = generatePayslip(
        empId,
        name,
        parsedSalary,
        parsedDeductions,
        slabs
      );
      return { ok: true as const, result };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : 'Invalid payroll input',
      };
    }
  }, [empId, name, salaryInput, deductionsInput, slabs]);

  const applyPreset = (preset: PresetScenario) => {
    setActivePresetId(preset.id);
    setEmpId(preset.empId);
    setName(preset.name);
    setSalaryInput(preset.salaryInput);
    setDeductionsInput(preset.deductionsInput);
  };

  const handleDownloadHtml = () => {
    if (!computation.ok) return;
    const html = buildPayslipHtml(computation.result);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `payslip_${computation.result.emp_id}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    if (!computation.ok) return;
    const payload = {
      disclaimer:
        'Synthetic demonstration data only. Illustrative placeholder tax slabs.',
      ...computation.result,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `payslip_${computation.result.emp_id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="border border-slate-200 bg-white p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Payslip &amp; Progressive Tax Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Calculates progressive annual tax, monthly tax deduction (annual / 12), and net monthly pay using synthetic demonstration data.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-600 shrink-0 border border-slate-200 bg-slate-50 px-3 py-1.5">
          {isCustomSlabs ? 'Active Slabs: Custom Config' : 'Active Slabs: Case 58 Default (6 tiers)'}
        </div>
      </div>

      {/* Synthetic Scenario Presets */}
      <div className="border border-slate-200 bg-white p-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Quick Synthetic Test Inputs (FR-01 to FR-10)
          </span>
          <button
            type="button"
            onClick={() => applyPreset(PRESETS[0])}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to E001 Demo
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => {
            const active = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-white'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Column Calculator + Payslip Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Form */}
        <section
          aria-label="Employee Payroll Inputs"
          className="lg:col-span-5 border border-slate-200 bg-white p-6"
        >
          <div className="border-b border-slate-200 pb-3 mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Synthetic Employee Input (FR-01)
            </h2>
            <span className="text-xs font-mono text-slate-500">Selenium-ready IDs</span>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            <div>
              <label
                htmlFor="emp-id"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Employee ID <span className="text-slate-400 font-mono">(#emp-id)</span>
              </label>
              <input
                id="emp-id"
                name="emp_id"
                type="text"
                value={empId}
                onChange={(e) => {
                  setActivePresetId('');
                  setEmpId(e.target.value);
                }}
                placeholder="e.g. E001"
                className="w-full border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-900 focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="emp-name"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Synthetic Employee Name <span className="text-slate-400 font-mono">(#emp-name)</span>
              </label>
              <input
                id="emp-name"
                name="emp_name"
                type="text"
                value={name}
                onChange={(e) => {
                  setActivePresetId('');
                  setName(e.target.value);
                }}
                placeholder="e.g. Asha Rao"
                className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="annual-salary"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Annual Salary <span className="text-slate-400 font-mono">(#annual-salary)</span>
              </label>
              <input
                id="annual-salary"
                name="annual_salary"
                type="text"
                inputMode="decimal"
                value={salaryInput}
                onChange={(e) => {
                  setActivePresetId('');
                  setSalaryInput(e.target.value);
                }}
                placeholder="e.g. 1200000"
                className="w-full border border-slate-300 bg-white px-3 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="other-deductions"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Other Monthly Deductions <span className="text-slate-400 font-mono">(#other-deductions)</span>
              </label>
              <input
                id="other-deductions"
                name="other_deductions"
                type="text"
                inputMode="decimal"
                value={deductionsInput}
                onChange={(e) => {
                  setActivePresetId('');
                  setDeductionsInput(e.target.value);
                }}
                placeholder="e.g. 2000"
                className="w-full border border-slate-300 bg-white px-3 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-slate-900 focus:outline-none"
              />
            </div>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-200 text-xs text-slate-500 leading-relaxed">
            Validation rules enforced: non-empty ID and name (FR-02), finite non-negative numbers rejecting <code className="font-mono text-slate-700">NaN</code>/<code className="font-mono text-slate-700">Infinity</code> (FR-03, TC-14), and negative net-pay guard (FR-09, TC-13).
          </div>
        </section>

        {/* Right: Payslip Summary or Validation Error */}
        <section
          aria-label="Generated Payslip Output"
          className="lg:col-span-7 space-y-6"
        >
          {!computation.ok ? (
            <div
              id="validation-error"
              role="alert"
              className="border border-red-300 bg-red-50 p-6"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-red-700">
                    Validation Blocked Payslip Generation (NFR-05)
                  </div>
                  <p className="mt-1 text-base font-mono font-medium text-red-900">
                    ValueError: {computation.error}
                  </p>
                  <p className="mt-2 text-xs text-red-800">
                    Invalid inputs never produce a partial or negative payslip. Adjust the highlighted input or select a valid synthetic preset.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Payslip Statement */}
              <div
                id="payslip-summary"
                className="border border-slate-200 bg-white p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Valid Synthetic Payslip Computed</span>
                    </div>
                    <h2 className="text-base font-semibold text-slate-900 mt-1">
                      Digital Payroll — Payslip (synthetic demo)
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id="download-payslip-html"
                      type="button"
                      onClick={handleDownloadHtml}
                      className="inline-flex items-center gap-1.5 border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download HTML
                    </button>
                    <button
                      id="download-payslip-json"
                      type="button"
                      onClick={handleDownloadJson}
                      className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-500 cursor-pointer whitespace-nowrap"
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                      JSON
                    </button>
                  </div>
                </div>

                <table className="w-full text-sm mt-3">
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-2.5 text-slate-600">Employee ID</td>
                      <td
                        id="payslip-emp-id"
                        className="py-2.5 text-right font-mono font-medium text-slate-900"
                      >
                        {computation.result.emp_id}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-slate-600">Name</td>
                      <td
                        id="payslip-emp-name"
                        className="py-2.5 text-right font-medium text-slate-900"
                      >
                        {computation.result.name}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-slate-600">Monthly gross</td>
                      <td
                        id="payslip-monthly-gross"
                        className="py-2.5 text-right font-mono tabular-nums text-slate-900"
                      >
                        {formatCurrency(computation.result.monthly_gross)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-slate-600">Income tax (monthly)</td>
                      <td
                        id="payslip-monthly-tax"
                        className="py-2.5 text-right font-mono tabular-nums text-slate-900"
                      >
                        {formatCurrency(computation.result.monthly_tax)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-slate-600">Other deductions</td>
                      <td
                        id="payslip-other-deductions"
                        className="py-2.5 text-right font-mono tabular-nums text-slate-900"
                      >
                        {formatCurrency(computation.result.other_deductions)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-slate-600">Total deductions</td>
                      <td
                        id="payslip-total-deductions"
                        className="py-2.5 text-right font-mono tabular-nums text-slate-900"
                      >
                        {formatCurrency(computation.result.total_deductions)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-900 bg-slate-50">
                      <td className="py-3 px-2 font-semibold text-slate-900">
                        Net pay
                      </td>
                      <td
                        id="payslip-net-pay"
                        className="py-3 px-2 text-right font-mono tabular-nums text-base font-bold text-slate-900"
                      >
                        {formatCurrency(computation.result.net_pay)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Progressive Tax Slab Breakdown */}
              <div className="border border-slate-200 bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Annual Progressive Tax Breakdown (FR-04)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Illustrative placeholder brackets applied slice-by-slice to{' '}
                      <span className="font-mono tabular-nums text-slate-700">
                        {formatCurrency(computation.result.annual_salary)}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Annual Tax Total</div>
                    <div className="text-sm font-mono font-semibold tabular-nums text-slate-900">
                      {formatCurrency(computation.result.annual_tax)}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-500 uppercase tracking-wider">
                        <th className="py-2 font-medium">Slab Bracket</th>
                        <th className="py-2 font-medium text-right">Rate</th>
                        <th className="py-2 font-medium text-right">Taxable Slice</th>
                        <th className="py-2 font-medium text-right">Slab Tax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {computation.result.breakdown.map((row) => (
                        <tr
                          key={row.label}
                          className={
                            row.taxableAmount > 0 ? 'bg-white' : 'bg-slate-50/50 text-slate-400'
                          }
                        >
                          <td className="py-2 font-mono">{row.label}</td>
                          <td className="py-2 text-right font-mono tabular-nums">
                            {(row.rate * 100).toFixed(0)}%
                          </td>
                          <td className="py-2 text-right font-mono tabular-nums">
                            {formatCurrency(row.taxableAmount)}
                          </td>
                          <td className="py-2 text-right font-mono tabular-nums font-medium text-slate-900">
                            {formatCurrency(row.taxAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};
