<#
===============================================================================
BKEEPIT PHASE 3 CLEANUP SCRIPT
Purpose: Safely remove old artifacts and placeholders, move assets,
         and stub deferred files for Phase 3 clean build.
Logs all actions to: docs/logs/tools/phase3-cleanup.txt
===============================================================================
#>

$ErrorActionPreference = "Stop"

# --- Paths ---
$RootPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$LogPath = Join-Path $RootPath "docs\logs\tools\phase3-cleanup.txt"
$DeletedDir = Join-Path $RootPath "quarantine\temp\deleted"
$MovedDir = Join-Path $RootPath "quarantine\temp\moved"

# --- Ensure folders exist ---
New-Item -ItemType Directory -Force -Path $DeletedDir | Out-Null
New-Item -ItemType Directory -Force -Path $MovedDir | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path $LogPath) | Out-Null

# --- Initialize log ---
"=== BKEEPIT PHASE 3 CLEANUP RUN ===" | Out-File $LogPath
"Timestamp: $(Get-Date)" | Out-File $LogPath -Append
"----------------------------------" | Out-File $LogPath -Append

Function LogAction($msg) {
    $msg | Out-File $LogPath -Append
    Write-Host $msg -ForegroundColor Cyan
}

Function SafeDelete($file) {
    if (Test-Path $file) {
        $target = Join-Path $DeletedDir (Split-Path $file -Leaf)
        Move-Item -Force $file $target
        LogAction "Deleted: $(Split-Path $file -Leaf)"
    }
}

Function StubFile($file, $message) {
    if (Test-Path $file) {
        Set-Content -Path $file -Value "// TODO: $message"
        LogAction "Stubbed: $(Split-Path $file -Leaf)"
    }
}

Function SafeMove($src, $dst) {
    if (Test-Path $src) {
        $folder = Split-Path $dst -Parent
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
        Move-Item -Force $src $dst
        LogAction "Moved: $(Split-Path $src -Leaf) → $dst"
    }
}

# --- 1. Delete build artifacts ---
SafeDelete "$RootPath\CleanTree.txt"
SafeDelete "$RootPath\Sync-ToFinal.ps1"

# --- 2. Delete CLI anchors ---
SafeDelete "$RootPath\cli\stable\_anchor.ps1"
SafeDelete "$RootPath\cli\quarantine\_anchor.ps1"

# --- 3. Delete backend placeholders (Phase 4–5) ---
$backendFiles = @(
    "server\src\services\notificationService.ts",
    "server\src\controllers\metricsController.ts",
    "server\src\routes\metricsRoutes.ts",
    "server\src\middleware\rateLimit.ts",
    "server\src\middleware\cacheControl.ts",
    "server\src\middleware\authGuard.ts",
    "server\src\utils\migrate.ts",
    "server\src\scripts\generate-client.ts"
)
foreach ($f in $backendFiles) { SafeDelete "$RootPath\$f" }

# --- 4. Delete frontend web-only CSS tokens ---
$cssTokens = @(
    "colors.css", "spacing.css", "typography.css", "radius.css", "shadows.css"
)
foreach ($c in $cssTokens) {
    SafeDelete "$RootPath\frontend\src\styles\tokens\$c"
}

# --- 5. Move bg-swirl.svg asset ---
SafeMove "$RootPath\frontend\public\images\bg-swirl.svg" `
         "$RootPath\frontend\assets\images\bg-swirl.svg"

# --- 6. Stub deferred files ---
StubFile "$RootPath\server\src\middleware\requestLogger.ts" `
         "implement custom request logging later."
StubFile "$RootPath\server\src\utils\sanitize.ts" `
         "sanitize inputs before database insertion."
StubFile "$RootPath\server\src\utils\validation.ts" `
         "add schema validation using zod or envalid."

"----------------------------------" | Out-File $LogPath -Append
"Cleanup Complete. All logs centralized under /docs/logs/tools/phase3-cleanup.txt" | Out-File $LogPath -Append
LogAction "✅ Cleanup complete. See $LogPath for details."
