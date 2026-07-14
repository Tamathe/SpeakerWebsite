import { useState } from "react";

const embedUrl =
  "https://www.youtube-nocookie.com/embed/v1aHwVq0dLI?start=4664&end=6819&rel=0&autoplay=1";

export function LegislatureVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="legislature-video">
      {isPlaying ? (
        <iframe
          src={embedUrl}
          title="Artificial Intelligence at the University of Kentucky — Kentucky General Assembly"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          className="legislature-video-poster"
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label="Play the Kentucky General Assembly presentation from 1 hour 17 minutes 44 seconds"
        >
          <img
            src="/media/speaking/kentucky-legislature.jpg"
            alt="Tama Thé and Hubert Ballard presenting AI at UK to the Kentucky General Assembly Artificial Intelligence Task Force"
          />
          <span className="video-play" aria-hidden="true">
            <i />
          </span>
          <span className="video-start-time">Starts at 1:17:44</span>
        </button>
      )}
    </div>
  );
}
