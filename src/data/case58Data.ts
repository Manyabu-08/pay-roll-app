export const CASE_58_META = {
  caseNumber: 'Case 58',
  title: 'Digital Payroll',
  subtitle: 'Tax slab calculation and payslip total',
  studentName: 'Manya B U',
  rollNumber: '58',
  usn: 'ENG24CS0126',
  classSection: 'B, B.Tech CSE',
  university: 'Dayananda Sagar University, School of Engineering',
  scenario: 'A company pays 2,500 employees monthly. Tax slabs change every year and payslip errors cause employee complaints.',
  module1Model: 'Waterfall',
  module2Method: 'Scrum (for yearly rule changes)',
  aiTools: 'Copilot & ChatGPT',
  devopsTools: 'Git, Jenkins, Docker, PyTest, flake8 / SonarQube',
  prototypeScope: 'Tax slab calculation and payslip total (synthetic demonstration data only)',
};

export interface RequirementItem {
  id: string;
  type: 'FR' | 'NFR';
  statement: string;
  verifiedBy: string;
  verdict: 'Retained';
}

export const REQUIREMENTS: RequirementItem[] = [
  { id: 'FR-01', type: 'FR', statement: 'The system shall accept an employee ID, employee name, annual salary and other deductions.', verifiedBy: 'TC-08', verdict: 'Retained' },
  { id: 'FR-02', type: 'FR', statement: 'The system shall reject missing employee ID or employee name.', verifiedBy: 'TC-09, TC-10', verdict: 'Retained' },
  { id: 'FR-03', type: 'FR', statement: 'The system shall reject negative salary, deductions or taxable income.', verifiedBy: 'TC-11, TC-12, TC-14', verdict: 'Retained' },
  { id: 'FR-04', type: 'FR', statement: 'The system shall calculate annual tax using configurable progressive tax slabs.', verifiedBy: 'TC-01 to TC-07', verdict: 'Retained' },
  { id: 'FR-05', type: 'FR', statement: 'The system shall calculate monthly gross salary from annual salary.', verifiedBy: 'TC-08', verdict: 'Retained' },
  { id: 'FR-06', type: 'FR', statement: 'The system shall calculate monthly income-tax deduction from annual tax.', verifiedBy: 'TC-08', verdict: 'Retained' },
  { id: 'FR-07', type: 'FR', statement: 'The system shall calculate total monthly deductions.', verifiedBy: 'TC-08', verdict: 'Retained' },
  { id: 'FR-08', type: 'FR', statement: 'The system shall calculate net monthly pay.', verifiedBy: 'TC-08', verdict: 'Retained' },
  { id: 'FR-09', type: 'FR', statement: 'The system shall prevent deductions from producing a negative net pay.', verifiedBy: 'TC-13', verdict: 'Retained' },
  { id: 'FR-10', type: 'FR', statement: 'The system shall display a payslip summary using synthetic demonstration data.', verifiedBy: 'Payslip UI & Export (L3.2)', verdict: 'Retained' },
  { id: 'NFR-01', type: 'NFR', statement: 'The calculation shall produce repeatable results for the same inputs and slab configuration.', verifiedBy: 'Repeat runs (L5.1)', verdict: 'Retained' },
  { id: 'NFR-02', type: 'NFR', statement: 'Employee information shall be handled confidentially and access shall be restricted.', verifiedBy: 'Privacy rule & code review (L5.3)', verdict: 'Retained' },
  { id: 'NFR-03', type: 'NFR', statement: 'The tax slab configuration shall be easy to update when approved rules change.', verifiedBy: 'Configurable slab list (SLABS)', verdict: 'Retained' },
  { id: 'NFR-04', type: 'NFR', statement: 'The calculation module shall be modular and maintainable.', verifiedBy: 'payroll.py modular functions', verdict: 'Retained' },
  { id: 'NFR-05', type: 'NFR', statement: 'Invalid input shall produce a clear validation message rather than an incorrect payslip.', verifiedBy: 'TC-09 to TC-14 messages', verdict: 'Retained' },
];

