import { useEffect, useRef, useState } from "react";

type AmbientSpeakerVideoProps = {
  className?: string;
};

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
  };
};

export function AmbientSpeakerVideo({ className }: AmbientSpeakerVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData;

    if (!video) {
      return;
    }

    if (motionPreference.matches || saveData) {
      video.pause();
      setIsPaused(true);
      return;
    }

    const playVideo = () => {
      if (motionPreference.matches) {
        video.pause();
        setIsPaused(true);
        return;
      }

      void video
        .play()
        .then(() => setIsPaused(false))
        .catch(() => {
          setIsPaused(true);
          // The poster remains visible if the browser declines autoplay.
        });
    };

    playVideo();
    motionPreference.addEventListener("change", playVideo);

    return () => {
      motionPreference.removeEventListener("change", playVideo);
      video.pause();
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play().then(() => setIsPaused(false)).catch(() => undefined);
      return;
    }

    video.pause();
    setIsPaused(true);
  };

  return (
    <div className={["ambient-speaker-video", className].filter(Boolean).join(" ")}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/speaking/speaker-compilation-poster.jpg"
        aria-hidden="true"
        tabIndex={-1}
        data-analytics-ignore="true"
      >
        <source
          src="/media/speaking/speaker-compilation-loop.mp4?v=montage-v6"
          type="video/mp4"
        />
      </video>
      <button
        className="ambient-speaker-video-toggle"
        type="button"
        onClick={togglePlayback}
      >
        <span aria-hidden="true">{isPaused ? "▶" : "Ⅱ"}</span>
        {isPaused ? "Play field reel" : "Pause field reel"}
      </button>
    </div>
  );
}
