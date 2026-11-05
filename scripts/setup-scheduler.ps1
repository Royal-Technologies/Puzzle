# ============================================================
# Bright Path Puzzle — Windows Task Scheduler Setup
# Royal Technologies
# ============================================================
# Run ONCE as Administrator to register 3 daily triggers:
#   ► সকাল ৬:০০ AM
#   ► দুপুর ১২:২০ PM
#   ► বিকাল ৬:০০ PM
# ============================================================

param(
    [string]$GitHubPAT = ""
)

# ── Require Admin ──
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "❌ Administrator হিসেবে চালাতে হবে!" -ForegroundColor Red
    Write-Host "   PowerShell -এ Right-click → 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

$SCRIPT_DIR  = Split-Path -Parent $MyInvocation.MyCommand.Path
$TRIGGER_PS1 = Join-Path $SCRIPT_DIR "trigger-puzzle.ps1"
$PAT_FILE    = Join-Path $SCRIPT_DIR ".pat"
$TASK_BASE   = "BrightPath_Puzzle"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Bright Path Puzzle — Scheduler Setup       ║" -ForegroundColor Cyan
Write-Host "║   Royal Technologies                         ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── Save GitHub PAT ──
if (-not $GitHubPAT) {
    Write-Host "🔑 GitHub Personal Access Token (PAT) লিখুন:" -ForegroundColor Yellow
    Write-Host "   (github.com → Settings → Developer settings → Fine-grained tokens)" -ForegroundColor Gray
    Write-Host "   Permissions দরকার: Contents: Read & Write, Actions: Write" -ForegroundColor Gray
    Write-Host ""
    $secPAT = Read-Host "PAT" -AsSecureString
    $GitHubPAT = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secPAT)
    )
}

if (-not $GitHubPAT -or $GitHubPAT.Length -lt 10) {
    Write-Host "❌ Valid PAT দেওয়া হয়নি। Setup বাতিল।" -ForegroundColor Red
    exit 1
}

# Save PAT to hidden file (restricted permissions)
Set-Content -Path $PAT_FILE -Value $GitHubPAT -Encoding UTF8 -Force
$acl = Get-Acl $PAT_FILE
$acl.SetAccessRuleProtection($true, $false)
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    [System.Security.Principal.WindowsIdentity]::GetCurrent().Name,
    "FullControl", "Allow"
)
$acl.SetAccessRule($rule)
Set-Acl $PAT_FILE $acl
Write-Host "✓ PAT সংরক্ষিত হয়েছে (restricted access)" -ForegroundColor Green

# ── Verify PAT with GitHub API ──
Write-Host ""
Write-Host "🔍 GitHub PAT যাচাই করা হচ্ছে..." -ForegroundColor Cyan
try {
    $verifyHeaders = @{
        "Authorization"        = "token $GitHubPAT"
        "Accept"               = "application/vnd.github+json"
        "X-GitHub-Api-Version" = "2022-11-28"
        "User-Agent"           = "BrightPath-Scheduler/1.0"
    }
    $repoInfo = Invoke-RestMethod -Uri "https://api.github.com/repos/Royal-Technologies/Puzzle" -Headers $verifyHeaders
    Write-Host "✓ PAT Valid! Repository: $($repoInfo.full_name)" -ForegroundColor Green
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    if ($code -eq 401) {
        Write-Host "❌ PAT ভুল বা মেয়াদ শেষ। নতুন PAT তৈরি করুন।" -ForegroundColor Red
    } elseif ($code -eq 404) {
        Write-Host "⚠ Repository access নেই। PAT এ repo permission চেক করুন।" -ForegroundColor Yellow
    } else {
        Write-Host "⚠ যাচাই করা গেল না (HTTP $code), তবে setup চালিয়ে যাচ্ছি..." -ForegroundColor Yellow
    }
}

# ── PowerShell executable path ──
$psExe = (Get-Command pwsh -ErrorAction SilentlyContinue)?.Source
if (-not $psExe) {
    $psExe = (Get-Command powershell -ErrorAction SilentlyContinue)?.Source
}
$taskAction = New-ScheduledTaskAction `
    -Execute $psExe `
    -Argument "-NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$TRIGGER_PS1`""

# ── Task Settings ──
$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 5) `
    -MultipleInstances IgnoreNew

$principal = New-ScheduledTaskPrincipal `
    -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) `
    -LogonType S4U `
    -RunLevel Highest

# ── Define 3 Daily Triggers ──
$triggers = @(
    @{ Name = "Morning";  Time = "06:00" },
    @{ Name = "Noon";     Time = "12:20" },
    @{ Name = "Evening";  Time = "18:00" }
)

Write-Host ""
Write-Host "📅 Task Scheduler এ ৩টি trigger যোগ করা হচ্ছে..." -ForegroundColor Cyan
Write-Host ""

foreach ($t in $triggers) {
    $taskName = "${TASK_BASE}_$($t.Name)"

    # Remove existing if present
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

    $trigger = New-ScheduledTaskTrigger -Daily -At $t.Time

    $task = New-ScheduledTask `
        -Action    $taskAction `
        -Trigger   $trigger `
        -Settings  $settings `
        -Principal $principal `
        -Description "Bright Path Daily Puzzle — $($t.Name) trigger ($($t.Time) Dhaka)"

    Register-ScheduledTask -TaskName $taskName -InputObject $task -Force | Out-Null

    Write-Host "  ✓ $taskName  → প্রতিদিন $($t.Time) এ চলবে" -ForegroundColor Green
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   Setup সম্পন্ন! ✅                          ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║  সকাল   ৬:০০ → GitHub workflow trigger       ║" -ForegroundColor Green
Write-Host "║  দুপুর ১২:২০ → GitHub workflow trigger       ║" -ForegroundColor Green
Write-Host "║  বিকাল  ৬:০০ → GitHub workflow trigger       ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║  Log: scripts\trigger.log                    ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Task Manager > Task Scheduler Library তে দেখো:" -ForegroundColor Yellow
Write-Host "   BrightPath_Puzzle_Morning" -ForegroundColor White
Write-Host "   BrightPath_Puzzle_Noon" -ForegroundColor White
Write-Host "   BrightPath_Puzzle_Evening" -ForegroundColor White
Write-Host ""

# ── Test run (optional) ──
$testNow = Read-Host "এখনই একটি test trigger চালাবে? (y/N)"
if ($testNow -eq 'y' -or $testNow -eq 'Y') {
    Write-Host ""
    Write-Host "🚀 Test trigger চালানো হচ্ছে..." -ForegroundColor Cyan
    & $psExe -NonInteractive -ExecutionPolicy Bypass -File $TRIGGER_PS1
}