export const SDLC_PHASES = [
  { phase: 'Requirements', activities: 'Read case, list FR/NFR', deliverable: 'Approved requirement list', reviewer: 'Faculty / Product Owner' },
  { phase: 'Design', activities: 'Slab table, payslip layout', deliverable: 'Design note', reviewer: 'Team lead' },
  { phase: 'Implementation', activities: 'Code tax and payslip module', deliverable: 'payroll.py', reviewer: 'Peer reviewer' },
  { phase: 'Testing', activities: 'Boundary and invalid tests', deliverable: 'Test report', reviewer: 'Tester' },
  { phase: 'Deployment', activities: 'Package with Docker', deliverable: 'Dockerfile, release note', reviewer: 'Team lead' },
  { phase: 'Maintenance', activities: 'Update slabs each year', deliverable: 'Updated config, change log', reviewer: 'Product Owner' },
];

export const DECISION_MATRIX = [
  { criterion: 'Requirement stability', weight: 30, waterfall: 5, iterative: 3, agile: 2 },
  { criterion: 'Traceability / audit', weight: 25, waterfall: 5, iterative: 3, agile: 3 },
  { criterion: 'Change frequency', weight: 20, waterfall: 3, iterative: 4, agile: 5 },
  { criterion: 'Review needs', weight: 15, waterfall: 5, iterative: 3, agile: 3 },
  { criterion: 'Early feedback', weight: 10, waterfall: 2, iterative: 4, agile: 5 },
];

export const AI_REFACTOR_LOG = [
  { suggestion: 'Use progressive slabs, not one rate', decision: 'Accepted', reason: 'Matches FR-04; 800000 gives 30000, not 80000' },
  { suggestion: 'Move slabs into a config list', decision: 'Accepted', reason: 'Satisfies NFR-03 yearly configurability' },
  { suggestion: 'Reject negative and NaN inputs', decision: 'Accepted', reason: 'Matches FR-03, caught by TC-14 exploratory defect' },
  { suggestion: 'Hard-code 2026 slab values as official', decision: 'Rejected', reason: 'Slabs are illustrative placeholders until faculty supplies official rules' },
];

export const WORKING_AGREEMENT = [
  { item: 'Communication', agreement: 'Team chat daily; blockers raised the same day' },
  { item: 'Meetings', agreement: 'Daily stand-up 15 min; sprint review and retrospective at sprint end' },
  { item: 'Task ownership', agreement: 'Each story has one named owner' },
  { item: 'Review', agreement: 'Every pull request needs one peer review and passing tests' },
  { item: 'Definition of done', agreement: 'Tested, reviewed, documented, accepted by Product Owner' },
  { item: 'Conflict', agreement: 'Discuss first; Scrum Master decides if unresolved' },
];

export const SCRUM_SETUP = [
  { item: 'Product Owner', setup: 'Student 1 (owns backlog and priorities)' },
  { item: 'Scrum Master', setup: 'Student 2 (runs events, removes blockers)' },
  { item: 'Developers', setup: 'Students 3 and 4' },
  { item: 'Events', setup: 'Sprint planning, daily scrum, review, retrospective (2-week sprint)' },
  { item: 'Product Backlog', setup: 'US-01 to US-05 plus yearly slab-update items' },
  { item: 'Sprint Backlog', setup: 'US-01, US-02, US-03 for sprint 1' },
  { item: 'Increment', setup: 'Working tax and payslip module with passing tests' },
];

