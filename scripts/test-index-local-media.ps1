$ErrorActionPreference = "Stop"

$outputRoot = Join-Path $env:LOCALAPPDATA "SpeakerMediaIndex-Tdd"
$indexScript = Join-Path $PSScriptRoot "index-local-media.ps1"

& $indexScript -ClipFilter "C0030.MP4" -OutputRoot $outputRoot | Out-Null

$inventoryPath = Join-Path $outputRoot "inventory.json"
$node = (Get-Command node -ErrorAction Stop).Source

& $node -e "JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'));" $inventoryPath
if ($LASTEXITCODE -ne 0) {
    throw "inventory.json is not interoperable UTF-8 JSON"
}

Write-Output "MEDIA_INDEX_JSON_OK"
