# Case 58 — Digital Payroll (Tax Slab Calculation & Payslip Total)

An interactive web workbench and Python reference implementation for **Case 58: Digital Payroll**, built for Software Engineering assignment modules covering Waterfall requirements, Scrum yearly tax-rule maintenance, AI-assisted development, DevOps (Git, Jenkins, Docker), automated testing, and Responsible AI.

> **Synthetic Data & Disclaimer:** All employee identifiers, names, salaries, and tax slabs (`DEFAULT_SLABS`) in this repository are **illustrative synthetic placeholders only**. They do not constitute official tax advice or a statement of current Indian tax law. Never enter real employee salary, bank, tax, or identity data into public AI tools.

---

## Student & Case Attribution

| Field | Details |
| :--- | :--- |
| **Student Name** | Manya B U |
| **Roll Number / USN** | 58 / `ENG24CS0126` |
| **Class / Section** | B, B.Tech CSE |
| **University** | Dayananda Sagar University, School of Engineering |
| **Scenario** | Monthly payroll processing for 2,500 employees with yearly tax-slab updates |
| **Process Models** | Module 1: Waterfall · Module 2: Scrum (yearly rule changes) |
| **Toolchain** | React, TypeScript, Vite, Tailwind CSS, Python, PyTest, Git, Jenkins, Docker, flake8 |

---

## Key Features

### 1. Interactive Web Application (`src/`)
- **Payslip & Progressive Tax Engine (`Payslip Engine`)**: Computes progressive annual tax across configurable slabs, monthly gross (`annual / 12`), monthly tax (`annual_tax / 12`), total deductions, and net monthly pay. Includes Selenium-ready semantic form IDs (`#emp-id`, `#emp-name`, `#annual-salary`, `#other-deductions`) and downloadable HTML/JSON payslips (`FR-10`, resolving Report Gap `L4.3`).
- **Configurable Tax Slabs (`Tax Slabs`)**: Add, edit, or reset progressive brackets (`NFR-03`, `US-04`) with a live SVG annual tax curve preview.
- **Live Verification Workbench (`Verification`)**: Executes all 14 boundary and negative test cases (`TC-01`–`TC-14`) directly in the browser alongside Risk Priority rankings (`L4.4`), the 5-profile Fairness & Privacy check (`L5.5`), 50-run Reliability stress testing (`L5.1`), and response-time latency monitoring (`L4.5`).
- **Engineering Case Study Explorer (`Case Study`)**: Documents `FR-01`–`FR-10`, `NFR-01`–`NFR-05`, Waterfall Decision Matrix (`4.30/5`), Scrum 60-point burn-down & duplicate ticket review, Git/Jenkins/Docker artifacts, flake8 scan metrics (`17 -> 0`), AI Usage Log, Disclosure Statement, and Theory Q&A (`T1.1`–`T5.5`).

### 2. Python Reference Prototype & DevOps (`payroll-python/`)
- Preserves the exact Python module (`payroll-python/src/payroll.py`), 14-case PyTest suite (`TC-01`–`TC-14`), latency monitor (`monitor.py`), `Dockerfile`, and `Jenkinsfile` from the Case 58 report.

---

## Repository Structure

```text
.
├── README.md                        # Project overview, setup, traceability, and GitHub guide
├── package.json                     # Web app dependencies & scripts (Vite, React, TypeScript)
├── index.html                       # Web app entry HTML & metadata
├── metadata.json                    # App metadata
├── vite.config.ts                   # Vite + Tailwind CSS v4 configuration
├── src/
│   ├── App.tsx                      # Main shell & 4-view navigation
│   ├── index.css                    # Global Tailwind theme & typography tokens
│   ├── lib/
│   │   └── payroll.ts               # Core progressive tax, validation, & live test runner
│   ├── data/
│   │   └── case58Data.ts            # Structured Case 58 requirements, Scrum, DevOps, & QA data
│   └── components/
│       ├── PayslipCalculator.tsx    # Interactive calculator, slab breakdown, & HTML/JSON export
│       ├── SlabConfigPanel.tsx      # Editable progressive tax brackets & tax curve SVG
│       ├── VerificationSuite.tsx    # Live TC-01..TC-14 runner, fairness, reliability, & monitor
│       └── EngineeringReportView.tsx# Modules 1–5 engineering documentation & Theory Q&A
└── payroll-python/
    ├── src/
    │   ├── __init__.py
    │   └── payroll.py               # Python reference implementation (annual_tax, payslip)
    ├── tests/
    │   └── test_payroll.py          # 14 PyTest unit, boundary, and negative tests (TC-01..TC-14)
    ├── monitor.py                   # L4.5 10-sample response time monitor (5 ms SLA threshold)
    ├── requirements.txt             # Python test & lint dependencies
    ├── Dockerfile                   # Container image for isolated test execution
    └── Jenkinsfile                  # CI pipeline (Install -> PyTest with coverage)
```

---

## Getting Started

### Run the Web Application
**Prerequisites:** Node.js 18+ and npm

```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

To run type-checking and build for production:
```bash
npm run lint
npm run build
```

### Run the Python Prototype & Tests
```bash
cd payroll-python
pip install -r requirements.txt
python -m pytest -v --cov=src
```

To run the L4.5 response-time monitor:
```bash
cd payroll-python
python monitor.py
```

To build and run via Docker:
```bash
cd payroll-python
docker build -t case58-payroll .
docker run --rm case58-payroll
```

---

## Requirements & Test Traceability Summary

- **Functional Requirements (`FR-01`–`FR-10`)**: Input validation (`FR-02`, `FR-03`), progressive slab calculation (`FR-04`), monthly gross/tax/deductions/net (`FR-05`–`FR-08`), negative net-pay guard (`FR-09`), synthetic payslip output (`FR-10`).
- **Non-Functional Requirements (`NFR-01`–`NFR-05`)**: Repeatability, data confidentiality, configurable yearly slabs, modularity, and clear validation errors.
- **Test Cases (`TC-01`–`TC-14`)**: Boundary values (`299999`, `300000`, `300001`, `699999`, `700000`, `700001`, `2000000`), reference payslip (`E001` `Asha Rao` -> `91,333.33` net pay), blank ID/name rejection, negative salary/deductions rejection, deductions > gross rejection, and `NaN`/`Infinity` rejection.

---

## Pushing to GitHub

1. Create a new empty repository on GitHub (do **not** initialize with a README or `.gitignore`, since both are already included here).
2. From the project root directory, run:

```bash
git init
git add .
git commit -m "Add Case 58 Digital Payroll web workbench, Python prototype, and README"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```
