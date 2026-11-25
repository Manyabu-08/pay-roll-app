"""Case 58 unit, boundary, and negative test suite (TC-01 to TC-14)."""

import math
import pytest
from src.payroll import annual_tax, payslip


def test_tc01_below_slab1():
    assert annual_tax(299999) == 0.0


def test_tc02_at_slab1():
    assert annual_tax(300000) == 0.0


def test_tc03_above_slab1():
    assert annual_tax(300001) == 0.05


def test_tc04_below_slab2():
    assert annual_tax(699999) == 19999.95


def test_tc05_at_slab2():
    assert annual_tax(700000) == 20000.0


def test_tc06_above_slab2():
    assert annual_tax(700001) == 20000.1


def test_tc07_top_slab():
    assert annual_tax(2000000) == 290000.0


def test_tc08_payslip_net():
    slip = payslip("E001", "Asha Rao", 1200000, 2000)
    assert slip["monthly_gross"] == 100000.0
    assert slip["monthly_tax"] == 6666.67
    assert slip["total_deductions"] == 8666.67
    assert slip["net_pay"] == 91333.33


def test_tc09_missing_id():
    with pytest.raises(ValueError, match="employee ID and name are required"):
        payslip("", "Asha Rao", 1200000, 0)


def test_tc10_missing_name():
    with pytest.raises(ValueError, match="employee ID and name are required"):
        payslip("E001", "   ", 1200000, 0)


def test_tc11_negative_salary():
    with pytest.raises(ValueError, match="annual salary must be a non-negative number"):
        payslip("E001", "Asha Rao", -1, 0)


def test_tc12_negative_deduction():
    with pytest.raises(ValueError, match="deductions must be a non-negative number"):
        payslip("E001", "Asha Rao", 600000, -5)


def test_tc13_negative_net_blocked():
    with pytest.raises(ValueError, match="deductions exceed gross pay"):
        payslip("E001", "Asha Rao", 120000, 15000)


def test_tc14_nan_rejected():
    with pytest.raises(ValueError, match="annual salary must be a non-negative number"):
        payslip("E001", "Asha Rao", math.nan, 0)
