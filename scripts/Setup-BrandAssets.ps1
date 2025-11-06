Param(
    [switch]$DryRun
)

# Setup-BrandAssets.ps1
# Purpose: Prepare brand assets for bkeepit. Safe to run multiple times.
# Notes: ASCII only, UTF-8, no emojis.

$ErrorActionPreference = "Stop"

# Resolve repo root from scripts folder
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = (Resolve-Path (Join-Path $ScriptDir "..")).Path
$Frontend = Join-Path $RepoRoot "frontend"
$AssetsDir = Join-Path $Frontend "assets\images"
$BrandingDir = Join-Path $Frontend "src\components\branding"
$IconsOutDir = Join-Path $Frontend "src\assets\icons"
$LogPath = Join-Path $RepoRoot "docs\logs\tools\phase3-brandsetup.txt"

# Source SVGs expected in repo root based on your note
$SvgSourceDir = Join-Path $Frontend "public\logos"
$SvgFiles = @("bkeepit-primary.svg", "poneworx-partner.svg")

# Obsolete items to delete
$Obsolete = @(
    (Join-Path $Frontend "public"),
    (Join-Path $Frontend "src\styles\tokens"),
    (Join-Path $Frontend "src\styles\globals.css")
)

function Log($Message) {
    $ts = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
    $line = "$ts - $Message"
    Write-Host $line
    $logDir = Split-Path $LogPath -Parent
    if (!(Test-Path $logDir)) {
        if (-not $DryRun) { New-Item -ItemType Directory -Force -Path $logDir | Out-Null }
    }
    Add-Content -Path $LogPath -Value $line
}

function Confirm-Directory($Path) {
    if (!(Test-Path $Path)) {
        if ($DryRun) { Log "Would create directory: $Path" }
        else {
            New-Item -ItemType Directory -Force -Path $Path | Out-Null
            Log "Created directory: $Path"
        }
    }
}

function Move-IfExists($Src, $Dest) {
    if (Test-Path $Src) {
        Confirm-Directory (Split-Path $Dest -Parent)
        if ($DryRun) { Log "Would move: $Src -> $Dest" }
        else { Move-Item -Force -Path $Src -Destination $Dest; Log "Moved: $Src -> $Dest" }
    } else {
        Log "Warning: source not found: $Src"
    }
}

function Remove-Obsolete($Path) {
    if (Test-Path $Path) {
        if ($DryRun) { Log "Would delete obsolete: $Path" }
        else { Remove-Item -Recurse -Force $Path; Log "Deleted obsolete: $Path" }
    }
}

function Write-FileUtf8($Path, $Content) {
    Confirm-Directory (Split-Path $Path -Parent)
    if ($DryRun) { Log "Would write: $Path" }
    else {
        $Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText($Path, $Content, $Utf8NoBom)
        Log "Wrote: $Path"
    }
}

Log "Starting Brand Asset Setup (DryRun=$DryRun)"

# Ensure target dirs
Confirm-Directory $AssetsDir
Confirm-Directory $BrandingDir
Confirm-Directory $IconsOutDir

# Move the SVGs from repo root to frontend assets
foreach ($svg in $SvgFiles) {
    $src = Join-Path $SvgSourceDir $svg
    $dest = Join-Path $AssetsDir $svg
    Move-IfExists -Src $src -Dest $dest
}

# Remove obsolete folders and files
foreach ($item in $Obsolete) { Remove-Obsolete $item }

# Create placeholder PNGs for icon and splash (1x1 transparent)
$IconPath = Join-Path $AssetsDir "app-icon.png"
$SplashPath = Join-Path $AssetsDir "splash-bg.png"
if ($DryRun) {
    Log "Would create placeholder icon: $IconPath"
    Log "Would create placeholder splash: $SplashPath"
} else {
    [byte[]]$png = [Convert]::FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=")
    [IO.File]::WriteAllBytes($IconPath, $png)
    [IO.File]::WriteAllBytes($SplashPath, $png)
    Log "Created placeholder PNGs: $IconPath, $SplashPath"
}

# Write BrandKit component
$BrandKitPath = Join-Path $BrandingDir "BrandKit.tsx"
$BrandKitContent = @"
import React from 'react';
import { View, Text } from 'react-native';
import Theme from '../../styles/globals';
import BkeepitPrimary from '../../assets/icons/BkeepitPrimary';
import PoneworxPartner from '../../assets/icons/PoneworxPartner';

export default function BrandKit() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <BkeepitPrimary width={160} height={50} />
      <Text style={[Theme.TextPresets.p, { color: Theme.Colors.poneMid, marginTop: 8 }]}>
        Powered by
      </Text>
      <PoneworxPartner width={120} height={30} />
    </View>
  );
}
"@
Write-FileUtf8 -Path $BrandKitPath -Content $BrandKitContent

# Attempt SVGR conversion if not DryRun
# Requires: dev dep @svgr/cli and react-native-svg in frontend
$SvgrCmd = "npx @svgr/cli --native --out-dir src/assets/icons assets/images/*.svg"
if ($DryRun) {
    Log "Would run SVGR: cd `"$Frontend`" && $SvgrCmd"
} else {
    try {
        Push-Location $Frontend
        Log "Running SVGR conversion..."
        $proc = Start-Process -FilePath "npx" -ArgumentList "@svgr/cli","--native","--out-dir","src/assets/icons","assets/images/*.svg" -NoNewWindow -PassThru -Wait
        if ($proc.ExitCode -eq 0) { Log "SVGR conversion complete." }
        else { Log "Warning: SVGR exited with code $($proc.ExitCode)." }
    } catch {
        Log "Warning: SVGR conversion step failed. You can run manually: $SvgrCmd"
    } finally {
        Pop-Location
    }
}

Log "Brand Asset Setup complete."
