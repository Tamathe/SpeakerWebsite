import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const video = videoRef.current;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData;

    if (!video || motionPreference.matches || saveData) {
      return;
    }

    const playVideo = () => {
      if (motionPreference.matches) {
        video.pause();
        return;
      }

      void video.play().catch(() => {
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

  return (
    <video
      ref={videoRef}
      className={className}
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
        src="/media/speaking/speaker-compilation-loop.mp4?v=montage-v2"
        type="video/mp4"
      />
    </video>
  );
}
