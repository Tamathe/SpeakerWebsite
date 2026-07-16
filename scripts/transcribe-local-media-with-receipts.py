import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path


DLL_DIRECTORY_HANDLES = []


def add_nvidia_dll_directories() -> None:
    if os.name != "nt" or not hasattr(os, "add_dll_directory"):
        return
    site_packages = Path(sys.prefix) / "Lib" / "site-packages"
    for relative in (Path("nvidia/cublas/bin"), Path("nvidia/cudnn/bin")):
        candidate = site_packages / relative
        if candidate.is_dir():
            DLL_DIRECTORY_HANDLES.append(os.add_dll_directory(str(candidate)))
            os.environ["PATH"] = f"{candidate}{os.pathsep}{os.environ.get('PATH', '')}"


add_nvidia_dll_directories()

from faster_whisper import WhisperModel  # noqa: E402


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--model-root", type=Path, required=True)
    parser.add_argument("--model", default="distil-large-v3")
    parser.add_argument("--model-label", default="")
    parser.add_argument("--device", choices=("auto", "cuda", "cpu"), default="auto")
    parser.add_argument("--compute-type", default="")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("recordings", nargs="+", type=Path)
    return parser.parse_args()


def sha256(file_path: Path) -> str:
    digest = hashlib.sha256()
    with file_path.open("rb") as source:
        for chunk in iter(lambda: source.read(4 * 1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def clock(seconds: float) -> str:
    whole = max(0, round(seconds))
    hours, remainder = divmod(whole, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"


def apply_known_name_corrections(text: str) -> str:
    # The host's short spoken introduction is acoustically ambiguous to Whisper.
    return re.sub(r"\bTom A(?:tei|tey|tay)\b", "Tama Thé", text, flags=re.IGNORECASE)


def probe_duration(file_path: Path) -> float | None:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(file_path),
        ],
        capture_output=True,
        text=True,
        check=False,
        creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
    )
    try:
        return float(result.stdout.strip()) if result.returncode == 0 else None
    except ValueError:
        return None


def load_model(args: argparse.Namespace) -> tuple[WhisperModel, str, str]:
    candidates: list[tuple[str, str]]
    if args.device == "cuda":
        candidates = [("cuda", args.compute_type or "float16")]
    elif args.device == "cpu":
        candidates = [("cpu", args.compute_type or "int8")]
    else:
        candidates = [("cuda", args.compute_type or "float16"), ("cpu", "int8")]

    last_error: Exception | None = None
    for device, compute_type in candidates:
        try:
            print(f"MODEL_LOAD {args.model} device={device} compute={compute_type}", flush=True)
            model = WhisperModel(
                args.model,
                device=device,
                compute_type=compute_type,
                download_root=str(args.model_root),
            )
            return model, device, compute_type
        except Exception as error:  # The CPU fallback is intentional when CUDA runtime DLLs are absent.
            last_error = error
            print(f"MODEL_LOAD_FAILED device={device}: {error}", flush=True)
    raise RuntimeError(f"Unable to load transcription model: {last_error}")


def atomic_write(path: Path, content: str) -> None:
    temporary = path.with_name(f"{path.name}.tmp")
    temporary.write_text(content, encoding="utf-8")
    temporary.replace(path)


def main() -> None:
    args = parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    args.model_root.mkdir(parents=True, exist_ok=True)
    model, device, compute_type = load_model(args)
    model_label = args.model_label or args.model

    failures = 0
    for index, raw_path in enumerate(args.recordings, start=1):
        source_path = raw_path.resolve()
        if not source_path.is_file():
            print(f"FAILED {source_path}: source is not a file", flush=True)
            failures += 1
            continue

        base = source_path.stem
        transcript_path = (args.output_dir / f"{base}.txt").resolve()
        receipt_path = (args.output_dir / f"{base}.receipt.json").resolve()
        partial_path = (args.output_dir / f"{base}.partial.txt").resolve()
        if transcript_path.exists() and receipt_path.exists() and not args.force:
            print(f"SKIP {index}/{len(args.recordings)} {base}", flush=True)
            continue

        print(f"TRANSCRIBE {index}/{len(args.recordings)} {source_path.name}", flush=True)
        started = time.perf_counter()
        source_hash = sha256(source_path)
        source_info = source_path.stat()
        duration = probe_duration(source_path)
        prompt = (
            "The MDM podcast hosted by Tama Thé. "
            f"Episode: {base}. Medical decision making, medicine, and medical education."
        )
        hotwords = (
            "Tama Thé; The MDM; Medical Decision Making; Melissa Puffenbarger; "
            f"Katrianna Urrea; Spencer Brown; {base}"
        )

        try:
            segments, info = model.transcribe(
                str(source_path),
                language="en",
                beam_size=5,
                vad_filter=True,
                vad_parameters={"min_silence_duration_ms": 500},
                condition_on_previous_text=False,
                initial_prompt=prompt,
                hotwords=hotwords,
                word_timestamps=False,
            )
            sections: list[str] = []
            segment_rows: list[dict] = []
            for segment_number, segment in enumerate(segments, start=1):
                text = apply_known_name_corrections(segment.text.strip())
                if not text:
                    continue
                sections.append(f"[{clock(segment.start)} - {clock(segment.end)}]\n{text}")
                segment_rows.append(
                    {
                        "index": segment_number,
                        "startSeconds": round(segment.start, 3),
                        "endSeconds": round(segment.end, 3),
                        "characters": len(text),
                    }
                )
                if segment_number % 50 == 0:
                    partial_path.write_text("\n\n".join(sections) + "\n", encoding="utf-8")

            generated_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
            completeness = (
                "transcribed_from_readable_container"
                if duration is not None
                else "incomplete_or_unknown_unreadable_container_duration"
            )
            transcript = "\n".join(
                [
                    "# Recording Transcript",
                    "",
                    f"Source: {source_path}",
                    f"Source SHA-256: {source_hash}",
                    f"Source duration: {duration:.3f} seconds" if duration is not None else "Source duration: unavailable",
                    f"Completeness: {completeness}",
                    f"Generated: {generated_at}",
                    f"Transcription model: faster-whisper/{model_label}",
                    f"Transcription device: {device} ({compute_type})",
                    f"Detected language: {info.language} ({info.language_probability:.4f})",
                    "Speaker attribution: not inferred",
                    "",
                    "## Transcript",
                    "",
                    "\n\n".join(sections) if sections else "[No speech detected.]",
                    "",
                ]
            )
            atomic_write(transcript_path, transcript)
            transcript_hash = sha256(transcript_path)
            elapsed = round(time.perf_counter() - started, 3)
            receipt = {
                "schemaVersion": 1,
                "status": "transcribed",
                "sourcePath": str(source_path),
                "sourceBytes": source_info.st_size,
                "sourceSha256": source_hash,
                "sourceDurationSeconds": duration,
                "completeness": completeness,
                "transcriptPath": str(transcript_path),
                "transcriptSha256": transcript_hash,
                "generatedAt": generated_at,
                "model": f"faster-whisper/{model_label}",
                "engine": "faster-whisper",
                "device": device,
                "computeType": compute_type,
                "language": info.language,
                "languageProbability": info.language_probability,
                "elapsedSeconds": elapsed,
                "chunkSeconds": None,
                "extractionExitCode": 0,
                "extractionWarning": None,
                "segments": segment_rows,
            }
            atomic_write(receipt_path, json.dumps(receipt, indent=2, ensure_ascii=False) + "\n")
            partial_path.unlink(missing_ok=True)
            print(
                f"DONE {index}/{len(args.recordings)} {transcript_path.name} "
                f"segments={len(segment_rows)} elapsed={elapsed:.1f}s",
                flush=True,
            )
        except Exception as error:
            print(f"FAILED {source_path}: {error}", flush=True)
            failures += 1

    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    os.environ.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")
    main()
