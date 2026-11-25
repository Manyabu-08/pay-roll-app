import { useState } from 'react';
import { Play } from 'lucide-react';
import { DEFAULT_SLABS, TaxSlab } from './lib/payroll';
import { PayslipCalculator } from './components/PayslipCalculator';
import { SlabConfigPanel } from './components/SlabConfigPanel';
import { VerificationSuite } from './components/VerificationSuite';
import { EngineeringReportView } from './components/EngineeringReportView';
import { CASE_58_META } from './data/case58Data';

type AppTab = 'calculator' | 'slabs' | 'verification' | 'report';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('calculator');
  const [slabs, setSlabs] = useState<TaxSlab[]>(DEFAULT_SLABS);

  const navItems: Array<{ id: AppTab; label: string }> = [
    { id: 'calculator', label: 'Payslip Engine' },
    { id: 'slabs', label: 'Tax Slabs' },
    { id: 'verification', label: 'Verification' },
    { id: 'report', label: 'Case Study' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Three-Zone Top Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 shrink-0">
            <span className="text-sm font-bold tracking-tight text-slate-900 whitespace-nowrap">
              Digital Payroll
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-slate-500 border-l border-slate-200 pl-3 whitespace-nowrap">
              Case 58
            </span>
          </div>

          <nav
            aria-label="Primary sections"
            className="flex items-center gap-1 sm:gap-2 overflow-x-auto"
          >
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer border-b-2 transition-colors ${
                    active
                      ? 'border-slate-900 text-slate-900 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className="hidden sm:inline-flex items-center gap-1.5 border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            Run 14 Tests
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'calculator' && <PayslipCalculator slabs={slabs} />}
        {activeTab === 'slabs' && (
          <SlabConfigPanel slabs={slabs} onChangeSlabs={setSlabs} />
        )}
        {activeTab === 'verification' && <VerificationSuite slabs={slabs} />}
        {activeTab === 'report' && <EngineeringReportView />}
      </main>

      {/* Clean Attribution & Disclaimer Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
          <div>
            {CASE_58_META.studentName} · Roll {CASE_58_META.rollNumber} · USN{' '}
            <span className="font-mono">{CASE_58_META.usn}</span> ·{' '}
            {CASE_58_META.university}
          </div>
          <div>
            Synthetic demonstration data only. Placeholder tax slabs are not official tax advice.
          </div>
        </div>
      </footer>
    </div>
  );
}
