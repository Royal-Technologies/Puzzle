# ============================================================
# Bright Path Puzzle — GitHub Repository Dispatch Trigger
# Royal Technologies | Runs via Windows Task Scheduler
# ============================================================
# Usage: powershell -ExecutionPolicy Bypass -File trigger-puzzle.ps1
# ============================================================

$GITHUB_OWNER = "Royal-Technologies"
$GITHUB_REPO  = "Puzzle"
$LOG_FILE     = "$PSScriptRoot\trigger.log"

# ── Load PAT from Windows Credential Manager (secure) ──
function Get-GitHubPAT {
    $cred = Get-StoredCredential -Target "BrightPath_GitHub_PAT" -ErrorAction SilentlyContinue
    if ($cred) {
        return [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($cred.Password)
        )
    }
    # Fallback: environment variable
    if ($env:BRIGHT_PATH_GITHUB_PAT) {
        return $env:BRIGHT_PATH_GITHUB_PAT
    }
    return $null
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$timestamp] [$Level] $Message"
    Add-Content -Path $LOG_FILE -Value $line -Encoding UTF8
    Write-Host $line
}

# ── Main ──
Write-Log "=== Puzzle Trigger Started ==="

# Read PAT from Credential Manager or env var
$pat = $null

# Try Windows Credential Manager first
$credEntry = cmdkey /list | Select-String "BrightPath_GitHub_PAT"
if ($credEntry) {
    # Use runas-style credential via .NET
    $cred = [System.Net.CredentialCache]::DefaultNetworkCredentials
}

# Try environment variable
if (-not $pat) {
    $pat = $env:BRIGHT_PATH_GITHUB_PAT
}

# Try reading from secure file
$patFile = "$PSScriptRoot\.pat"
if (-not $pat -and (Test-Path $patFile)) {
    $pat = (Get-Content $patFile -Raw).Trim()
}

if (-not $pat) {
    Write-Log "ERROR: GitHub PAT not found. Run setup-scheduler.ps1 first." "ERROR"
    exit 1
}

# ── Call GitHub repository_dispatch API ──
$apiUrl = "https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/dispatches"
$body   = @{ event_type = "generate-puzzle" } | ConvertTo-Json

$headers = @{
    "Authorization"        = "token $pat"
    "Accept"               = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
    "User-Agent"           = "BrightPath-Scheduler/1.0"
}

try {
    $response = Invoke-RestMethod `
        -Uri     $apiUrl `
        -Method  POST `
        -Headers $headers `
        -Body    $body `
        -ContentType "application/json"

    Write-Log "SUCCESS: repository_dispatch sent → generate-puzzle"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Log "FAILED: HTTP $statusCode — $($_.Exception.Message)" "ERROR"

    if ($statusCode -eq 401) {
        Write-Log "→ PAT মেয়াদ শেষ বা ভুল। setup-scheduler.ps1 দিয়ে নতুন PAT সেট করুন।" "ERROR"
    } elseif ($statusCode -eq 404) {
        Write-Log "→ Repository পাওয়া যায়নি। GITHUB_OWNER/REPO চেক করুন।" "ERROR"
    }
    exit 1
}

Write-Log "=== Trigger Complete ==="
