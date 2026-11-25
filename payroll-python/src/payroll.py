"""Case 58 - Digital Payroll prototype (synthetic data only).
Slab values are ILLUSTRATIVE placeholders, not official tax law.
"""

import math

SLABS = [
    (300000, 0.00),
    (700000, 0.05),
    (1000000, 0.10),
    (1200000, 0.15),
    (1500000, 0.20),
    (float("inf"), 0.30),
]


def _num(v, label):
    if (
        isinstance(v, bool)
        or not isinstance(v, (int, float))
        or not math.isfinite(v)
        or v < 0
    ):
        raise ValueError(f"{label} must be a non-negative number")
    return v


def annual_tax(taxable, slabs=SLABS):
    _num(taxable, "taxable income")
    tax = 0.0
    lower = 0
    for upper, rate in slabs:
        if taxable > lower:
            tax += (min(taxable, upper) - lower) * rate
        lower = upper
    return round(tax, 2)


def payslip(emp_id, name, annual_salary, other_deductions=0, slabs=SLABS):
    if not str(emp_id).strip() or not str(name).strip():
        raise ValueError("employee ID and name are required")
    _num(annual_salary, "annual salary")
    _num(other_deductions, "deductions")
    gross = round(annual_salary / 12, 2)
    tax = round(annual_tax(annual_salary, slabs) / 12, 2)
    total = round(tax + other_deductions, 2)
    if total > gross:
        raise ValueError("deductions exceed gross pay")
    return {
        "emp_id": str(emp_id).strip(),
        "name": str(name).strip(),
        "monthly_gross": gross,
        "monthly_tax": tax,
        "other_deductions": other_deductions,
        "total_deductions": total,
        "net_pay": round(gross - total, 2),
    }
