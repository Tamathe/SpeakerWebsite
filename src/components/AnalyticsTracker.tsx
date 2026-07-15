import { useEffect } from "react";
import {
  type AnalyticsEventName,
  trackAnalytics,
} from "../analytics";
import {
  boundedWatchSeconds,
  VIDEO_WATCH_FLUSH_INTERVAL_MS,
} from "../videoWatchTime";

const VIDEO_MILESTONES = [25, 50, 75, 90] as const;

function sectionFor(element: Element) {
  const section = element.closest<HTMLElement>("section[id]");
  if (section?.id) return section.id;
  if (element.closest(".speaking-hero")) return "hero";
  if (element.closest("footer")) return "footer";
  if (element.closest("header")) return "header";
  return "site";
}

function contentFor(anchor: HTMLAnchorElement) {
  return anchor.dataset.analyticsId || "";
}

function bindNativeVideo(video: HTMLVideoElement) {
  const videoId = video.dataset.analyticsVideoId;
  if (!videoId) return () => undefined;

  let started = false;
  let completed = false;
  let clockStartedAt: number | null = null;
  let watchedSeconds = 0;
  let reportedSeconds = 0;
  const milestones = new Set<number>();

  const duration = () =>
    Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;

  const currentTime = () =>
    Number.isFinite(video.currentTime) && video.currentTime >= 0
      ? video.currentTime
      : 0;

  const startClock = () => {
    if (
      clockStartedAt === null &&
      document.visibilityState === "visible" &&
      !video.paused &&
      !video.ended
    ) {
      clockStartedAt = performance.now();
    }
  };

  const stopClock = () => {
    if (clockStartedAt === null) return;

    watchedSeconds += boundedWatchSeconds(clockStartedAt, performance.now());
    clockStartedAt = null;
  };

  const commonDetails = () => ({
    section: sectionFor(video),
    videoId,
    provider: "native" as const,
    duration: duration(),
    currentTime: currentTime(),
  });

  const reportWatch = () => {
    const unreported = watchedSeconds - reportedSeconds;
    if (unreported < 0.5) return;

    reportedSeconds = watchedSeconds;
    const totalDuration = duration();
    const furthestPercent = totalDuration
      ? Math.min(100, (currentTime() / totalDuration) * 100)
      : 0;

    trackAnalytics("video_watch", {
      ...commonDetails(),
      milestone: Math.round(furthestPercent),
      watchedSeconds: Math.round(unreported * 10) / 10,
    });
  };

  const onPlay = () => {
    if (!started) {
      started = true;
      trackAnalytics("video_start", commonDetails(), {
        onceKey: `video-start:${videoId}`,
      });
      return;
    }

    if (completed) {
      completed = false;
      trackAnalytics("video_replay", commonDetails());
    }
  };

  const onPlaying = () => startClock();

  const onProgress = () => {
    if (video.seeking) return;

    const totalDuration = duration();
    if (!totalDuration) return;
    const percent = (currentTime() / totalDuration) * 100;

    for (const milestone of VIDEO_MILESTONES) {
      if (percent < milestone || milestones.has(milestone)) continue;
      milestones.add(milestone);
      trackAnalytics("video_progress", {
        ...commonDetails(),
        milestone,
      });
    }
  };

  const onPause = () => {
    stopClock();
    reportWatch();
  };

  const onWaiting = () => stopClock();
  const onSeeking = () => stopClock();
  const onSeeked = () => startClock();

  const onEnded = () => {
    stopClock();
    reportWatch();
    completed = true;
    trackAnalytics("video_complete", {
      ...commonDetails(),
      milestone: 100,
    });
  };

  const onError = () => {
    stopClock();
    reportWatch();
    trackAnalytics("video_error", commonDetails(), {
      onceKey: `video-error:${videoId}`,
    });
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      stopClock();
      reportWatch();
    } else {
      startClock();
    }
  };

  const onPageHide = () => {
    stopClock();
    reportWatch();
  };

  const watchFlushTimer = window.setInterval(() => {
    if (clockStartedAt === null) return;
    stopClock();
    reportWatch();
    startClock();
  }, VIDEO_WATCH_FLUSH_INTERVAL_MS);

  video.addEventListener("play", onPlay);
  video.addEventListener("playing", onPlaying);
  video.addEventListener("timeupdate", onProgress);
  video.addEventListener("pause", onPause);
  video.addEventListener("waiting", onWaiting);
  video.addEventListener("seeking", onSeeking);
  video.addEventListener("seeked", onSeeked);
  video.addEventListener("ended", onEnded);
  video.addEventListener("error", onError);
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", onPageHide);

  return () => {
    stopClock();
    video.removeEventListener("play", onPlay);
    video.removeEventListener("playing", onPlaying);
    video.removeEventListener("timeupdate", onProgress);
    video.removeEventListener("pause", onPause);
    video.removeEventListener("waiting", onWaiting);
    video.removeEventListener("seeking", onSeeking);
    video.removeEventListener("seeked", onSeeked);
    video.removeEventListener("ended", onEnded);
    video.removeEventListener("error", onError);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("pagehide", onPageHide);
    window.clearInterval(watchFlushTimer);
  };
}

export function AnalyticsTracker() {
  useEffect(() => {
    trackAnalytics("page_view", {}, { onceKey: "page-view" });

    const sectionTimers = new Map<Element, number>();
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = entry.target as HTMLElement;
          const existingTimer = sectionTimers.get(section);

          if (!entry.isIntersecting) {
            if (existingTimer !== undefined) window.clearTimeout(existingTimer);
            sectionTimers.delete(section);
            continue;
          }

          if (existingTimer !== undefined) continue;
          const timer = window.setTimeout(() => {
            trackAnalytics(
              "section_view",
              { section: section.id, content: section.id },
              { onceKey: `section-view:${section.id}` },
            );
            sectionTimers.delete(section);
          }, 750);
          sectionTimers.set(section, timer);
        }
      },
      { rootMargin: "-20% 0px -35% 0px", threshold: 0.05 },
    );

    for (const section of sections) observer.observe(section);

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) return;

      const content = contentFor(anchor);
      if (!content) return;

      let analyticsEvent: AnalyticsEventName;
      let targetHost = url.host;

      if (url.protocol === "mailto:") {
        analyticsEvent = "contact_click";
        targetHost = "email";
      } else if (anchor.hasAttribute("download")) {
        analyticsEvent = "download_click";
        targetHost = window.location.host;
      } else if (url.origin !== window.location.origin) {
        analyticsEvent = "outbound_click";
      } else {
        analyticsEvent = "navigation_click";
      }

      trackAnalytics(analyticsEvent, {
        section: sectionFor(anchor),
        content,
        targetHost,
      });
    };

    document.addEventListener("click", onClick, true);

    const videoCleanups = Array.from(
      document.querySelectorAll<HTMLVideoElement>("video[data-analytics-video-id]"),
      bindNativeVideo,
    );

    let visibleSeconds = 0;
    const engagementTimer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      visibleSeconds += 1;
      if (visibleSeconds >= 30) {
        trackAnalytics(
          "engaged_30s",
          { section: "page", milestone: 30 },
          { onceKey: "engaged-30s" },
        );
        window.clearInterval(engagementTimer);
      }
    }, 1000);

    return () => {
      observer.disconnect();
      for (const timer of sectionTimers.values()) window.clearTimeout(timer);
      document.removeEventListener("click", onClick, true);
      for (const cleanup of videoCleanups) cleanup();
      window.clearInterval(engagementTimer);
    };
  }, []);

  return null;
}
