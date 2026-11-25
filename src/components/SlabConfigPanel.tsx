import React, { useMemo, useState } from 'react';
import { AlertCircle, Plus, RotateCcw, Trash2 } from 'lucide-react';
import {
  DEFAULT_SLABS,
  TaxSlab,
  annualTax,
  formatCurrency,
  validateSlabs,
} from '../lib/payroll';

interface SlabConfigPanelProps {
  slabs: TaxSlab[];
  onChangeSlabs: (nextSlabs: TaxSlab[]) => void;
}

export const SlabConfigPanel: React.FC<SlabConfigPanelProps> = ({
  slabs,
  onChangeSlabs,
}) => {
  const [draftError, setDraftError] = useState<string | null>(null);

  const commitSlabs = (candidate: TaxSlab[]) => {
    try {
      validateSlabs(candidate);
      setDraftError(null);
      onChangeSlabs(candidate);
    } catch (err) {
      setDraftError(
        err instanceof Error ? err.message : 'Invalid slab configuration'
      );
      onChangeSlabs(candidate);
    }
  };

  const handleUpperChange = (index: number, raw: string) => {
    const num = Number(raw);
    const updated = slabs.map((s, idx) =>
      idx === index ? { ...s, upper: Number.isFinite(num) ? num : 0 } : s
    );
    commitSlabs(updated);
  };

  const handleRateChange = (index: number, rawPercent: string) => {
    const pct = Number(rawPercent);
    const updated = slabs.map((s, idx) =>
      idx === index
        ? { ...s, rate: Number.isFinite(pct) ? pct / 100 : 0 }
        : s
    );
    commitSlabs(updated);
  };

  const handleAddBracket = () => {
    const bounded = slabs.slice(0, -1);
    const lastOpen = slabs[slabs.length - 1];
    const prevUpper = bounded.length > 0 ? bounded[bounded.length - 1].upper ?? 0 : 0;
    const nextUpper = prevUpper + 300000;
    const prevRate = bounded.length > 0 ? bounded[bounded.length - 1].rate : 0;
    const nextRate = Math.min(0.25, Number((prevRate + 0.05).toFixed(2)));

    const next = [
      ...bounded,
      { id: `slab-${Date.now()}`, upper: nextUpper, rate: nextRate },
      lastOpen,
    ];
    commitSlabs(next);
  };

  const handleRemoveBracket = (index: number) => {
    if (slabs.length <= 2 || slabs[index].upper === null) return;
    const next = slabs.filter((_, idx) => idx !== index);
    commitSlabs(next);
  };

  const handleReset = () => {
    setDraftError(null);
    onChangeSlabs(DEFAULT_SLABS);
  };

  const curveData = useMemo(() => {
    const salaries = [
      0, 300000, 500000, 700000, 1000000, 1200000, 1500000, 2000000, 2500000,
    ];
    try {
      validateSlabs(slabs);
      return salaries.map((sal) => {
        const tax = annualTax(sal, slabs);
        const effRate = sal > 0 ? (tax / sal) * 100 : 0;
        return { salary: sal, tax, effRate };
      });
    } catch {
      return [];
    }
  }, [slabs]);

  const maxTax = useMemo(() => {
    if (!curveData.length) return 1;
    return Math.max(...curveData.map((d) => d.tax), 1);
  }, [curveData]);

  return (
    <div className="space-y-6">
      <div className="border border-slate-200 bg-white p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Configurable Progressive Tax Slabs (NFR-03 &amp; US-04)
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Supports Scrum yearly tax-rule updates by modifying only the slab table without touching calculation code.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-500 cursor-pointer shrink-0 whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Case 58 Defaults
        </button>
      </div>

      {/* Explicit Illustrative Placeholder Disclosure */}
      <div className="border border-amber-300 bg-amber-50 px-5 py-3.5 text-xs text-amber-950 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Illustrative Placeholder Rules:</span>{' '}
          Default slab values are illustrative placeholders from Case 58 and are not official tax advice or a statement of current Indian tax law. Replace them with approved financial-year rules before production use.
        </div>
      </div>

      {draftError && (
        <div
          role="alert"
          className="border border-red-300 bg-red-50 px-5 py-3 text-xs font-mono text-red-900"
        >
          Configuration error: {draftError} — upper limits must strictly increase and rates must stay within 0%–100%.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editable Slab Table */}
        <section className="lg:col-span-7 border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Active Slab Schedule ({slabs.length} brackets)
            </h2>
            <button
              type="button"
              onClick={handleAddBracket}
              className="inline-flex items-center gap-1 border border-slate-900 bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Bracket
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500 uppercase tracking-wider">
                  <th className="py-2 font-medium">Tier</th>
                  <th className="py-2 font-medium">Lower Bound</th>
                  <th className="py-2 font-medium">Upper Limit</th>
                  <th className="py-2 font-medium text-right">Tax Rate (%)</th>
                  <th className="py-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {slabs.map((slab, index) => {
                  const prevUpper =
                    index === 0 ? 0 : slabs[index - 1].upper ?? 0;
                  const isOpenEnded = slab.upper === null;

                  return (
                    <tr key={slab.id}>
                      <td className="py-2.5 font-mono text-slate-500">
                        S{index + 1}
                      </td>
                      <td className="py-2.5 font-mono tabular-nums text-slate-700">
                        {prevUpper.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5">
                        {isOpenEnded ? (
                          <span className="font-mono text-slate-500">
                            Infinity (Above {prevUpper.toLocaleString('en-IN')})
                          </span>
                        ) : (
                          <input
                            type="number"
                            min={prevUpper + 1}
                            step={50000}
                            value={slab.upper ?? 0}
                            onChange={(e) =>
                              handleUpperChange(index, e.target.value)
                            }
                            aria-label={`Upper limit for slab ${index + 1}`}
                            className="w-32 border border-slate-300 px-2 py-1 font-mono tabular-nums text-slate-900 focus:border-slate-900 focus:outline-none"
                          />
                        )}
                      </td>
                      <td className="py-2.5 text-right">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          value={Math.round(slab.rate * 10000) / 100}
                          onChange={(e) =>
                            handleRateChange(index, e.target.value)
                          }
                          aria-label={`Rate percent for slab ${index + 1}`}
                          className="w-20 border border-slate-300 px-2 py-1 text-right font-mono tabular-nums text-slate-900 focus:border-slate-900 focus:outline-none"
                        />
                      </td>
                      <td className="py-2.5 text-right">
                        {!isOpenEnded && slabs.length > 2 ? (
                          <button
                            type="button"
                            onClick={() => handleRemoveBracket(index)}
                            title="Remove slab"
                            className="inline-flex items-center p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-slate-300 font-mono">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Annual Tax Curve SVG Preview */}
        <section className="lg:col-span-5 border border-slate-200 bg-white p-6">
          <div className="border-b border-slate-200 pb-3 mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Annual Tax Curve Preview
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live progressive tax &amp; effective rate across sample salaries
            </p>
          </div>

          {curveData.length > 0 ? (
            <>
              <div className="w-full overflow-hidden">
                <svg
                  viewBox="0 0 360 190"
                  className="w-full h-48 border border-slate-100 bg-slate-50"
                  role="img"
                  aria-label="Annual tax curve across salary levels"
                >
                  {/* Grid lines */}
                  {[0.25, 0.5, 0.75].map((frac) => {
                    const y = 160 - frac * 130;
                    return (
                      <line
                        key={frac}
                        x1="44"
                        y1={y}
                        x2="344"
                        y2={y}
                        stroke="#e2e8f0"
                        strokeDasharray="3 3"
                      />
                    );
                  })}
                  <line x1="44" y1="20" x2="44" y2="160" stroke="#94a3b8" />
                  <line x1="44" y1="160" x2="344" y2="160" stroke="#94a3b8" />

                  <polyline
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="2"
                    points={curveData
                      .map((pt, idx) => {
                        const x = 44 + (idx / (curveData.length - 1)) * 296;
                        const y = 160 - (pt.tax / maxTax) * 130;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {curveData.map((pt, idx) => {
                    const x = 44 + (idx / (curveData.length - 1)) * 296;
                    const y = 160 - (pt.tax / maxTax) * 130;
                    return (
                      <circle
                        key={pt.salary}
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#0f172a"
                      />
                    );
                  })}

                  <text x="44" y="176" fontSize="9" fill="#64748b" fontFamily="monospace">
                    0
                  </text>
                  <text x="180" y="176" fontSize="9" fill="#64748b" fontFamily="monospace" textAnchor="middle">
                    12L
                  </text>
                  <text x="340" y="176" fontSize="9" fill="#64748b" fontFamily="monospace" textAnchor="end">
                    25L
                  </text>
                  <text x="38" y="28" fontSize="9" fill="#64748b" fontFamily="monospace" textAnchor="end">
                    {Math.round(maxTax / 1000)}k
                  </text>
                  <text x="38" y="162" fontSize="9" fill="#64748b" fontFamily="monospace" textAnchor="end">
                    0
                  </text>
                </svg>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-1.5 text-left font-medium">Annual Salary</th>
                      <th className="py-1.5 text-right font-medium">Annual Tax</th>
                      <th className="py-1.5 text-right font-medium">Effective Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {curveData
                      .filter((d) => [300000, 700000, 1200000, 2000000].includes(d.salary))
                      .map((row) => (
                        <tr key={row.salary}>
                          <td className="py-1.5 font-mono tabular-nums text-slate-700">
                            {formatCurrency(row.salary)}
                          </td>
                          <td className="py-1.5 text-right font-mono tabular-nums text-slate-900">
                            {formatCurrency(row.tax)}
                          </td>
                          <td className="py-1.5 text-right font-mono tabular-nums text-slate-600">
                            {row.effRate.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-500 py-8 text-center">
              Fix the slab validation error to preview the tax curve.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
