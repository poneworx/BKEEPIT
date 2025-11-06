<#
===============================================================================
BKEEPIT PHASE 3 VALIDATION SCRIPT
Purpose : Verify that Clean-Phase3.ps1 completed correctly.
Outputs : docs/logs/tools/phase3-validation.txt
===============================================================================
#>

$ErrorActionPreference = "Stop"

$RootPath   = Split-Path -Parent $MyInvocation.MyCommand.Definition
$LogPath    = Join-Path $RootPath "docs\logs\tools\phase3-validation.txt"
New-Item -ItemType Directory -Force -Path (Split-Path $LogPath) | Out-Null

Function LogAction($msg, $color="Gray") {
    $msg | Out-File $LogPath -Append
    Write-Host $msg -ForegroundColor $color
}

"=== BKEEPIT PHASE 3 VALIDATION RUN ===" | Out-File $LogPath
"Timestamp: $(Get-Date)" | Out-File $LogPath -Append
"----------------------------------" | Out-File $LogPath -Append

# ---------- 1. Verify removed files ----------
$DeletedFiles = @(
    "CleanTree.txt",
    "Sync-ToFinal.ps1",
    "cli\stable\_anchor.ps1",
    "cli\quarantine\_anchor.ps1",
    "server\src\services\notificationService.ts",
    "server\src\controllers\metricsController.ts",
    "server\src\routes\metricsRoutes.ts",
    "server\src\middleware\rateLimit.ts",
    "server\src\middleware\cacheControl.ts",
    "server\src\middleware\authGuard.ts",
    "server\src\utils\migrate.ts",
    "server\src\scripts\generate-client.ts",
    "frontend\src\styles\tokens\colors.css",
    "frontend\src\styles\tokens\spacing.css",
    "frontend\src\styles\tokens\typography.css",
    "frontend\src\styles\tokens\radius.css",
    "frontend\src\styles\tokens\shadows.css"
)

$MissingCount = 0
foreach ($f in $DeletedFiles) {
    $fp = Join-Path $RootPath $f
    if (Test-Path $fp) {
        LogAction "⚠️  File still exists: $f" "Yellow"
        $MissingCount++
    } else {
        LogAction "✅ Removed as expected: $f" "Green"
    }
}

# ---------- 2. Verify moved asset ----------
$Asset = "frontend\assets\images\bg-swirl.svg"
if (Test-Path (Join-Path $RootPath $Asset)) {
    LogAction "✅ Asset present: $Asset" "Green"
} else {
    LogAction "❌ Missing expected asset: $Asset" "Red"
}

# ---------- 3. Verify stubbed files ----------
$StubFiles = @(
    "server\src\middleware\requestLogger.ts",
    "server\src\utils\sanitize.ts",
    "server\src\utils\validation.ts"
)
foreach ($s in $StubFiles) {
    $fp = Join-Path $RootPath $s
    if (Test-Path $fp) {
        $content = Get-Content $fp -Raw
        if ($content -match "// TODO:") {
            LogAction "✅ Stub verified: $s" "Green"
        } else {
            LogAction "⚠️  Stub missing TODO comment: $s" "Yellow"
        }
    } else {
        LogAction "❌ Stub file missing: $s" "Red"
    }
}

# ---------- 4. Check key folders ----------
$ExpectedDirs = @(
    "docs\logs\tools",
    "docs\logs\tests",
    "docs\logs\env",
    "quarantine\temp\deleted",
    "quarantine\temp\moved",
    "frontend\assets\images",
    "server\src\models",
    "server\src\controllers",
    "server\src\services"
)
foreach ($d in $ExpectedDirs) {
    $dp = Join-Path $RootPath $d
    if (Test-Path $dp) {
        LogAction "✅ Folder exists: $d" "Green"
    } else {
        LogAction "❌ Missing folder: $d" "Red"
    }
}

"----------------------------------" | Out-File $LogPath -Append

if ($MissingCount -eq 0) {
    LogAction "Validation passed - Phase 3 environment clean and ready." "Cyan"
}
else {
    LogAction "Validation found $MissingCount undeleted file(s). Review log." "Yellow"
}

LogAction ("Log written to: " + $LogPath) "Gray"

