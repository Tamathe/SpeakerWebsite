param(
  [string]$OutputPath,
  [string]$PosterPath
)

$ErrorActionPreference = "Stop"
$culture = [System.Globalization.CultureInfo]::InvariantCulture
$site = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$incubatorMedia = "C:\AA Code\Incubator website\AI-INcubator-source-6e4e7e5\AI-INcubator\Media"

if (-not $OutputPath) {
  $OutputPath = Join-Path $site "outputs\speaker-compilation\speaker-compilation-loop-v2-review.mp4"
}

if (-not $PosterPath) {
  $PosterPath = Join-Path $site "outputs\speaker-compilation\speaker-compilation-loop-v2-review-poster.jpg"
}

$microsoft = Join-Path $incubatorMedia "Microsoft - Creating an AI Future for Kentucky.mp4"
$module7 = Join-Path $incubatorMedia "Module 7 intro.mp4"
$markey = Join-Path $incubatorMedia "C0029.MP4"
$nice = Join-Path $site "Media\Tama-The_NICE-2026.mp4"
$expo = Join-Path $incubatorMedia "C0040.MP4"
$lrc = Join-Path $site "Media\Kentucky-Legislature-AI-at-UK-2025.mp4"

# This edit deliberately omits the Microsoft logo, mannequin montage, and the
# earlier Markey/chair and both laptop-table shots. The NICE lung-cancer clip
# plays at its natural speed, and an LRC moment replaces the table footage.
# Source starts avoid the brief baked-in transition flashes in the campus,
# balcony, and seated-conversation footage.
$clips = @(
  [pscustomobject]@{ Label = "Markey stage - later/right position"; Start = 2400.00; Duration = 3.00; Source = $markey },
  [pscustomobject]@{ Label = "Campus walk - after transition"; Start = 48.40; Duration = 1.50; Source = $microsoft },
  [pscustomobject]@{ Label = "AI presenter composite"; Start = 8.30; Duration = 1.50; Source = $module7 },
  [pscustomobject]@{ Label = "NICE - OSCE grading cost"; Start = 110.75; Duration = 3.00; Source = $nice },
  [pscustomobject]@{ Label = "Name lower third"; Start = 52.00; Duration = 3.50; Source = $microsoft },
  [pscustomobject]@{ Label = "Atrium balcony walk"; Start = 149.25; Duration = 1.60; Source = $microsoft },
  [pscustomobject]@{ Label = "NICE - AHEAD map"; Start = 422.00; Duration = 3.00; Source = $nice },
  [pscustomobject]@{ Label = "Animated exhibit interaction"; Start = 72.00; Duration = 3.00; Source = $expo },
  [pscustomobject]@{ Label = "Dinosaur vehicle composite"; Start = 33.00; Duration = 1.50; Source = $module7 },
  [pscustomobject]@{ Label = "Table collaboration"; Start = 100.50; Duration = 1.50; Source = $microsoft },
  [pscustomobject]@{ Label = "NICE - lung cancer slide and stage"; Start = 542.29; Duration = 1.59; Source = $nice },
  [pscustomobject]@{ Label = "Kentucky Legislature - AI at UK"; Start = 1405.00; Duration = 3.00; Source = $lrc },
  [pscustomobject]@{ Label = "Beach composite"; Start = 54.20; Duration = 1.50; Source = $module7 },
  [pscustomobject]@{ Label = "NICE - Kentucky Precision Health"; Start = 642.25; Duration = 3.00; Source = $nice },
  [pscustomobject]@{ Label = "Seated conversation - after transition"; Start = 152.90; Duration = 1.50; Source = $microsoft },
  [pscustomobject]@{ Label = "NICE - unified platform"; Start = 784.75; Duration = 3.00; Source = $nice }
)

$missingSources = $clips.Source | Sort-Object -Unique | Where-Object { -not (Test-Path -LiteralPath $_) }
if ($missingSources) {
  throw "Missing source media:`n$($missingSources -join "`n")"
}

$outputDirectory = Split-Path -Parent $OutputPath
$posterDirectory = Split-Path -Parent $PosterPath
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
New-Item -ItemType Directory -Path $posterDirectory -Force | Out-Null

$temporaryVideo = Join-Path $outputDirectory ".speaker-compilation-loop-v2-review.next.mp4"
$temporaryPoster = Join-Path $posterDirectory ".speaker-compilation-loop-v2-review-poster.next.jpg"

$ffmpegArguments = @("-hide_banner", "-loglevel", "error", "-y")
foreach ($clip in $clips) {
  $ffmpegArguments += @(
    "-ss", $clip.Start.ToString("0.###", $culture),
    "-t", $clip.Duration.ToString("0.###", $culture),
    "-i", $clip.Source
  )
}

$filters = @()
$labels = @()
for ($index = 0; $index -lt $clips.Count; $index++) {
  $clip = $clips[$index]
  if ($null -ne $clip.OutputDuration) {
    $stretch = ([double]$clip.OutputDuration / [double]$clip.Duration).ToString("0.########", $culture)
    $timingFilter = "minterpolate=fps=48:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,setpts=$stretch*(PTS-STARTPTS),fps=24"
  }
  else {
    $timingFilter = "fps=24,setpts=PTS-STARTPTS"
  }

  $filters += "[$index`:v]scale=960:540:force_original_aspect_ratio=increase,crop=960:540,$timingFilter,setsar=1[v$index]"
  $labels += "[v$index]"
}

$filterComplex = ($filters -join ";") + ";" + ($labels -join "") + "concat=n=$($clips.Count):v=1:a=0[outv]"
$ffmpegArguments += @(
  "-filter_complex", $filterComplex,
  "-map", "[outv]",
  "-an",
  "-c:v", "libx264",
  "-preset", "slow",
  "-crf", "23",
  "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  $temporaryVideo
)

& ffmpeg @ffmpegArguments
if ($LASTEXITCODE -ne 0) {
  throw "FFmpeg failed while building the revised compilation (exit code $LASTEXITCODE)."
}

Move-Item -LiteralPath $temporaryVideo -Destination $OutputPath -Force

& ffmpeg -hide_banner -loglevel error -y -ss 10.5 -i $OutputPath -frames:v 1 -q:v 2 $temporaryPoster
if ($LASTEXITCODE -ne 0) {
  throw "FFmpeg failed while generating the revised poster (exit code $LASTEXITCODE)."
}

Move-Item -LiteralPath $temporaryPoster -Destination $PosterPath -Force

$timelineStart = 0.0
$timeline = foreach ($clip in $clips) {
  $timelineDuration = if ($null -ne $clip.OutputDuration) { [double]$clip.OutputDuration } else { [double]$clip.Duration }
  $timelineEnd = $timelineStart + $timelineDuration
  $entry = [pscustomobject]@{
    TimelineStart = $timelineStart
    TimelineEnd = $timelineEnd
    Label = $clip.Label
    SourceStart = $clip.Start
    SourceDuration = $clip.Duration
    TimelineDuration = $timelineDuration
    Source = $clip.Source
  }
  $timelineStart = $timelineEnd
  $entry
}

$probe = & ffprobe -v error -show_entries format=duration,size -show_entries stream=index,codec_name,codec_type,width,height,r_frame_rate,pix_fmt -of json -- $OutputPath | ConvertFrom-Json

[pscustomobject]@{
  OutputPath = $OutputPath
  PosterPath = $PosterPath
  Duration = [double]$probe.format.duration
  Size = [long]$probe.format.size
  Timeline = $timeline
} | ConvertTo-Json -Depth 5
