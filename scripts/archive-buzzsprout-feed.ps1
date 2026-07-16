param(
    [Parameter(Mandatory = $true)]
    [string]$FeedUrl,

    [Parameter(Mandatory = $true)]
    [string]$OutputRoot,

    [string]$SpotifyShowUrl = "",
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
$utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)

function Write-Utf8File {
    param([string]$Path, [string]$Content)
    [System.IO.File]::WriteAllText($Path, $Content, $utf8WithoutBom)
}

function Get-Sha256 {
    param([string]$Path)
    (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToUpperInvariant()
}

function Get-SafeBaseName {
    param([string]$PublishedDate, [string]$Title, [string]$EpisodeId)

    $cleanTitle = $Title -replace '\s*\|\s*', ' - '
    $cleanTitle = $cleanTitle -replace '[<>:"/\\|?*]', '-'
    $cleanTitle = $cleanTitle -replace '\s+', ' '
    $cleanTitle = $cleanTitle.Trim(' ', '.', '-')
    if ($cleanTitle.Length -gt 118) {
        $cleanTitle = $cleanTitle.Substring(0, 118).TrimEnd(' ', '.', '-')
    }
    "$PublishedDate - $cleanTitle (BS-$EpisodeId)"
}

function Convert-HtmlToPlainText {
    param([string]$Html)

    $text = $Html -replace '(?i)<br\s*/?>', "`r`n"
    $text = $text -replace '(?i)</p\s*>', "`r`n`r`n"
    $text = $text -replace '(?i)<p(?:\s[^>]*)?>', ''
    $text = $text -replace '<[^>]+>', ''
    $text = [System.Net.WebUtility]::HtmlDecode($text)
    $text = $text -replace "\u00a0", ' '
    $text = $text -replace "(?m)[ \t]+$", ''
    $text = $text -replace "(\r?\n){3,}", "`r`n`r`n"
    $text.Trim() + "`r`n"
}

function Save-RemoteFile {
    param([string]$Url, [string]$Destination, [long]$ExpectedBytes = -1)

    if ((Test-Path -LiteralPath $Destination) -and -not $Force) {
        $existing = Get-Item -LiteralPath $Destination
        if (($ExpectedBytes -lt 0) -or ($ExpectedBytes -eq $existing.Length)) {
            Write-Output "SKIP $($existing.Name)"
            return
        }
        throw "Existing file has an unexpected byte length: $Destination"
    }

    $temporary = "$Destination.partial"
    if (Test-Path -LiteralPath $temporary) {
        Remove-Item -LiteralPath $temporary -Force
    }
    Invoke-WebRequest -Uri $Url -OutFile $temporary -UseBasicParsing
    if ($ExpectedBytes -ge 0) {
        $downloadedBytes = (Get-Item -LiteralPath $temporary).Length
        if ($downloadedBytes -ne $ExpectedBytes) {
            throw "Downloaded byte length $downloadedBytes does not match expected ${ExpectedBytes}: $Url"
        }
    }
    Move-Item -LiteralPath $temporary -Destination $Destination -Force
    Write-Output "SAVED $(Split-Path -Leaf $Destination)"
}

$resolvedOutputRoot = [System.IO.Path]::GetFullPath($OutputRoot)
New-Item -ItemType Directory -Force -Path $resolvedOutputRoot | Out-Null

$retrievedAt = [datetimeoffset]::UtcNow.ToString('o')
$feedResponse = Invoke-WebRequest -Uri $FeedUrl -UseBasicParsing
$feedXmlText = $feedResponse.Content
[xml]$feed = $feedXmlText

$namespace = New-Object System.Xml.XmlNamespaceManager($feed.NameTable)
$namespace.AddNamespace('itunes', 'http://www.itunes.com/dtds/podcast-1.0.dtd')
$namespace.AddNamespace('podcast', 'https://podcastindex.org/namespace/1.0')

$channel = $feed.rss.channel
$showTitle = $channel.SelectSingleNode('title').InnerText
$showSlug = ($showTitle -replace '[<>:"/\\|?*]', '-' -replace '\s+', '-').Trim('-')
$feedPath = Join-Path $resolvedOutputRoot "$showSlug.feed.xml"
Write-Utf8File -Path $feedPath -Content $feedXmlText

$showImageNode = $channel.SelectSingleNode('itunes:image', $namespace)
$showImageUrl = if ($showImageNode) { $showImageNode.GetAttribute('href') } else { '' }
$showImagePath = if ($showImageUrl) { Join-Path $resolvedOutputRoot "$showSlug.artwork.jpg" } else { $null }
if ($showImagePath) {
    Save-RemoteFile -Url $showImageUrl -Destination $showImagePath
}

$episodeRows = @()
$items = @($channel.SelectNodes('item'))

foreach ($item in $items) {
    $title = $item.SelectSingleNode('title').InnerText.Trim()
    $guid = $item.SelectSingleNode('guid').InnerText.Trim()
    $episodeId = $guid -replace '^Buzzsprout-', ''
    $publishedAt = [datetimeoffset]::Parse($item.SelectSingleNode('pubDate').InnerText)
    $publishedDate = $publishedAt.ToString('yyyy-MM-dd')
    $baseName = Get-SafeBaseName -PublishedDate $publishedDate -Title $title -EpisodeId $episodeId

    $enclosure = $item.SelectSingleNode('enclosure')
    $audioUrl = $enclosure.GetAttribute('url')
    $expectedBytes = [long]$enclosure.GetAttribute('length')
    $audioPath = Join-Path $resolvedOutputRoot "$baseName.mp3"
    Save-RemoteFile -Url $audioUrl -Destination $audioPath -ExpectedBytes $expectedBytes

    $episodeImageNode = $item.SelectSingleNode('itunes:image', $namespace)
    $episodeImageUrl = if ($episodeImageNode) { $episodeImageNode.GetAttribute('href') } else { $showImageUrl }
    $episodeImagePath = if ($episodeImageUrl) { Join-Path $resolvedOutputRoot "$baseName.artwork.jpg" } else { $null }
    if ($episodeImagePath) {
        Save-RemoteFile -Url $episodeImageUrl -Destination $episodeImagePath
    }

    $publisherTranscriptNode = $item.SelectSingleNode('podcast:transcript', $namespace)
    $publisherTranscriptUrl = if ($publisherTranscriptNode) { $publisherTranscriptNode.GetAttribute('url') } else { '' }
    $publisherTranscriptHtmlPath = $null
    $publisherTranscriptTextPath = $null
    if ($publisherTranscriptUrl) {
        $publisherTranscriptClient = New-Object System.Net.WebClient
        $publisherTranscriptBytes = $publisherTranscriptClient.DownloadData($publisherTranscriptUrl)
        $publisherTranscriptHtml = [System.Text.Encoding]::UTF8.GetString($publisherTranscriptBytes)
        $publisherTranscriptHtmlPath = Join-Path $resolvedOutputRoot "$baseName.publisher-transcript.html"
        $publisherTranscriptTextPath = Join-Path $resolvedOutputRoot "$baseName.publisher-transcript.txt"
        Write-Utf8File -Path $publisherTranscriptHtmlPath -Content $publisherTranscriptHtml
        Write-Utf8File -Path $publisherTranscriptTextPath -Content (Convert-HtmlToPlainText $publisherTranscriptHtml)
        Write-Output "SAVED $(Split-Path -Leaf $publisherTranscriptTextPath)"
    }

    $probeJson = & ffprobe -v error -show_entries format=duration,format_name,bit_rate -show_entries stream=codec_type,codec_name,sample_rate,channels -of json $audioPath
    if ($LASTEXITCODE -ne 0) {
        throw "ffprobe failed for $audioPath"
    }
    $probe = $probeJson | ConvertFrom-Json
    $audioStream = @($probe.streams | Where-Object codec_type -eq 'audio')[0]
    $durationSeconds = [math]::Round([double]$probe.format.duration, 3)
    $episodePageNode = $item.SelectSingleNode('link')
    $episodePageUrl = if ($episodePageNode) { $episodePageNode.InnerText.Trim() } else { '' }
    $seasonNode = $item.SelectSingleNode('itunes:season', $namespace)
    $episodeNode = $item.SelectSingleNode('itunes:episode', $namespace)
    $durationNode = $item.SelectSingleNode('itunes:duration', $namespace)
    $descriptionNode = $item.SelectSingleNode('description')

    $metadataPath = Join-Path $resolvedOutputRoot "$baseName.info.json"
    $metadata = [ordered]@{
        schemaVersion = 1
        show = [ordered]@{
            title = $showTitle
            author = $channel.SelectSingleNode('itunes:author', $namespace).InnerText
            homepageUrl = $channel.SelectSingleNode('link').InnerText
            rssUrl = $feedResponse.BaseResponse.ResponseUri.AbsoluteUri
            spotifyShowUrl = $SpotifyShowUrl
        }
        episode = [ordered]@{
            id = $episodeId
            guid = $guid
            title = $title
            season = if ($seasonNode) { [int]$seasonNode.InnerText } else { $null }
            number = if ($episodeNode) { [int]$episodeNode.InnerText } else { $null }
            publishedAt = $publishedAt.ToString('o')
            pageUrl = $episodePageUrl
            descriptionHtml = if ($descriptionNode) { $descriptionNode.InnerText } else { '' }
            feedDurationSeconds = if ($durationNode) { [int]$durationNode.InnerText } else { $null }
        }
        source = [ordered]@{
            enclosureUrl = $audioUrl
            enclosureType = $enclosure.GetAttribute('type')
            enclosureBytes = $expectedBytes
            publisherTranscriptUrl = $publisherTranscriptUrl
            artworkUrl = $episodeImageUrl
            retrievedAt = $retrievedAt
        }
        archive = [ordered]@{
            audioFile = Split-Path -Leaf $audioPath
            audioBytes = (Get-Item -LiteralPath $audioPath).Length
            audioSha256 = Get-Sha256 $audioPath
            artworkFile = if ($episodeImagePath) { Split-Path -Leaf $episodeImagePath } else { $null }
            publisherTranscriptHtmlFile = if ($publisherTranscriptHtmlPath) { Split-Path -Leaf $publisherTranscriptHtmlPath } else { $null }
            publisherTranscriptTextFile = if ($publisherTranscriptTextPath) { Split-Path -Leaf $publisherTranscriptTextPath } else { $null }
        }
        technical = [ordered]@{
            durationSeconds = $durationSeconds
            format = $probe.format.format_name
            bitRate = if ($probe.format.bit_rate) { [int64]$probe.format.bit_rate } else { $null }
            audioCodec = $audioStream.codec_name
            sampleRate = if ($audioStream.sample_rate) { [int]$audioStream.sample_rate } else { $null }
            channels = if ($audioStream.channels) { [int]$audioStream.channels } else { $null }
        }
    }
    Write-Utf8File -Path $metadataPath -Content (($metadata | ConvertTo-Json -Depth 8) + "`n")

    $episodeRows += [pscustomobject][ordered]@{
        id = $episodeId
        guid = $guid
        title = $title
        season = $metadata.episode.season
        episode = $metadata.episode.number
        publishedAt = $metadata.episode.publishedAt
        durationSeconds = $durationSeconds
        audioFile = Split-Path -Leaf $audioPath
        audioBytes = $metadata.archive.audioBytes
        audioSha256 = $metadata.archive.audioSha256
        metadataFile = Split-Path -Leaf $metadataPath
        publisherTranscriptTextFile = $metadata.archive.publisherTranscriptTextFile
        artworkFile = $metadata.archive.artworkFile
        pageUrl = $episodePageUrl
        enclosureUrl = $audioUrl
    }
}

$showMetadata = [ordered]@{
    schemaVersion = 1
    title = $showTitle
    author = $channel.SelectSingleNode('itunes:author', $namespace).InnerText
    descriptionHtml = $channel.SelectSingleNode('description').InnerText
    homepageUrl = $channel.SelectSingleNode('link').InnerText
    rssUrl = $feedResponse.BaseResponse.ResponseUri.AbsoluteUri
    requestedFeedUrl = $FeedUrl
    spotifyShowUrl = $SpotifyShowUrl
    artworkUrl = $showImageUrl
    retrievedAt = $retrievedAt
    feedLastBuildDate = ([datetimeoffset]::Parse($channel.SelectSingleNode('lastBuildDate').InnerText)).ToString('o')
    episodeCount = $episodeRows.Count
    totalAudioBytes = ($episodeRows | Measure-Object -Property audioBytes -Sum).Sum
    totalDurationSeconds = [math]::Round(($episodeRows | Measure-Object -Property durationSeconds -Sum).Sum, 3)
    feedFile = Split-Path -Leaf $feedPath
    feedSha256 = Get-Sha256 $feedPath
    artworkFile = if ($showImagePath) { Split-Path -Leaf $showImagePath } else { $null }
    episodes = $episodeRows
}
$showMetadataPath = Join-Path $resolvedOutputRoot "$showSlug.show.json"
Write-Utf8File -Path $showMetadataPath -Content (($showMetadata | ConvertTo-Json -Depth 8) + "`n")

Write-Output "SHOW $showTitle"
Write-Output "EPISODES $($episodeRows.Count)"
Write-Output "AUDIO_BYTES $($showMetadata.totalAudioBytes)"
Write-Output "DURATION_SECONDS $($showMetadata.totalDurationSeconds)"
Write-Output "MANIFEST $showMetadataPath"
