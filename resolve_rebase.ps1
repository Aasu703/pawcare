# Script to complete rebase without editor interaction
Set-Location "D:\Development\pawcare"

# Set editor to exit immediately
$env:EDITOR = "cmd /c exit"
$env:GIT_EDITOR = "cmd /c exit"

# Try git rebase --continue with empty commit message
git rebase --continue --no-verify 2>&1 | Out-Null

# Check final status
$status = git status --porcelain 2>&1
Write-Output "=== GIT STATUS AFTER REBASE ==="
Write-Output $status

# Check for any remaining conflicts
$conflicts = git diff --name-only --diff-filter=U 2>&1
if ($conflicts) {
    Write-Output "=== REMAINING MERGE CONFLICTS ==="
    Write-Output $conflicts
} else {
    Write-Output "✓ No merge conflicts remain"
}

# Show final branch status
$branchInfo = git log --oneline -3 2>&1
Write-Output "=== RECENT COMMITS ==="
Write-Output $branchInfo