export const USER_STORIES = [
  {
    id: 'US-01',
    story: "As a payroll officer, I want to enter an employee's details so that a payslip can be made.",
    acceptance: 'ID, name, salary accepted; blanks rejected',
  },
  {
    id: 'US-02',
    story: 'As a payroll officer, I want tax calculated by slab so that deductions are correct.',
    acceptance: 'Boundary values match the slab table',
  },
  {
    id: 'US-03',
    story: 'As an employee, I want to see monthly gross, tax and net so that I can check my pay.',
    acceptance: 'Payslip shows all three',
  },
  {
    id: 'US-04',
    story: 'As an administrator, I want to update slabs each year so that rules stay current.',
    acceptance: 'Only the slab list changes',
  },
  {
    id: 'US-05',
    story: 'As a payroll officer, I want invalid input blocked so that wrong payslips are not issued.',
    acceptance: 'Negative, NaN and over-deduction rejected',
  },
];

export const BURNDOWN_SPRINTS = [
  { sprint: 0, plannedPoints: 0, pointsLeft: 60 },
  { sprint: 1, plannedPoints: 20, pointsLeft: 40 },
  { sprint: 2, plannedPoints: 20, pointsLeft: 20 },
  { sprint: 3, plannedPoints: 20, pointsLeft: 0 },
];

export const DUPLICATE_TICKETS = [
  { no: 1, ticket: 'Payslip shows wrong tax for salary above 10 lakh', trueDuplicateOf: '2', flaggedPair: '(1, 2)' },
  { no: 2, ticket: 'Wrong tax amount shown on payslip for salary over 10 lakh', trueDuplicateOf: '1', flaggedPair: '(1, 2)' },
  { no: 3, ticket: 'Add employee name validation on payroll form', trueDuplicateOf: '-', flaggedPair: null },
  { no: 4, ticket: 'Net pay becomes negative when deductions are high', trueDuplicateOf: '5', flaggedPair: '(4, 5)' },
  { no: 5, ticket: 'Negative net pay when deductions exceed salary', trueDuplicateOf: '4', flaggedPair: '(4, 5)' },
  { no: 6, ticket: 'Update tax slabs for next financial year', trueDuplicateOf: '-', flaggedPair: null },
  { no: 7, ticket: 'Payslip PDF download button not working', trueDuplicateOf: '9', flaggedPair: 'Missed (wording differs)' },
  { no: 8, ticket: 'Add audit log for salary changes', trueDuplicateOf: '-', flaggedPair: null },
  { no: 9, ticket: 'Download payslip PDF fails', trueDuplicateOf: '7', flaggedPair: 'Missed (wording differs)' },
  { no: 10, ticket: 'Mask employee ID in logs', trueDuplicateOf: '-', flaggedPair: null },
];

export const GIT_COMMITS = [
  { hash: 'b66221b', message: 'Merge feature/tax-slabs', branch: 'main' },
  { hash: 'ac4f3dc', message: 'Document slab configuration', branch: 'feature/tax-slabs' },
  { hash: 'f4792d0', message: 'Add payroll module', branch: 'main' },
];

export const MONITORING_SAMPLES = [
  { sample: 1, time: '00:24:50', responseMs: 0.0343, status: 'OK' },
  { sample: 2, time: '00:24:51', responseMs: 0.0614, status: 'OK' },
  { sample: 3, time: '00:24:52', responseMs: 0.0544, status: 'OK' },
  { sample: 4, time: '00:24:53', responseMs: 0.0571, status: 'OK' },
  { sample: 5, time: '00:24:54', responseMs: 0.0488, status: 'OK' },
  { sample: 6, time: '00:24:55', responseMs: 0.0589, status: 'OK' },
  { sample: 7, time: '00:24:56', responseMs: 0.0591, status: 'OK' },
  { sample: 8, time: '00:24:57', responseMs: 0.0719, status: 'OK' },
  { sample: 9, time: '00:24:58', responseMs: 0.0705, status: 'OK' },
  { sample: 10, time: '00:24:59', responseMs: 0.0608, status: 'OK' },
];

export const CODE_REVIEW_CHECKLIST = [
  { suggestion: 'Reject non-finite numbers', verification: 'TC-14 and exploratory run', decision: 'Accept' },
  { suggestion: 'Reject deductions above gross', verification: 'TC-13', decision: 'Accept' },
  { suggestion: 'Hard-code slabs as official law', verification: 'No approved rule supplied', decision: 'Reject' },
  { suggestion: 'Print salary details in error logs', verification: 'Privacy rule NFR-02', decision: 'Reject' },
];

