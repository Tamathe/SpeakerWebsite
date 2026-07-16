$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
$source = Join-Path $repoRoot "Media\Kentucky-Legislature-AI-at-UK-2025.mp4"
$kentucky = Join-Path $repoRoot "public\images\brand\kentucky-boundary-exact.png"
$captions = Join-Path $PSScriptRoot "the-useful-part-linkedin.srt"
$burnedCaptions = Join-Path $PSScriptRoot "the-useful-part-linkedin.ass"
$headlineLine1 = Join-Path $PSScriptRoot "headline-line-1.txt"
$headlineLine2 = Join-Path $PSScriptRoot "headline-line-2.txt"
$cleanOutput = Join-Path $PSScriptRoot "the-useful-part-linkedin-clean.mp4"
$captionedOutput = Join-Path $PSScriptRoot "the-useful-part-linkedin-captioned.mp4"

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

$introDuration = 2.500
$contentDuration = 81.341
$contentEnd = 83.841
$totalDuration = 88.841

$filter = @"
[0:v]split=6[video_a][video_b][video_c][video_d][video_e][video_f];
[video_a]trim=start=1022.159:end=1040.800,setpts=PTS-STARTPTS,crop=640:360:0:180,scale=1000:562:flags=lanczos,fps=30,format=yuv420p[first_video];
[video_b]trim=start=1121.840:end=1130.700,setpts=PTS-STARTPTS,crop=640:360:0:180,scale=1000:562:flags=lanczos,fps=30,format=yuv420p[second_video];
[video_c]trim=start=1153.840:end=1157.300,setpts=PTS-STARTPTS,crop=640:360:0:180,scale=1000:562:flags=lanczos,fps=30,format=yuv420p[third_video];
[video_d]trim=start=1315.440:end=1331.600,setpts=PTS-STARTPTS,crop=640:360:0:180,scale=1000:562:flags=lanczos,fps=30,format=yuv420p[fourth_video];
[video_e]trim=start=1354.080:end=1370.500,setpts=PTS-STARTPTS,crop=640:360:0:180,scale=1000:562:flags=lanczos,fps=30,format=yuv420p[fifth_video];
[video_f]trim=start=1928.450:end=1946.250,setpts=PTS-STARTPTS,crop=640:360:0:180,scale=1000:562:flags=lanczos,fps=30,format=yuv420p[sixth_video];
[first_video][second_video][third_video][fourth_video][fifth_video][sixth_video]concat=n=6:v=1:a=0[content_video];
[0:a]asplit=6[audio_a][audio_b][audio_c][audio_d][audio_e][audio_f];
[audio_a]atrim=start=1022.159:end=1040.800,asetpts=PTS-STARTPTS[first_audio];
[audio_b]atrim=start=1121.840:end=1130.700,asetpts=PTS-STARTPTS[second_audio];
[audio_c]atrim=start=1153.840:end=1157.300,asetpts=PTS-STARTPTS[third_audio];
[audio_d]atrim=start=1315.440:end=1331.600,asetpts=PTS-STARTPTS[fourth_audio];
[audio_e]atrim=start=1354.080:end=1370.500,asetpts=PTS-STARTPTS[fifth_audio];
[audio_f]atrim=start=1928.450:end=1946.250,asetpts=PTS-STARTPTS[sixth_audio];
[first_audio][second_audio][third_audio][fourth_audio][fifth_audio][sixth_audio]concat=n=6:v=0:a=1,loudnorm=I=-16:LRA=11:TP=-1.5,aresample=48000,aformat=channel_layouts=stereo[content_audio];
[1:v]scale=300:-1:flags=lanczos,format=rgba,colorchannelmixer=aa=0.20,split=3[kentucky_intro][kentucky_main][kentucky_outro];
color=c=0x030303:s=1080x1350:d=${introDuration}:r=30,format=yuv420p,drawgrid=w=72:h=72:t=1:c=white@0.025,
drawbox=x=32:y=30:w=1016:h=1:color=white@0.14:t=fill,
drawbox=x=32:y=1318:w=1016:h=1:color=white@0.14:t=fill,
drawbox=x=48:y=56:w=12:h=12:color=0x1769e0:t=fill,
drawtext=fontfile='$fontRegular':text='KENTUCKY GENERAL ASSEMBLY':fontcolor=0x82b3ff:fontsize=25:x=78:y=48,
drawtext=fontfile='$fontBold':textfile='$headlineLine1FilterPath':fontcolor=white:fontsize=68:x=48:y=184,
drawtext=fontfile='$fontBold':textfile='$headlineLine2FilterPath':fontcolor=white:fontsize=68:x=48:y=268,
drawtext=fontfile='$fontBold':text='ONE CARE PATHWAY AT A TIME':fontcolor=0x82b3ff:fontsize=24:x=48:y=374,
drawbox=x=48:y=494:w=5:h=326:color=0x1769e0:t=fill,
drawtext=fontfile='$fontRegular':text='ARTIFICIAL INTELLIGENCE TASK FORCE':fontcolor=white@0.68:fontsize=27:x=82:y=574,
drawtext=fontfile='$fontBold':text='SEPTEMBER 11, 2025':fontcolor=white:fontsize=48:x=82:y=630,
drawtext=fontfile='$fontRegular':text='RECORDED TESTIMONY':fontcolor=white@0.42:fontsize=22:x=82:y=706,
drawtext=fontfile='$fontRegular':text='SOURCE\: KENTUCKY LEGISLATIVE RESEARCH COMMISSION':fontcolor=white@0.42:fontsize=20:x=48:y=1232[intro_canvas];
[intro_canvas][kentucky_intro]overlay=x=746:y=53:shortest=1[intro_video];
color=c=0x030303:s=1080x1350:d=${contentDuration}:r=30,format=yuv420p,drawgrid=w=72:h=72:t=1:c=white@0.025,
drawbox=x=32:y=30:w=1016:h=1:color=white@0.14:t=fill,
drawbox=x=32:y=1318:w=1016:h=1:color=white@0.14:t=fill,
drawbox=x=48:y=56:w=12:h=12:color=0x1769e0:t=fill,
drawtext=fontfile='$fontRegular':text='KENTUCKY GENERAL ASSEMBLY':fontcolor=0x82b3ff:fontsize=25:x=78:y=48,
drawtext=fontfile='$fontBold':textfile='$headlineLine1FilterPath':fontcolor=white:fontsize=58:x=48:y=96,
drawtext=fontfile='$fontBold':textfile='$headlineLine2FilterPath':fontcolor=white:fontsize=58:x=48:y=158,
drawbox=x=48:y=872:w=4:h=276:color=0x1769e0:t=fill,
drawtext=fontfile='$fontRegular':text='RECORDED SEPTEMBER 11, 2025':fontcolor=white@0.68:fontsize=23:x=48:y=1194,
drawtext=fontfile='$fontRegular':text='SOURCE\: KENTUCKY LEGISLATIVE RESEARCH COMMISSION':fontcolor=white@0.42:fontsize=20:x=48:y=1232[main_canvas];
[main_canvas][kentucky_main]overlay=x=746:y=53:shortest=1[branded_main];
[branded_main][content_video]overlay=x=40:y=246:shortest=1,
drawbox=x=39:y=245:w=1002:h=564:color=white@0.14:t=2,
drawbox=x=58:y=263:w=408:h=42:color=0x030303@0.84:t=fill:enable='between(t,63.541,81.341)',
drawtext=fontfile='$fontBold':text='SEN. AMANDA MAYS BLEDSOE':fontcolor=white:fontsize=21:x=72:y=272:enable='between(t,63.541,81.341)'[main_video];
color=c=0x030303:s=1080x1350:d=5.000:r=30,format=yuv420p,drawgrid=w=72:h=72:t=1:c=white@0.025,
drawbox=x=32:y=30:w=1016:h=1:color=white@0.14:t=fill,
drawbox=x=32:y=1318:w=1016:h=1:color=white@0.14:t=fill,
drawbox=x=48:y=56:w=12:h=12:color=0x1769e0:t=fill,
drawtext=fontfile='$fontRegular':text='PROJECT UPDATE  /  JULY 2026':fontcolor=0x82b3ff:fontsize=25:x=78:y=48,
drawtext=fontfile='$fontBold':text='The work is underway.':fontcolor=white:fontsize=58:x=48:y=156,
drawbox=x=48:y=306:w=5:h=512:color=0x1769e0:t=fill,
drawtext=fontfile='$fontRegular':text='The KY-AHEAD prototype is functional.':fontcolor=white:fontsize=40:x=82:y=382,
drawtext=fontfile='$fontRegular':text='A state-university partnership with':fontcolor=white:fontsize=34:x=82:y=478,
drawtext=fontfile='$fontRegular':text='the Office of Data Analytics at Kentucky CHFS':fontcolor=white:fontsize=34:x=82:y=530,
drawtext=fontfile='$fontRegular':text='is underway.':fontcolor=white:fontsize=34:x=82:y=582,
drawtext=fontfile='$fontBold':text='STATE DATA  /  OUTREACH  /  SCHEDULING  /  CARE':fontcolor=0x82b3ff:fontsize=23:x=82:y=704,
drawtext=fontfile='$fontBold':text='WE ARE BUILDING THIS IN KENTUCKY.':fontcolor=white:fontsize=29:x=82:y=758,
drawtext=fontfile='$fontRegular':text='STATUS UPDATED JULY 2026':fontcolor=white@0.42:fontsize=20:x=48:y=1232[outro_canvas];
[outro_canvas][kentucky_outro]overlay=x=746:y=53:shortest=1[outro_video];
anullsrc=r=48000:cl=stereo,atrim=duration=$introDuration,asetpts=PTS-STARTPTS[intro_audio];
anullsrc=r=48000:cl=stereo,atrim=duration=5.000,asetpts=PTS-STARTPTS[outro_audio];
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

Write-Host "Built:"
Write-Host "  $cleanOutput"
Write-Host "  $captionedOutput"
