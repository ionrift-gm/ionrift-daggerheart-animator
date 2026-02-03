# release_debug.ps1
# Manually triggers the Foundry VTT Package Release API

# 1. Load Token
$envPath = "..\..\ionrift-brand\.env"
if (-not (Test-Path $envPath)) {
    Write-Error "Token file not found at $envPath"
    exit 1
}

$tokenLine = Get-Content $envPath | Select-String "FOUNDRY_PACKAGE_RELEASE_TOKEN"
if (-not $tokenLine) {
    Write-Error "Token not found in .env"
    exit 1
}
$token = $tokenLine.ToString().Split('=')[1].Trim()

# 2. Load Manifest
$manifest = Get-Content "module.json" -Raw | ConvertFrom-Json

# 3. Construct Payload
$payload = @{
    id = $manifest.id
    release = @{
        version = $manifest.version
        manifest = "https://github.com/ionrift-gm/ionrift-daggerheart-animator/releases/latest/download/module.json"
        notes = "https://github.com/ionrift-gm/ionrift-daggerheart-animator/releases/tag/v$($manifest.version)"
        compatibility = $manifest.compatibility
    }
}

$jsonPayload = $payload | ConvertTo-Json -Depth 10

Write-Host "Payload:"
Write-Host $jsonPayload

# 4. Send Request
try {
    $response = Invoke-RestMethod -Uri "https://foundryvtt.com/_api/packages/release_version/" `
        -Method Post `
        -Headers @{
            "Authorization" = $token
            "Content-Type" = "application/json"
        } `
        -Body $jsonPayload

    Write-Host "SUCCESS! Response:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 5)
}
catch {
    Write-Error "API Request Failed"
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host $reader.ReadToEnd() -ForegroundColor Red
    }
}
