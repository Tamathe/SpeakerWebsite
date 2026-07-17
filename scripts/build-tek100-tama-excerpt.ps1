$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$source = "C:\AA Code\Incubator website\AI-INcubator-source-6e4e7e5\AI-INcubator\Media\Module 4 lecture.mp4"
$videoOutput = Join-Path $repoRoot "public\media\speaking\tek100-tama-excerpt.mp4"
$posterOutput = Join-Path $repoRoot "public\media\speaking\tek100-tama-poster.jpg"

if (-not (Test-Path -LiteralPath $source)) {
  throw "TEK 100 source recording is missing: $source"
}

# Module 4: Tama explains the two places humans can intervene in AI hallucinations.
$sourceStart = 670.600
$duration = 71.340

& ffmpeg -hide_banner -y `
  -ss $sourceStart -i $source -t $duration `
  -vf "scale=1280:720:flags=lanczos,fps=30,format=yuv420p" `
  -af "loudnorm=I=-16:LRA=11:TP=-1.5,aresample=48000" `
  -c:v libx264 -preset medium -crf 18 `
  -c:a aac -b:a 192k -movflags +faststart $videoOutput

if ($LASTEXITCODE -ne 0) {
  throw "TEK 100 excerpt build failed with exit code $LASTEXITCODE"
}

& ffmpeg -hide_banner -loglevel error -y `
  -ss 20.000 -i $videoOutput -frames:v 1 -q:v 2 $posterOutput

if ($LASTEXITCODE -ne 0) {
  throw "TEK 100 poster build failed with exit code $LASTEXITCODE"
}

Write-Host "Built:"
Write-Host "  $videoOutput"
Write-Host "  $posterOutput"
