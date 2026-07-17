$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
$source = Join-Path $repoRoot "public\media\speaking\nbme-nice-2026-healthcare-ai-excerpt.mp4"
$kentucky = Join-Path $repoRoot "public\images\brand\kentucky-boundary-exact.png"
$captions = Join-Path $PSScriptRoot "shared-infrastructure-linkedin.srt"
$burnedCaptions = Join-Path $PSScriptRoot "shared-infrastructure-linkedin.ass"
$headlineLine1 = Join-Path $PSScriptRoot "headline-line-1.txt"
$headlineLine2 = Join-Path $PSScriptRoot "headline-line-2.txt"
$cleanOutput = Join-Path $PSScriptRoot "shared-infrastructure-linkedin-clean.mp4"
$captionedOutput = Join-Path $PSScriptRoot "shared-infrastructure-linkedin-captioned.mp4"
$thumbnailOutput = Join-Path $PSScriptRoot "shared-infrastructure-linkedin-thumbnail.jpg"

foreach ($path in @($source, $kentucky, $captions, $burnedCaptions, $headlineLine1, $headlineLine2)) {
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Required input is missing: $path"
  }
}

$captionFilterPath = $burnedCaptions.Replace("\", "/").Replace(":", "\:")
$headlineLine1FilterPath = $headlineLine1.Replace("\", "/").Replace(":", "\:")
$headlineLine2FilterPath = $headlineLine2.Replace("\", "/").Replace(":", "\:")
$fontRegular = "C\:/Windows/Fonts/segoeui.ttf"
$fontBold = "C\:/Windows/Fonts/segoeuib.ttf"

$introDuration = 3.500
$contentDuration = 29.620
$contentEnd = 33.120
$outroDuration = 4.500
$totalDuration = 37.620

$filter = @"
[0:v]split=4[video_a][video_b][video_c][video_d];
[video_a]trim=start=34.060:end=38.380,setpts=PTS-STARTPTS,scale=1000:562:flags=lanczos,fps=30,format=yuv420p[first_video];
[video_b]trim=start=39.620:end=44.580,setpts=PTS-STARTPTS,scale=1000:562:flags=lanczos,fps=30,format=yuv420p[second_video];
[video_c]trim=start=55.320:end=63.800,setpts=PTS-STARTPTS,scale=1000:562:flags=lanczos,fps=30,format=yuv420p[third_video];
[video_d]trim=start=64.680:end=76.540,setpts=PTS-STARTPTS,scale=1000:562:flags=lanczos,fps=30,format=yuv420p[fourth_video];
[first_video][second_video][third_video][fourth_video]concat=n=4:v=1:a=0[content_video];
[0:a]asplit=4[audio_a][audio_b][audio_c][audio_d];
[audio_a]atrim=start=34.060:end=38.380,asetpts=PTS-STARTPTS[first_audio];
[audio_b]atrim=start=39.620:end=44.580,asetpts=PTS-STARTPTS[second_audio];
[audio_c]atrim=start=55.320:end=63.800,asetpts=PTS-STARTPTS[third_audio];
[audio_d]atrim=start=64.680:end=76.540,asetpts=PTS-STARTPTS[fourth_audio];
[first_audio][second_audio][third_audio][fourth_audio]concat=n=4:v=0:a=1,loudnorm=I=-16:LRA=11:TP=-1.5,aresample=48000,aformat=channel_layouts=stereo[content_audio];
[1:v]scale=300:-1:flags=lanczos,format=rgba,colorchannelmixer=aa=0.20,split=3[kentucky_intro][kentucky_main][kentucky_outro];
color=c=0x030303:s=1080x1350:d=${introDuration}:r=30,format=yuv420p,drawgrid=w=72:h=72:t=1:c=white@0.025,
drawbox=x=32:y=30:w=1016:h=1:color=white@0.14:t=fill,
drawbox=x=32:y=1318:w=1016:h=1:color=white@0.14:t=fill,
drawbox=x=48:y=56:w=12:h=12:color=0x1769e0:t=fill,
drawtext=fontfile='$fontRegular':text='NBME NICE  /  JUNE 2026':fontcolor=0x82b3ff:fontsize=25:x=78:y=48,
drawtext=fontfile='$fontBold':textfile='$headlineLine1FilterPath':fontcolor=white:fontsize=62:x=48:y=184,
drawtext=fontfile='$fontBold':textfile='$headlineLine2FilterPath':fontcolor=white:fontsize=62:x=48:y=260,
drawtext=fontfile='$fontRegular':text='A PITCH FOR SHARED HEALTH INFRASTRUCTURE':fontcolor=white@0.68:fontsize=25:x=48:y=390,
drawbox=x=48:y=494:w=5:h=326:color=0x1769e0:t=fill,
drawtext=fontfile='$fontRegular':text='NBME INVITATIONAL CONFERENCE':fontcolor=white@0.68:fontsize=27:x=82:y=574,
drawtext=fontfile='$fontBold':text='FOR EDUCATORS':fontcolor=white:fontsize=48:x=82:y=630,
drawtext=fontfile='$fontRegular':text='RECORDED JUNE 2026':fontcolor=white@0.42:fontsize=22:x=82:y=706,
drawtext=fontfile='$fontRegular':text='SOURCE\: NBME NICE':fontcolor=white@0.42:fontsize=20:x=48:y=1232[intro_canvas];
[intro_canvas][kentucky_intro]overlay=x=746:y=53:shortest=1[intro_video];
color=c=0x030303:s=1080x1350:d=${contentDuration}:r=30,format=yuv420p,drawgrid=w=72:h=72:t=1:c=white@0.025,
drawbox=x=32:y=30:w=1016:h=1:color=white@0.14:t=fill,
drawbox=x=32:y=1318:w=1016:h=1:color=white@0.14:t=fill,
drawbox=x=48:y=56:w=12:h=12:color=0x1769e0:t=fill,
drawtext=fontfile='$fontRegular':text='NBME NICE  /  JUNE 2026':fontcolor=0x82b3ff:fontsize=25:x=78:y=48,
drawtext=fontfile='$fontBold':textfile='$headlineLine1FilterPath':fontcolor=white:fontsize=50:x=48:y=100,
drawtext=fontfile='$fontBold':textfile='$headlineLine2FilterPath':fontcolor=white:fontsize=50:x=48:y=158,
drawbox=x=48:y=872:w=4:h=276:color=0x1769e0:t=fill,
drawtext=fontfile='$fontRegular':text='RECORDED JUNE 2026':fontcolor=white@0.68:fontsize=23:x=48:y=1194,
drawtext=fontfile='$fontRegular':text='SOURCE\: NBME INVITATIONAL CONFERENCE FOR EDUCATORS':fontcolor=white@0.42:fontsize=20:x=48:y=1232[main_canvas];
[main_canvas][kentucky_main]overlay=x=746:y=53:shortest=1[branded_main];
[branded_main][content_video]overlay=x=40:y=246:shortest=1,
drawbox=x=39:y=245:w=1002:h=564:color=white@0.14:t=2[main_video];
color=c=0x030303:s=1080x1350:d=${outroDuration}:r=30,format=yuv420p,drawgrid=w=72:h=72:t=1:c=white@0.025,
drawbox=x=32:y=30:w=1016:h=1:color=white@0.14:t=fill,
drawbox=x=32:y=1318:w=1016:h=1:color=white@0.14:t=fill,
drawbox=x=48:y=56:w=12:h=12:color=0x1769e0:t=fill,
drawtext=fontfile='$fontRegular':text='THE HEALTH-INTELLIGENCE LAYER':fontcolor=0x82b3ff:fontsize=25:x=78:y=48,
drawtext=fontfile='$fontBold':text='The model is only':fontcolor=white:fontsize=58:x=48:y=156,
drawtext=fontfile='$fontBold':text='the beginning.':fontcolor=white:fontsize=58:x=48:y=226,
drawbox=x=48:y=356:w=5:h=398:color=0x1769e0:t=fill,
drawtext=fontfile='$fontBold':text='DATA  /  SIGNALS  /  OUTREACH  /  CARE':fontcolor=0x82b3ff:fontsize=23:x=82:y=428,
drawtext=fontfile='$fontRegular':text='The system around it':fontcolor=white:fontsize=46:x=82:y=526,
drawtext=fontfile='$fontRegular':text='is the work.':fontcolor=white:fontsize=46:x=82:y=586,
drawtext=fontfile='$fontRegular':text='KENTUCKY  /  JULY 2026':fontcolor=white@0.42:fontsize=20:x=48:y=1232[outro_canvas];
[outro_canvas][kentucky_outro]overlay=x=746:y=53:shortest=1[outro_video];
anullsrc=r=48000:cl=stereo,atrim=duration=$introDuration,asetpts=PTS-STARTPTS[intro_audio];
anullsrc=r=48000:cl=stereo,atrim=duration=$outroDuration,asetpts=PTS-STARTPTS[outro_audio];
[intro_video][intro_audio][main_video][content_audio][outro_video][outro_audio]concat=n=3:v=1:a=1[clean_video][final_audio]
"@

& ffmpeg -hide_banner -y `
  -i $source `
  -loop 1 -i $kentucky `
  -filter_complex $filter `
  -map "[clean_video]" -map "[final_audio]" `
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 30 `
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart -t $totalDuration $cleanOutput

if ($LASTEXITCODE -ne 0) {
  throw "ffmpeg clean-master build failed with exit code $LASTEXITCODE"
}

& ffmpeg -hide_banner -y `
  -i $cleanOutput `
  -filter_complex "color=c=0x030303:s=1080x300:d=${totalDuration}:r=30[caption_bg];[caption_bg]subtitles=filename='$captionFilterPath'[caption_strip];[0:v][caption_strip]overlay=x=0:y=850:enable='between(t,$introDuration,$contentEnd)':shortest=1,drawbox=x=48:y=872:w=4:h=276:color=0x1769e0:t=fill:enable='between(t,$introDuration,$contentEnd)'[captioned_video]" `
  -map "[captioned_video]" -map 0:a:0 `
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 30 `
  -c:a copy -movflags +faststart $captionedOutput

if ($LASTEXITCODE -ne 0) {
  throw "ffmpeg caption burn failed with exit code $LASTEXITCODE"
}

& ffmpeg -hide_banner -loglevel error -y `
  -ss 6.500 -i $captionedOutput -frames:v 1 -q:v 2 $thumbnailOutput

if ($LASTEXITCODE -ne 0) {
  throw "ffmpeg thumbnail build failed with exit code $LASTEXITCODE"
}

Write-Host "Built:"
Write-Host "  $cleanOutput"
Write-Host "  $captionedOutput"
Write-Host "  $thumbnailOutput"
