"""L4.5 Monitoring script for Case 58 Digital Payroll prototype."""

from datetime import datetime
import time
from src.payroll import payslip

LIMIT_MS = 5.0


def run_monitor(samples=10, interval_seconds=1.0):
    print(f"sample  time      response_ms  status (limit {LIMIT_MS} ms)")
    for idx in range(1, samples + 1):
        start = time.perf_counter()
        payslip("E001", "Asha Rao", 1200000, 2000)
        elapsed_ms = (time.perf_counter() - start) * 1000.0
        status = "OK" if elapsed_ms <= LIMIT_MS else "ALERT"
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"{idx:<6d}  {timestamp}  {elapsed_ms:>10.4f}  {status}")
        if idx < samples:
            time.sleep(interval_seconds)


if __name__ == "__main__":
    run_monitor()
