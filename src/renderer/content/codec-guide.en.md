# Codec and Container Guide

## What this app actually encodes

This desktop app currently exposes these practical encoding paths:

- **H.264 via `libx264`** for CPU-driven MP4, MOV, and MKV exports
- **H.264 via `h264_nvenc`** for NVIDIA-accelerated MP4, MOV, and MKV exports
- **VP9 via `libvpx-vp9`** for WebM exports on CPU
- **AAC** audio for MP4, MOV, and MKV
- **Opus** audio for WebM

## Container vs codec

A container and a codec are not the same thing.

- **MP4 / MOV / MKV / WebM** are containers
- **H.264 / VP9 / AAC / Opus** are codecs

The output format controls the container. The selected backend decides which video encoder is used inside that container.

## Output format differences

### MP4

- Best compatibility across desktop, mobile, browsers, and editors
- Uses H.264 video with AAC audio in this app
- Supports `+faststart`, which moves metadata to the front for easier playback start
- Best default choice when you need broad compatibility

### MOV

- Good choice for Apple-centric workflows and NLE interchange
- Uses H.264 video with AAC audio here
- Similar compression behavior to MP4 in this app
- Usually chosen for editing pipelines rather than distribution

### MKV

- Flexible container with strong metadata and muxing support
- Uses H.264 video with AAC audio here
- Good when you want a robust archive/output container without MP4 constraints
- Less universally accepted by browsers and some consumer tools than MP4

### WebM

- Uses VP9 video with Opus audio here
- CPU-only in this release
- Good web-oriented delivery format when VP9 is preferred
- Slower to encode than H.264 in many CPU-only workflows

## Backend differences

### Auto

- Chooses NVIDIA NVENC when the GPU path is available and the selected container supports it
- Falls back to CPU automatically otherwise
- Recommended for most users because it avoids hard failures on unsupported systems

### CPU

- Uses software encoding only
- Highest compatibility and deterministic fallback path
- Usually slower, but available everywhere

### NVIDIA NVENC

- Uses the GPU encoder on supported NVIDIA hardware
- Faster for long merges and large outputs
- Available in this app for MP4, MOV, and MKV
- If the bundled FFmpeg binary cannot detect NVENC, the job falls back to CPU

## Compression profiles

The UI exposes three technical presets. The exact mapping is:

- **Light**: `H.264 CRF 18`, `NVENC CQ 18`, `VP9 CRF 28`
- **Balanced**: `H.264 CRF 23`, `NVENC CQ 22`, `VP9 CRF 32`
- **Strong**: `H.264 CRF 28`, `NVENC CQ 28`, `VP9 CRF 36`

Lower `CRF` / `CQ` values preserve more quality but produce larger files. Higher values reduce bitrate and file size more aggressively.

## Practical recommendations

- Choose **MP4 + Auto** for the safest general-purpose export
- Choose **MKV + Auto** when you want H.264 plus a flexible container
- Choose **WebM + CPU** only when you specifically need VP9/WebM delivery
- Choose **Strong** only when size matters more than image retention
- Choose **Light** for master-like outputs where visual quality is the priority
