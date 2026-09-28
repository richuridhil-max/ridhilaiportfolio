# ==============================================================================
# Ridhil Portfolio - Instant Photo Updater & GitHub Publisher
# ==============================================================================
param(
    [string]$ImagePath = ""
)

$scriptDir = $PSScriptRoot
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }
$targetAsset = Join-Path $scriptDir "assets\ridhil_professional_portrait.png"
$mirrorAsset = "C:\Users\VICTUS\OneDrive\chungam\ridhil-portfolio\assets\ridhil_professional_portrait.png"

# If no path provided, show Windows File Dialog
if (-not $ImagePath -or -not (Test-Path $ImagePath)) {
    Add-Type -AssemblyName System.Windows.Forms
    $dialog = New-Object System.Windows.Forms.OpenFileDialog
    $dialog.Title = "Select Your New Portfolio Portrait (PNG or JPG)"
    $dialog.Filter = "Image Files (*.png;*.jpg;*.jpeg;*.webp)|*.png;*.jpg;*.jpeg;*.webp|All Files (*.*)|*.*"
    $dialog.InitialDirectory = [Environment]::GetFolderPath("MyPictures")
    
    $result = $dialog.ShowDialog()
    if ($result -ne [System.Windows.Forms.DialogResult]::OK) {
        Write-Host "No image selected. Operation cancelled." -ForegroundColor Yellow
        exit
    }
    $ImagePath = $dialog.FileName
}

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Updating Hero Portrait..." -ForegroundColor Yellow
Write-Host " Selected: $ImagePath" -ForegroundColor White
Write-Host "==================================================" -ForegroundColor Cyan

# Copy to assets
Copy-Item -Path $ImagePath -Destination $targetAsset -Force
if (Test-Path (Split-Path $mirrorAsset)) {
    Copy-Item -Path $ImagePath -Destination $mirrorAsset -Force
}

Write-Host "✅ Image file updated in assets folder!" -ForegroundColor Green

# Git commit & Push to GitHub
Set-Location $scriptDir
git add assets/ridhil_professional_portrait.png
git commit -m "Update portfolio hero portrait"
Write-Host "🚀 Pushing update to GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host " 🎉 SUCCESS! PHOTO UPDATED & PUBLISHED!" -ForegroundColor Green
Write-Host " Local Website: http://localhost:3001/" -ForegroundColor White
Write-Host " GitHub: https://github.com/richuridhil-max/ridhilaiportfolio" -ForegroundColor White
Write-Host "==================================================" -ForegroundColor Green
Write-Host "Press any key to close..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
