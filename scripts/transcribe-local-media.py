import argparse
import json
import os
from pathlib import Path

from faster_whisper import WhisperModel


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--audio-root", type=Path, required=True)
    parser.add_argument("--transcript-root", type=Path, required=True)
    parser.add_argument("--model-root", type=Path, required=True)
    parser.add_argument("--model", default="base.en")
    parser.add_argument("--force", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    args.transcript_root.mkdir(parents=True, exist_ok=True)

    model = WhisperModel(
        args.model,
        device="cpu",
        compute_type="int8",
        download_root=str(args.model_root),
    )

    audio_paths = sorted(args.audio_root.glob("*.mp3"))
    print(f"TRANSCRIPT_QUEUE {len(audio_paths)}", flush=True)

    for index, audio_path in enumerate(audio_paths, start=1):
        output_path = args.transcript_root / f"{audio_path.stem}.json"
        if output_path.exists() and not args.force:
            print(f"TRANSCRIPT_SKIP {index}/{len(audio_paths)} {audio_path.stem}", flush=True)
            continue

        print(f"TRANSCRIBING {index}/{len(audio_paths)} {audio_path.stem}", flush=True)
        segments, info = model.transcribe(
            str(audio_path),
            beam_size=5,
            vad_filter=True,
            word_timestamps=False,
        )
        segment_rows = [
            {
                "start": segment.start,
                "end": segment.end,
                "text": segment.text.strip(),
            }
            for segment in segments
        ]
        payload = {
            "source": str(audio_path),
            "language": info.language,
            "duration": info.duration,
            "segments": segment_rows,
        }
        output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        print(
            f"TRANSCRIBED {index}/{len(audio_paths)} {audio_path.stem} {len(segment_rows)}",
            flush=True,
        )


if __name__ == "__main__":
    os.environ.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")
    main()
