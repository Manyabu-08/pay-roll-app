import React, { useMemo, useState } from 'react';
import { GitBranch, Search } from 'lucide-react';
import {
  AI_DISCLOSURE_STATEMENT,
  AI_REFACTOR_LOG,
  AI_USAGE_LOG,
  BURNDOWN_SPRINTS,
  CASE_58_META,
  CODE_REVIEW_CHECKLIST,
  DECISION_MATRIX,
  DOCKERFILE_SNIPPET,
  DUPLICATE_TICKETS,
  GIT_COMMITS,
  JENKINSFILE_SNIPPET,
  REQUIREMENTS,
  SCRUM_SETUP,
  SDLC_PHASES,
  THEORY_QA,
  USER_STORIES,
  WORKING_AGREEMENT,
} from '../data/case58Data';

type ReportSection = 'overview' | 'module1' | 'module2' | 'module3' | 'quality';

export const EngineeringReportView: React.FC = () => {
  const [section, setSection] = useState<ReportSection>('overview');
  const [theoryQuery, setTheoryQuery] = useState('');

  const matrixTotals = useMemo(() => {
    const totals = { waterfall: 0, iterative: 0, agile: 0 };
    for (const row of DECISION_MATRIX) {
      const w = row.weight / 100;
      totals.waterfall += w * row.waterfall;
      totals.iterative += w * row.iterative;
      totals.agile += w * row.agile;
    }
    return totals;
  }, []);

  const filteredTheory = useMemo(() => {
    const q = theoryQuery.trim().toLowerCase();
    if (!q) return THEORY_QA;
    return THEORY_QA.filter(
      (item) =>
        item.id.toLowerCase().includes(q) ||
        item.module.toLowerCase().includes(q) ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [theoryQuery]);

  const sections: Array<{ id: ReportSection; label: string }> = [
    { id: 'overview', label: 'Overview & FR/NFR' },
    { id: 'module1', label: 'Module 1: Waterfall' },
    { id: 'module2', label: 'Module 2: Scrum' },
    { id: 'module3', label: 'Module 3: Git & DevOps' },
    { id: 'quality', label: 'Modules 4–5 & Theory' },
  ];

  return (
    <div className="space-y-6">
      <div className="border border-slate-200 bg-white p-4 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Case 58 — Digital Payroll Engineering Report
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Complete assignment traceability across Waterfall, Scrum, DevOps, Testing, SQA, and Responsible AI.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {sections.map((tab) => {
            const active = section === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSection(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium border cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-400'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {section === 'overview' && (
        <div className="space-y-6">
          {/* Student & Case Identity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-5 border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                Student &amp; Case Attribution
              </h2>
              <dl className="divide-y divide-slate-100 text-xs">
                <div className="py-2 flex justify-between gap-4">
                  <dt className="text-slate-500">Student Name</dt>
                  <dd className="font-medium text-slate-900">{CASE_58_META.studentName}</dd>
                </div>
                <div className="py-2 flex justify-between gap-4">
                  <dt className="text-slate-500">Roll Number / USN</dt>
                  <dd className="font-mono text-slate-900">
                    {CASE_58_META.rollNumber} / {CASE_58_META.usn}
                  </dd>
                </div>
                <div className="py-2 flex justify-between gap-4">
                  <dt className="text-slate-500">Class / Section</dt>
                  <dd className="text-slate-900">{CASE_58_META.classSection}</dd>
                </div>
                <div className="py-2 flex justify-between gap-4">
                  <dt className="text-slate-500">University</dt>
                  <dd className="text-right text-slate-900">{CASE_58_META.university}</dd>
                </div>
                <div className="py-2 flex justify-between gap-4">
                  <dt className="text-slate-500">Process &amp; Agile</dt>
                  <dd className="text-right text-slate-900">
                    {CASE_58_META.module1Model} + {CASE_58_META.module2Method}
                  </dd>
                </div>
                <div className="py-2 flex justify-between gap-4">
                  <dt className="text-slate-500">Named Toolchain</dt>
                  <dd className="text-right font-mono text-slate-900">
                    {CASE_58_META.aiTools}; {CASE_58_META.devopsTools}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="lg:col-span-7 border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                Scenario &amp; System Flow
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {CASE_58_META.scenario}
              </p>
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
                {[
                  '1. Synthetic Input',
                  '2. Validation',
                  '3. Progressive Tax',
                  '4. Gross & Deduct',
                  '5. Net Pay Check',
                  '6. Payslip Export',
                ].map((step) => (
                  <div
                    key={step}
                    className="border border-slate-200 bg-slate-50 px-2.5 py-2 font-mono text-slate-800 text-center"
                  >
                    {step}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                Resolves Lab Gap L4.3: the original Python submission had no web interface yet. This interactive React application exposes semantic form controls (<code className="font-mono">#emp-id</code>, <code className="font-mono">#emp-name</code>, <code className="font-mono">#annual-salary</code>, <code className="font-mono">#other-deductions</code>) and downloadable HTML/JSON payslips ready for Selenium browser automation.
              </p>
            </section>
          </div>

          {/* FR-01..10 & NFR-01..05 */}
          <section className="border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Requirements Baseline &amp; Traceability (L1.4: 15 of 15 Retained)
              </h2>
              <span className="text-xs font-mono text-slate-500">
                FR-01–FR-10 &amp; NFR-01–NFR-05
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500 uppercase tracking-wider">
                    <th className="py-2 pr-3 font-medium">ID</th>
                    <th className="py-2 pr-3 font-medium">Requirement Statement</th>
                    <th className="py-2 pr-3 font-medium">Verified By</th>
                    <th className="py-2 font-medium text-right">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {REQUIREMENTS.map((req) => (
                    <tr key={req.id}>
                      <td className="py-2 pr-3 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {req.id}
                      </td>
                      <td className="py-2 pr-3 text-slate-700">{req.statement}</td>
                      <td className="py-2 pr-3 font-mono text-slate-500 whitespace-nowrap">
                        {req.verifiedBy}
                      </td>
                      <td className="py-2 text-right font-mono font-medium text-emerald-700 whitespace-nowrap">
                        {req.verdict}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {section === 'module1' && (
        <div className="space-y-6">
          <section className="border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-4">
              L1.1 SDLC Plan (Waterfall Phases)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500 uppercase tracking-wider">
                    <th className="py-2 pr-3 font-medium">Phase</th>
                    <th className="py-2 pr-3 font-medium">Activities</th>
                    <th className="py-2 pr-3 font-medium">Deliverable</th>
                    <th className="py-2 font-medium">Reviewer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SDLC_PHASES.map((row) => (
                    <tr key={row.phase}>
                      <td className="py-2.5 pr-3 font-semibold text-slate-900">{row.phase}</td>
                      <td className="py-2.5 pr-3 text-slate-700">{row.activities}</td>
                      <td className="py-2.5 pr-3 font-mono text-slate-700">{row.deliverable}</td>
                      <td className="py-2.5 text-slate-600">{row.reviewer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-6 border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                L1.2 Weighted Decision Matrix
              </h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                    <th className="py-2 text-left font-medium">Criterion</th>
                    <th className="py-2 text-right font-medium">Weight</th>
                    <th className="py-2 text-right font-medium">Waterfall</th>
                    <th className="py-2 text-right font-medium">Iterative</th>
                    <th className="py-2 text-right font-medium">Agile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                  {DECISION_MATRIX.map((row) => (
                    <tr key={row.criterion}>
                      <td className="py-2 font-sans text-slate-800">{row.criterion}</td>
                      <td className="py-2 text-right text-slate-600">{row.weight}%</td>
                      <td className="py-2 text-right font-semibold text-slate-900">{row.waterfall}</td>
                      <td className="py-2 text-right text-slate-600">{row.iterative}</td>
                      <td className="py-2 text-right text-slate-600">{row.agile}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-900 bg-slate-50 font-mono tabular-nums font-semibold">
                    <td className="py-2.5 font-sans text-slate-900">Weighted Score (/ 5.00)</td>
                    <td className="py-2.5 text-right">100%</td>
                    <td className="py-2.5 text-right text-emerald-700">{matrixTotals.waterfall.toFixed(2)}</td>
                    <td className="py-2.5 text-right text-slate-700">{matrixTotals.iterative.toFixed(2)}</td>
                    <td className="py-2.5 text-right text-slate-700">{matrixTotals.agile.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
              <p className="mt-3 text-xs text-slate-600">
                Waterfall scores highest (4.30 / 5) because baseline payroll rules are defined up front and audit traceability across 2,500 employees is critical.
              </p>
            </section>

            <section className="lg:col-span-6 border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                L1.3 AI Refactoring &amp; Decision Log
              </h2>
              <pre className="bg-slate-900 text-slate-100 p-3 text-xs font-mono overflow-x-auto mb-4">
{`# Original hand-written draft (flat 10% defect)
def tax(sal):
    return sal * 0.10 if sal > 300000 else 0
# 800000 -> 80000.0 (wrong) vs progressive -> 30000.0`}
              </pre>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500 uppercase tracking-wider">
                    <th className="py-1.5 font-medium">Suggestion</th>
                    <th className="py-1.5 font-medium">Decision</th>
                    <th className="py-1.5 font-medium">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {AI_REFACTOR_LOG.map((item) => (
                    <tr key={item.suggestion}>
                      <td className="py-2 pr-2 text-slate-800">{item.suggestion}</td>
                      <td
                        className={`py-2 pr-2 font-mono font-semibold whitespace-nowrap ${
                          item.decision === 'Accepted'
                            ? 'text-emerald-700'
                            : 'text-red-700'
                        }`}
                      >
                        {item.decision}
                      </td>
                      <td className="py-2 text-slate-600">{item.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </div>
      )}

      {section === 'module2' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-6 border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                L2.1 Agile Working Agreement
              </h2>
              <dl className="divide-y divide-slate-100 text-xs">
                {WORKING_AGREEMENT.map((w) => (
                  <div key={w.item} className="py-2 grid grid-cols-3 gap-2">
                    <dt className="font-semibold text-slate-900">{w.item}</dt>
                    <dd className="col-span-2 text-slate-700">{w.agreement}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="lg:col-span-6 border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                L2.2 Scrum Roles, Events &amp; Artifacts
              </h2>
              <dl className="divide-y divide-slate-100 text-xs">
                {SCRUM_SETUP.map((s) => (
                  <div key={s.item} className="py-2 grid grid-cols-3 gap-2">
                    <dt className="font-semibold text-slate-900">{s.item}</dt>
                    <dd className="col-span-2 text-slate-700">{s.setup}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <section className="border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-4">
              L2.3 Epic Decomposition: &ldquo;Process monthly payroll&rdquo; (US-01 to US-05)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500 uppercase tracking-wider">
                    <th className="py-2 pr-3 font-medium">ID</th>
                    <th className="py-2 pr-3 font-medium">User Story</th>
                    <th className="py-2 font-medium">Acceptance Criteria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {USER_STORIES.map((us) => (
                    <tr key={us.id}>
                      <td className="py-2.5 pr-3 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {us.id}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-800">{us.story}</td>
                      <td className="py-2.5 text-slate-600">{us.acceptance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Burn-down SVG */}
            <section className="lg:col-span-5 border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-3">
                L2.4 Three-Sprint Burn-Down (Assumed Forecast)
              </h2>
              <p className="text-xs text-slate-600 mb-3">
                Assumed velocities: 18, 20, and 22 pts (avg 20 pts/sprint). 60-point backlog completes in 3 sprints.
              </p>
              <svg
                viewBox="0 0 320 170"
                className="w-full h-44 border border-slate-200 bg-slate-50"
                role="img"
                aria-label="3-sprint 60-point burndown forecast"
              >
                <line x1="40" y1="20" x2="40" y2="140" stroke="#94a3b8" />
                <line x1="40" y1="140" x2="300" y2="140" stroke="#94a3b8" />
                {/* Ideal dashed */}
                <line
                  x1="40"
                  y1="20"
                  x2="290"
                  y2="140"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />
                {/* Forecast */}
                <polyline
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="2.5"
                  points={BURNDOWN_SPRINTS.map((b) => {
                    const x = 40 + (b.sprint / 3) * 250;
                    const y = 140 - (b.pointsLeft / 60) * 120;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                {BURNDOWN_SPRINTS.map((b) => {
                  const x = 40 + (b.sprint / 3) * 250;
                  const y = 140 - (b.pointsLeft / 60) * 120;
                  return (
                    <g key={b.sprint}>
                      <circle cx={x} cy={y} r="3.5" fill="#0f172a" />
                      <text
                        x={x}
                        y="156"
                        fontSize="9"
                        fill="#64748b"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        S{b.sprint}
                      </text>
                    </g>
                  );
                })}
                <text x="34" y="24" fontSize="9" fill="#64748b" fontFamily="monospace" textAnchor="end">
                  60
                </text>
                <text x="34" y="64" fontSize="9" fill="#64748b" fontFamily="monospace" textAnchor="end">
                  40
                </text>
                <text x="34" y="104" fontSize="9" fill="#64748b" fontFamily="monospace" textAnchor="end">
                  20
                </text>
                <text x="34" y="142" fontSize="9" fill="#64748b" fontFamily="monospace" textAnchor="end">
                  0
                </text>
              </svg>
            </section>

            {/* Duplicate Ticket Analyzer */}
            <section className="lg:col-span-7 border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  L2.5 Duplicate Ticket Similarity Review (10 Synthetic Tickets)
                </h2>
                <span className="text-xs font-mono text-slate-700">
                  Precision: 100% (2/2) | Recall: 67% (2/3)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500 uppercase tracking-wider">
                      <th className="py-1.5 pr-2 font-medium">#</th>
                      <th className="py-1.5 pr-2 font-medium">Synthetic Ticket</th>
                      <th className="py-1.5 pr-2 font-medium text-center">True Dup</th>
                      <th className="py-1.5 font-medium">Similarity Match</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {DUPLICATE_TICKETS.map((row) => (
                      <tr key={row.no}>
                        <td className="py-1.5 pr-2 font-mono text-slate-500">{row.no}</td>
                        <td className="py-1.5 pr-2 text-slate-800">{row.ticket}</td>
                        <td className="py-1.5 pr-2 font-mono text-center text-slate-700">
                          {row.trueDuplicateOf}
                        </td>
                        <td
                          className={`py-1.5 font-mono ${
                            row.flaggedPair?.startsWith('Missed')
                              ? 'text-amber-700'
                              : row.flaggedPair
                                ? 'text-emerald-700'
                                : 'text-slate-400'
                          }`}
                        >
                          {row.flaggedPair ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      )}

      {section === 'module3' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-5 border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4">
                <GitBranch className="w-4 h-4 text-slate-700" />
                <h2 className="text-sm font-semibold text-slate-900">
                  L3.3 Git Commit History (Feature Branch Workflow)
                </h2>
              </div>
              <div className="space-y-3">
                {GIT_COMMITS.map((c) => (
                  <div
                    key={c.hash}
                    className="border border-slate-200 bg-slate-50 p-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        {c.message}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        branch: {c.branch}
                      </div>
                    </div>
                    <code className="text-xs font-mono text-slate-700 bg-white border border-slate-200 px-2 py-0.5">
                      {c.hash}
                    </code>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Note: A local repository feature branch (`feature/tax-slabs`) was committed and merged (`b66221b`). Remote branch protection is not claimed unless explicitly configured on GitHub.
              </p>
            </section>

            <section className="lg:col-span-7 border border-slate-200 bg-white p-6 space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-3">
                  L3.4 Jenkins Pipeline (`payroll-python/Jenkinsfile`)
                </h2>
                <pre className="bg-slate-900 text-slate-100 p-3.5 text-xs font-mono overflow-x-auto">
                  {JENKINSFILE_SNIPPET}
                </pre>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-3">
                  L3.5 Dockerfile (`payroll-python/Dockerfile`)
                </h2>
                <pre className="bg-slate-900 text-slate-100 p-3.5 text-xs font-mono overflow-x-auto">
                  {DOCKERFILE_SNIPPET}
                </pre>
              </div>
            </section>
          </div>
        </div>
      )}

      {section === 'quality' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-6 border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                L5.2 Static Analysis &amp; L5.3 Code Review Checklist
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs border border-slate-200 bg-slate-50 p-3 font-mono">
                <div>
                  <div className="text-slate-500">Flake8 Before</div>
                  <div className="text-base font-semibold text-red-700">17 issues</div>
                </div>
                <div>
                  <div className="text-slate-500">Flake8 After</div>
                  <div className="text-base font-semibold text-emerald-700">0 issues</div>
                </div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500 uppercase tracking-wider">
                    <th className="py-1.5 font-medium">AI Suggestion</th>
                    <th className="py-1.5 font-medium">Verification</th>
                    <th className="py-1.5 font-medium text-right">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CODE_REVIEW_CHECKLIST.map((row) => (
                    <tr key={row.suggestion}>
                      <td className="py-2 pr-2 text-slate-800">{row.suggestion}</td>
                      <td className="py-2 pr-2 font-mono text-slate-600">{row.verification}</td>
                      <td
                        className={`py-2 text-right font-mono font-semibold ${
                          row.decision === 'Accept'
                            ? 'text-emerald-700'
                            : 'text-red-700'
                        }`}
                      >
                        {row.decision}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="lg:col-span-6 border border-slate-200 bg-white p-6 space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-3">
                Appendices A &amp; B — AI Usage Log &amp; Disclosure
              </h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500 uppercase tracking-wider">
                    <th className="py-1.5 font-medium">Step</th>
                    <th className="py-1.5 font-medium">Tool</th>
                    <th className="py-1.5 font-medium">Human Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {AI_USAGE_LOG.map((entry) => (
                    <tr key={entry.step}>
                      <td className="py-2 pr-2 font-semibold text-slate-900">{entry.step}</td>
                      <td className="py-2 pr-2 font-mono text-slate-700">{entry.tool}</td>
                      <td className="py-2 text-slate-600">{entry.verified}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900">AI Disclosure Statement: </span>
                {AI_DISCLOSURE_STATEMENT}
              </div>
            </section>
          </div>

          {/* Theory Q&A Explorer */}
          <section className="border border-slate-200 bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Part 2 — Theory Questions Reference (T1.1–T5.5)
                </h2>
                <p className="text-xs text-slate-500">
                  Showing {filteredTheory.length} of {THEORY_QA.length} items across Modules 1–5
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="search"
                  value={theoryQuery}
                  onChange={(e) => setTheoryQuery(e.target.value)}
                  placeholder="Filter theory ID or topic..."
                  aria-label="Filter theory questions"
                  className="w-full border border-slate-300 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTheory.map((qa) => (
                <div key={qa.id} className="border border-slate-200 bg-slate-50/50 p-4">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                    <span className="font-semibold text-slate-900">{qa.id}</span>
                    <span>{qa.module}</span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900 mb-1.5">
                    {qa.question}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{qa.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