export const AI_USAGE_LOG = [
  { step: 'Requirements', tool: 'ChatGPT', prompt: 'Draft requirements from case text', verified: 'Compared each item with case brief', decision: 'Edit and approve only supported items' },
  { step: 'Code assistance', tool: 'Copilot / manual', prompt: 'Suggest tax calculation or validation', verified: 'Review code and run tests', decision: 'Record accepted/rejected suggestions' },
  { step: 'Testing', tool: 'ChatGPT / manual', prompt: 'Suggest boundary and negative tests', verified: 'Execute against approved rules', decision: 'Keep verified test cases' },
];

export const AI_DISCLOSURE_STATEMENT =
  'AI tools were used as assistance for drafting, explanation and/or code suggestions. All AI-generated requirements, explanations and code must be reviewed by the student. The student is responsible for verifying correctness against the assignment brief and approved tax rules. Synthetic demonstration data is used. No real employee personal or payroll data should be entered into public AI tools.';

export const THEORY_QA = [
  { id: 'T1.1', module: 'Module 1', question: 'What is software engineering?', answer: 'Software engineering is the systematic application of engineering principles to the development, testing, deployment and maintenance of software. It aims to produce reliable, maintainable and cost-effective software.' },
  { id: 'T1.2', module: 'Module 1', question: 'What is SDLC?', answer: 'The Software Development Life Cycle is a structured sequence of activities used to build software. Common phases are requirements, design, implementation, testing, deployment and maintenance.' },
  { id: 'T1.3', module: 'Module 1', question: 'Explain the Waterfall model.', answer: 'Waterfall is a sequential process model in which work moves through defined phases. A phase is generally completed and reviewed before the next phase begins. It suits projects with stable, well-understood requirements.' },
  { id: 'T1.4', module: 'Module 1', question: 'Why is Waterfall assigned to this case?', answer: 'The assignment explicitly specifies Waterfall for Module 1. A documented requirements baseline and formal phase reviews can help control payroll calculations, where incorrect rules may affect many employees.' },
  { id: 'T1.5', module: 'Module 1', question: 'How can AI support requirements engineering?', answer: 'AI can help transform rule text into draft requirements, identify possible ambiguity and suggest test conditions. A human must compare every output with the authoritative rule text and approve it before implementation.' },
  { id: 'T2.1', module: 'Module 2', question: 'What is Agile?', answer: 'Agile is an iterative and incremental approach that emphasizes customer collaboration, working software, responding to change and frequent feedback.' },
  { id: 'T2.2', module: 'Module 2', question: 'State the four Agile values.', answer: 'Individuals and interactions over processes and tools; working software over comprehensive documentation; customer collaboration over contract negotiation; responding to change over following a plan.' },
  { id: 'T2.3', module: 'Module 2', question: 'What is Scrum?', answer: 'Scrum is an Agile framework in which a team works in time-boxed sprints to deliver increments of value, inspect progress and adapt its plan.' },
  { id: 'T2.4', module: 'Module 2', question: 'Explain Scrum roles, events and artifacts.', answer: 'Accountabilities include Product Owner, Scrum Master and Developers. Events include Sprint, Sprint Planning, Daily Scrum, Sprint Review and Sprint Retrospective. Artifacts include Product Backlog, Sprint Backlog and Increment, supported by commitments.' },
  { id: 'T2.5', module: 'Module 2', question: 'How can AI help with yearly tax-rule changes?', answer: 'AI can summarize change documents, draft backlog items, suggest acceptance criteria and provide initial effort estimates. The Product Owner and technical team must verify legal interpretation, priority and estimates.' },
  { id: 'T3.1', module: 'Module 3', question: 'What is AI-assisted programming?', answer: 'It is the use of AI coding assistants to suggest code, explain errors, generate tests or improve documentation. Developers remain responsible for correctness, security and licensing checks.' },
  { id: 'T3.2', module: 'Module 3', question: 'What is prompt engineering?', answer: 'Prompt engineering means writing clear instructions and context for an AI system. A useful prompt states the role, task, input, constraints, expected format and examples when needed.' },
  { id: 'T3.3', module: 'Module 3', question: 'What is Git and why is it used?', answer: 'Git is a distributed version-control system. It records changes, supports branches, allows collaboration and helps teams review or restore earlier versions.' },
  { id: 'T3.4', module: 'Module 3', question: 'What is CI/CD and how can Jenkins help?', answer: 'Continuous Integration frequently builds and tests code changes. Continuous Delivery or Deployment automates preparation or release. Jenkins can trigger pipeline stages such as checkout, build and test after a push.' },
  { id: 'T3.5', module: 'Module 3', question: 'What is Docker?', answer: 'Docker packages an application and its dependencies into a container image. Containers help provide consistent execution environments across development and deployment.' },
  { id: 'T4.1', module: 'Module 4', question: 'Differentiate verification and validation.', answer: 'Verification asks whether the product is being built according to its specifications. Validation asks whether the resulting product meets user needs.' },
  { id: 'T4.2', module: 'Module 4', question: 'What is unit testing?', answer: 'Unit testing checks a small software component in isolation. For payroll, the tax calculation function should be tested independently with normal and boundary values.' },
  { id: 'T4.3', module: 'Module 4', question: 'What is boundary-value analysis?', answer: 'Boundary-value analysis tests values at and around input limits because defects often occur at boundaries. For a tax slab, test just below, exactly at and just above the limit.' },
  { id: 'T4.4', module: 'Module 4', question: 'What is Selenium used for?', answer: 'Selenium automates browser interactions. It can test whether a user can open a payroll page, enter permitted data and download or view a generated payslip.' },
  { id: 'T4.5', module: 'Module 4', question: 'How can AI support software testing?', answer: 'AI can propose test cases, synthetic test data, edge cases and failure explanations. Generated tests must be reviewed, executed and checked against expected results.' },
  { id: 'T5.1', module: 'Module 5', question: 'What is Software Quality Assurance?', answer: 'SQA consists of planned activities that provide confidence that software processes and products meet defined quality requirements. It includes standards, reviews, audits and process improvement.' },
  { id: 'T5.2', module: 'Module 5', question: 'What is SonarQube?', answer: 'SonarQube is a code-quality analysis platform that detects issues such as bugs, vulnerabilities, code smells and maintainability problems.' },
  { id: 'T5.3', module: 'Module 5', question: 'What is a quality gate?', answer: 'A quality gate is a set of measurable conditions that code must satisfy before it can progress, such as limits on bugs, vulnerabilities or test coverage.' },
  { id: 'T5.4', module: 'Module 5', question: 'What are the risks of AI-generated code?', answer: 'AI-generated code may contain logical errors, insecure patterns, outdated APIs, licensing concerns or hidden assumptions. It should be reviewed, tested and scanned before use.' },
  { id: 'T5.5', module: 'Module 5', question: 'How should payroll data be protected when using AI?', answer: 'Use synthetic data in prompts and demonstrations. Never expose real employee identifiers, salary, bank details or tax records to an unapproved public AI service. Apply access control, data minimization, secure storage and human review.' },
];

export const JENKINSFILE_SNIPPET = `pipeline {
    agent any
    triggers { pollSCM('* * * * *') }
    stages {
        stage('Install') { steps { sh 'pip install pytest pytest-cov' } }
        stage('Test')    { steps { sh 'python -m pytest --cov=src' } }
    }
}`;

export const DOCKERFILE_SNIPPET = `FROM python:3.12-slim
WORKDIR /app
COPY src/ ./src/
COPY tests/ ./tests/
RUN pip install --no-cache-dir pytest
CMD ["python", "-m", "pytest", "-q"]`;
