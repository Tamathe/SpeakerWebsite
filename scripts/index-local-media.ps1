param(
    [string]$SourceRoot = "E:\Video\PRIVATE\M4ROOT\CLIP",
    [string]$OutputRoot = "$env:LOCALAPPDATA\SpeakerMediaIndex",
    [string]$FfmpegPath = "$env:LOCALAPPDATA\Temp\speaker-media-tools\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe",
    [string]$ClipFilter = "*.MP4",
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$culture = [System.Globalization.CultureInfo]::InvariantCulture

if (-not (Test-Path -LiteralPath $SourceRoot)) {
    throw "Source folder not found: $SourceRoot"
}

if (-not (Test-Path -LiteralPath $FfmpegPath)) {
    throw "ffmpeg not found: $FfmpegPath"
}

$audioRoot = Join-Path $OutputRoot "audio"
$frameRoot = Join-Path $OutputRoot "frames"
$sheetRoot = Join-Path $OutputRoot "contact-sheets"
$transcriptRoot = Join-Path $OutputRoot "transcripts"

@($OutputRoot, $audioRoot, $frameRoot, $sheetRoot, $transcriptRoot) | ForEach-Object {
    New-Item -ItemType Directory -Force -Path $_ | Out-Null
}

$clips = @()

Get-ChildItem -LiteralPath $SourceRoot -Filter $ClipFilter -File | Sort-Object Name | ForEach-Object {
    $source = $_
    $clipId = $source.BaseName
    $metadataPath = Join-Path $SourceRoot ($clipId + "M01.XML")

    if (-not (Test-Path -LiteralPath $metadataPath)) {
        Write-Warning "Skipping $clipId because its Sony metadata XML is missing."
        return
    }

    [xml]$metadata = Get-Content -Raw -LiteralPath $metadataPath
    $namespace = New-Object System.Xml.XmlNamespaceManager($metadata.NameTable)
    $namespace.AddNamespace("m", "urn:schemas-professionalDisc:nonRealTimeMeta:ver.2.20")

    $durationNode = $metadata.SelectSingleNode("//m:Duration", $namespace)
    $frameNode = $metadata.SelectSingleNode("//m:VideoFrame", $namespace)
    $layoutNode = $metadata.SelectSingleNode("//m:VideoLayout", $namespace)
    $dateNode = $metadata.SelectSingleNode("//m:CreationDate", $namespace)
    $deviceNode = $metadata.SelectSingleNode("//m:Device", $namespace)
    $audioNode = $metadata.SelectSingleNode("//m:AudioFormat", $namespace)

    $fps = [double]($frameNode.captureFps -replace "p$", "")
    $durationSeconds = [double]$durationNode.value / $fps
    $created = [datetimeoffset]::Parse($dateNode.value, $culture)
    $audioPath = Join-Path $audioRoot ($clipId + ".mp3")
    $sheetPath = Join-Path $sheetRoot ($clipId + ".jpg")
    $clipFrameRoot = Join-Path $frameRoot $clipId

    $clips += [pscustomobject][ordered]@{
        id = $clipId
        sourcePath = $source.FullName
        metadataPath = $metadataPath
        sourceBytes = $source.Length
        sourceSizeGB = [math]::Round($source.Length / 1GB, 3)
        created = $created.ToString("o")
        sessionDate = $created.ToString("yyyy-MM-dd")
        durationSeconds = [math]::Round($durationSeconds, 3)
        duration = [timespan]::FromSeconds($durationSeconds).ToString("hh\:mm\:ss\.fff")
        camera = $deviceNode.modelName
        codec = $frameNode.videoCodec
        resolution = $layoutNode.pixel + "x" + $layoutNode.numOfVerticalLine
        fps = $frameNode.captureFps
        audioChannels = [int]$audioNode.numOfChannel
        audioProxyPath = $audioPath
        contactSheetPath = $sheetPath
        transcriptPath = Join-Path $transcriptRoot ($clipId + ".json")
    }

    Write-Output ("MEDIA {0} | {1} | {2}" -f $clipId, [timespan]::FromSeconds($durationSeconds).ToString("hh\:mm\:ss"), $created.ToString("yyyy-MM-dd HH:mm:ss zzz"))

    if ($durationSeconds -ge 3 -and ($Force -or -not (Test-Path -LiteralPath $audioPath))) {
        Write-Output "AUDIO $clipId"
        & $FfmpegPath -hide_banner -loglevel error -y -i $source.FullName -vn -ac 1 -ar 16000 -c:a libmp3lame -b:a 48k $audioPath
        if ($LASTEXITCODE -ne 0) {
            throw "Audio extraction failed for $clipId"
        }
    }

    if ($durationSeconds -lt 1) {
        $frameCount = 1
    } elseif ($durationSeconds -lt 5) {
        $frameCount = 3
    } elseif ($durationSeconds -lt 30) {
        $frameCount = 4
    } elseif ($durationSeconds -lt 300) {
        $frameCount = 8
    } else {
        $frameCount = 12
    }

    if ($Force -or -not (Test-Path -LiteralPath $sheetPath)) {
        Write-Output "FRAMES $clipId ($frameCount)"
        New-Item -ItemType Directory -Force -Path $clipFrameRoot | Out-Null

        1..$frameCount | ForEach-Object {
            $frameNumber = $_
            $timestamp = $durationSeconds * $frameNumber / ($frameCount + 1)
            $timestampText = $timestamp.ToString("0.###", $culture)
            $framePath = Join-Path $clipFrameRoot ("frame-{0:D2}.jpg" -f $frameNumber)

            & $FfmpegPath -hide_banner -loglevel error -y -ss $timestampText -i $source.FullName -frames:v 1 -vf "scale=320:-2" -q:v 4 $framePath
            if ($LASTEXITCODE -ne 0) {
                throw "Frame extraction failed for $clipId at $timestampText seconds"
            }
        }

        $columns = [math]::Min(4, $frameCount)
        $rows = [math]::Ceiling($frameCount / $columns)
        $framePattern = Join-Path $clipFrameRoot "frame-%02d.jpg"
        $tileFilter = "tile=${columns}x${rows}:padding=4:margin=4:color=0x111111"

        & $FfmpegPath -hide_banner -loglevel error -y -framerate 1 -start_number 1 -i $framePattern -vf $tileFilter -frames:v 1 -q:v 3 $sheetPath
        if ($LASTEXITCODE -ne 0) {
            throw "Contact sheet creation failed for $clipId"
        }
    }
}

$inventory = [pscustomobject][ordered]@{
    generatedAt = [datetimeoffset]::Now.ToString("o")
    sourceRoot = $SourceRoot
    outputRoot = $OutputRoot
    clipCount = $clips.Count
    totalSourceBytes = ($clips | Measure-Object -Property sourceBytes -Sum).Sum
    totalDurationSeconds = [math]::Round(($clips | Measure-Object -Property durationSeconds -Sum).Sum, 3)
    clips = $clips
}

$inventoryPath = Join-Path $OutputRoot "inventory.json"
$inventoryJson = $inventory | ConvertTo-Json -Depth 6
$utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($inventoryPath, $inventoryJson, $utf8WithoutBom)
Write-Output "INDEX $inventoryPath"
