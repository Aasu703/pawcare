#!/usr/bin/env python3
import subprocess
import os

os.chdir("D:\\Development\\pawcare")

# Disable editor environment
os.environ["EDITOR"] = ""
os.environ["GIT_EDITOR"] = ""

print("=== Attempting git rebase --continue ===")
try:
    result = subprocess.run(
        ["git", "rebase", "--continue"],
        capture_output=True,
        text=True,
        timeout=10
    )
    print(f"Exit code: {result.returncode}")
    if result.stdout:
        print("STDOUT:", result.stdout)
    if result.stderr:
        print("STDERR:", result.stderr)
except subprocess.TimeoutExpired:
    print("Rebase timed out")
except Exception as e:
    print(f"Error: {e}")

print("\n=== Git Status ===")
result = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
print(result.stdout)

print("\n=== Checking for merge conflicts ===")
result = subprocess.run(["git", "diff", "--name-only", "--diff-filter=U"], capture_output=True, text=True)
if result.stdout.strip():
    print("Remaining conflicts:")
    print(result.stdout)
else:
    print("✓ No merge conflicts found")
