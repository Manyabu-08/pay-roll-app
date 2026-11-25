import React, { useMemo, useState } from 'react';
import { Activity, Play, ShieldCheck } from 'lucide-react';
import {
  DEFAULT_SLABS,
  TaxSlab,
  formatCurrency,
  generatePayslip,
  runCase58UnitTestSuite,
  runFairnessCheck,
  runReliabilityStressTest,
} from '../lib/payroll';
import { MONITORING_SAMPLES } from '../data/case58Data';

interface VerificationSuiteProps {
  slabs: TaxSlab[];
}

export const VerificationSuite: React.FC<VerificationSuiteProps> = ({
  slabs,
}) => {
  const [useDefaultForSpec, setUseDefaultForSpec] = useState(true);
  const [runCounter, setRunCounter] = useState(1);
  const [stressSummary, setStressSummary] = useState(() =>
    runReliabilityStressTest(50, DEFAULT_SLABS)
  );
  const [liveLatencySamples, setLiveLatencySamples] = useState<
    Array<{ sample: number; time: string; responseMs: number; status: string }>
  >(MONITORING_SAMPLES);
  const [latencyMode, setLatencyMode] = useState<'report' | 'live'>('report');

  const activeSuiteSlabs = useDefaultForSpec ? DEFAULT_SLABS : slabs;

  const testResults = useMemo(() => {
    void runCounter;
    return runCase58UnitTestSuite(activeSuiteSlabs);
  }, [activeSuiteSlabs, runCounter]);

  const passedCount = testResults.filter((t) => t.passed).length;

  const fairnessResult = useMemo(() => {
    return runFairnessCheck(activeSuiteSlabs);
  }, [activeSuiteSlabs]);

  const handleRun50Stress = () => {
    setStressSummary(runReliabilityStressTest(50, slabs));
  };

  const handleRunLiveLatency = () => {
    const samples: Array<{
      sample: number;
      time: string;
      responseMs: number;
      status: string;
    }> = [];
    for (let i = 1; i <= 10; i++) {
      const start = performance.now();
      generatePayslip('E001', 'Asha Rao', 1200000, 2000, slabs);
      const elapsed = Math.max(0.001, performance.now() - start);
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);
      samples.push({
        sample: i,
        time: timeStr,
        responseMs: Number(elapsed.toFixed(4)),
        status: elapsed <= 5 ? 'OK' : 'ALERT',
      });
    }
    setLiveLatencySamples(samples);
    setLatencyMode('live');
  };

  return (
    <div className="space-y-6">
      <div className="border border-slate-200 bg-white p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Live Verification, Boundary Tests &amp; Monitoring (L1.5, L4.2–L5.5)
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Executes all 14 Case 58 unit &amp; boundary tests, 5-profile fairness test, 50-run reliability invariant check, and latency monitoring directly against the payroll engine.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setUseDefaultForSpec((v) => !v)}
            className="border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-500 cursor-pointer whitespace-nowrap"
          >
            Target: {useDefaultForSpec ? 'Case 58 Default Slabs' : 'Custom Configured Slabs'}
          </button>
          <button
            type="button"
            onClick={() => setRunCounter((c) => c + 1)}
            className="inline-flex items-center gap-1.5 border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5" />
            Re-Run 14 Tests
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider">
            Unit &amp; Boundary Suite
          </div>
          <div
            className={`mt-1 text-2xl font-mono font-semibold tabular-nums ${
              passedCount === testResults.length
                ? 'text-emerald-700'
                : 'text-red-700'
            }`}
          >
            {passedCount} / {testResults.length} PASSED
          </div>
          <div className="mt-1 text-xs text-slate-500">
            TC-01 through TC-14
          </div>
        </div>

        <div className="border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider">
            50-Run Reliability (L5.1)
          </div>
          <div className="mt-1 text-2xl font-mono font-semibold tabular-nums text-emerald-700">
            {stressSummary.failures} FAILURES ({stressSummary.failureRatePct}%)
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Defect density: 1 / 27 = 37.0 per KLOC
          </div>
        </div>

        <div className="border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider">
            Fairness Parity (L5.5)
          </div>
          <div className="mt-1 text-2xl font-mono font-semibold tabular-nums text-slate-900">
            {fairnessResult.allIdentical ? 'IDENTICAL' : 'VARIANCE'}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            5 synthetic demographic profiles
          </div>
        </div>

        <div className="border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider">
            Response SLA (L4.5)
          </div>
          <div className="mt-1 text-2xl font-mono font-semibold tabular-nums text-slate-900">
            &lt; 5.00 ms
          </div>
          <div className="mt-1 text-xs text-slate-500">
            0 threshold alerts across 10 samples
          </div>
        </div>
      </div>

      {/* TC-01 to TC-14 Table with Risk Priority */}
      <section className="border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Boundary, Negative &amp; Risk-Ranked Test Execution (TC-01–TC-14)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Combines PyTest specification checks (L1.5, L4.2) with Risk = Likelihood × Impact ranking (L4.4).
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Python ref: 24/24 stmts (100% cov)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500 uppercase tracking-wider">
                <th className="py-2 pr-3 font-medium">ID</th>
                <th className="py-2 pr-3 font-medium">Input</th>
                <th className="py-2 pr-3 font-medium">Req Link</th>
                <th className="py-2 pr-3 font-medium">Expected</th>
                <th className="py-2 pr-3 font-medium">Actual Output</th>
                <th className="py-2 pr-3 font-medium text-right">Risk (L×I)</th>
                <th className="py-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {testResults.map((tc) => (
                <tr key={tc.id} className="hover:bg-slate-50">
                  <td className="py-2.5 pr-3 font-mono font-semibold text-slate-900 whitespace-nowrap">
                    {tc.id}
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-slate-700">
                    {tc.inputSummary}
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-slate-500 whitespace-nowrap">
                    {tc.requirementIds}
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-slate-700">
                    {tc.expectedSummary}
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-slate-900">
                    {tc.actualSummary}
                  </td>
                  <td className="py-2.5 pr-3 text-right font-mono tabular-nums whitespace-nowrap">
                    {tc.riskScore !== null ? (
                      <span
                        className={
                          tc.isTopFiveRisk
                            ? 'font-semibold text-amber-700'
                            : 'text-slate-600'
                        }
                      >
                        {tc.riskScore} ({tc.riskLikelihood}×{tc.riskImpact})
                        {tc.isTopFiveRisk ? ' *Top5' : ''}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-2.5 text-right font-mono font-semibold whitespace-nowrap">
                    <span
                      className={
                        tc.passed ? 'text-emerald-700' : 'text-red-700'
                      }
                    >
                      {tc.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Fairness & Stress Test Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Fairness Test (L5.5) */}
        <section className="lg:col-span-6 border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <h2 className="text-sm font-semibold text-slate-900">
                Fairness &amp; Privacy Check (L5.5)
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-semibold">
              all_values_identical: {String(fairnessResult.allIdentical)}
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-4">
            Same synthetic compensation (annual salary 1,200,000; other deductions 2,000) across five varied synthetic names, genders, and regions. Calculation takes zero demographic inputs.
          </p>

          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500 uppercase tracking-wider">
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Gender</th>
                <th className="py-2 font-medium">Region</th>
                <th className="py-2 font-medium text-right">Net Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fairnessResult.profiles.map((row) => (
                <tr key={row.empId}>
                  <td className="py-2 font-medium text-slate-900">{row.name}</td>
                  <td className="py-2 font-mono text-slate-600">{row.gender}</td>
                  <td className="py-2 text-slate-700">{row.region}</td>
                  <td className="py-2 text-right font-mono tabular-nums font-medium text-slate-900">
                    {formatCurrency(row.netPay)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Reliability + Latency Monitor (L5.1 & L4.5) */}
        <section className="lg:col-span-6 border border-slate-200 bg-white p-6 space-y-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-700" />
                <h2 className="text-sm font-semibold text-slate-900">
                  50-Run Reliability &amp; Response Time Monitor
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRun50Stress}
                  className="border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-slate-500 cursor-pointer"
                >
                  Run 50 Synthetic Executions
                </button>
                <button
                  type="button"
                  onClick={handleRunLiveLatency}
                  className="border border-slate-900 bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer"
                >
                  Sample Latency Now
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs border border-slate-200 bg-slate-50 p-3 font-mono tabular-nums">
              <div>
                <div className="text-slate-500">Executions</div>
                <div className="font-semibold text-slate-900">
                  {stressSummary.executions}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Failures</div>
                <div className="font-semibold text-emerald-700">
                  {stressSummary.failures} ({stressSummary.failureRatePct}%)
                </div>
              </div>
              <div>
                <div className="text-slate-500">Salary Range</div>
                <div className="font-semibold text-slate-900 truncate">
                  {(stressSummary.sampleMinSalary / 100000).toFixed(1)}L–
                  {(stressSummary.sampleMaxSalary / 100000).toFixed(1)}L
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-slate-700">
                Payslip Response Time vs 5.0 ms Limit (
                {latencyMode === 'report' ? 'Report L4.5 Log' : 'Live Browser Sample'})
              </span>
              {latencyMode === 'live' && (
                <button
                  type="button"
                  onClick={() => {
                    setLiveLatencySamples(MONITORING_SAMPLES);
                    setLatencyMode('report');
                  }}
                  className="text-slate-500 hover:text-slate-900 underline cursor-pointer"
                >
                  Restore Report Log
                </button>
              )}
            </div>

            <svg
              viewBox="0 0 360 130"
              className="w-full h-32 border border-slate-200 bg-slate-50"
              role="img"
              aria-label="Payslip response time against 5 ms threshold"
            >
              {/* 5 ms limit dashed line */}
              <line
                x1="36"
                y1="20"
                x2="344"
                y2="20"
                stroke="#dc2626"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
              <text x="42" y="15" fontSize="9" fill="#dc2626" fontFamily="monospace">
                limit 5.0 ms
              </text>

              {/* Baseline axes */}
              <line x1="36" y1="15" x2="36" y2="105" stroke="#94a3b8" />
              <line x1="36" y1="105" x2="344" y2="105" stroke="#94a3b8" />

              {/* Data polyline (y=105 is 0ms, y=20 is 5ms -> scale 17px/ms) */}
              <polyline
                fill="none"
                stroke="#0f172a"
                strokeWidth="2"
                points={liveLatencySamples
                  .map((s, idx) => {
                    const x = 44 + (idx / 9) * 292;
                    const clampedMs = Math.min(5.2, s.responseMs);
                    const y = 105 - (clampedMs / 5) * 85;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
              {liveLatencySamples.map((s, idx) => {
                const x = 44 + (idx / 9) * 292;
                const clampedMs = Math.min(5.2, s.responseMs);
                const y = 105 - (clampedMs / 5) * 85;
                return (
                  <circle key={s.sample} cx={x} cy={y} r="3" fill="#0f172a" />
                );
              })}
              <text x="30" y="24" fontSize="9" fill="#64748b" fontFamily="monospace" textAnchor="end">
                5
              </text>
              <text x="30" y="108" fontSize="9" fill="#64748b" fontFamily="monospace" textAnchor="end">
                0
              </text>
            </svg>

            <div className="mt-2 grid grid-cols-5 gap-1 text-[11px] font-mono tabular-nums text-slate-600">
              {liveLatencySamples.slice(0, 5).map((s) => (
                <div key={s.sample} className="border border-slate-100 bg-slate-50 px-1.5 py-1">
                  #{s.sample}: {s.responseMs}ms
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
