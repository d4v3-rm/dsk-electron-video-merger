# Codec and Container Guide

## What this app actually encodes

This desktop app now exposes several practical FFmpeg output paths instead of only the basic H.264 and VP9 set.

- **H.264 via `libx264`** for CPU-driven MP4, MOV, MKV, and FLV exports
- **H.264 via `h264_nvenc`** for NVIDIA-accelerated MP4, MOV, MKV, and FLV exports
- **VP9 via `libvpx-vp9`** for WebM exports on CPU
- **MPEG-4 Part 2 via `mpeg4`** for AVI exports on CPU
- **Theora via `libtheora`** for OGV exports on CPU
- **MPEG-2 via `mpeg2video`** for MPG exports on CPU
- **AAC**, **Opus**, **MP3**, **Vorbis**, and **MP2** audio depending on the selected container

## Container vs codec

A container and a codec are not the same thing.

- **MP4 / MOV / MKV / WebM / FLV / AVI / OGV / MPG** are containers
- **H.264 / VP9 / MPEG-4 / Theora / MPEG-2 / AAC / Opus / MP3 / Vorbis / MP2** are codecs

The output format controls the container and its codec family. The selected backend decides whether the H.264 family stays on CPU or moves to NVIDIA NVENC.

## Output format differences

### MP4

- Best general-purpose delivery format
- Uses H.264 video with AAC audio in this app
- Supports `+faststart`
- Safest default when compatibility is the priority

### MOV

- Better suited to editing-oriented handoff
- Uses H.264 video with AAC audio here
- Similar image behavior to MP4, but with a more post-production-friendly container

### MKV

- Flexible archive-style container
- Uses H.264 video with AAC audio here
- Good when you want fewer muxing constraints and do not need universal playback

### WebM

- Uses VP9 video with Opus audio
- CPU-only in this build
- Best fit for web-first delivery where VP9 is desirable

### FLV

- Uses H.264 video with AAC audio
- Intended for legacy streaming or ingest chains
- Can still use NVIDIA NVENC when available

### AVI

- Uses MPEG-4 video with MP3 audio
- CPU-only in this build
- Useful mainly for legacy interchange or compatibility targets

### OGV

- Uses Theora video with Vorbis audio
- CPU-only in this build
- Useful for open-media targets and niche archival workflows

### MPG

- Uses MPEG-2 video with MP2 audio
- CPU-only in this build
- Good for signage, appliances, and older playback stacks

## Backend differences

### Auto

- Chooses NVIDIA NVENC when the GPU path is available and the selected container supports it
- Falls back to CPU automatically otherwise
- Recommended for most users because it avoids hard failures on unsupported systems

### CPU

- Uses software encoding only
- Highest compatibility and full container coverage
- Usually slower, but available everywhere

### NVIDIA NVENC

- Uses the GPU encoder on supported NVIDIA hardware
- Available in this app for MP4, MOV, MKV, and FLV
- If the bundled FFmpeg binary cannot detect NVENC, the job falls back to CPU

## Compression profiles

The UI now exposes five profiles. The exact mapping depends on the chosen container:

- **Master**: highest retention, largest files
- **High**: conservative compression with light size reduction
- **Balanced**: default tradeoff
- **Web**: stronger size reduction for upload and delivery
- **Small**: most aggressive profile

Technical mapping by codec family:

- **H.264 CPU**: `CRF 16 / 20 / 23 / 27 / 31`
- **H.264 NVENC**: `CQ 16 / 19 / 22 / 26 / 30`
- **VP9**: `CRF 26 / 29 / 32 / 35 / 39`
- **MPEG-4 (AVI)**: `q:v 2 / 4 / 5 / 7 / 9`
- **Theora (OGV)**: `q:v 9 / 8 / 7 / 6 / 5`
- **MPEG-2 (MPG)**: `q:v 2 / 4 / 5 / 7 / 9`

Lower `CRF`, `CQ`, and `q:v` values usually preserve more detail for H.264, VP9, MPEG-4, and MPEG-2. Theora is inverted here: higher `q:v` preserves more detail.

## Frame timing

The app exposes two timing strategies:

- **Preserve source timing** keeps incoming timestamps and avoids intentional frame drops or duplication
- **Constant frame rate** normalizes the output to the selected fps and may duplicate or drop frames by design

Available CFR targets are `24`, `25`, `30`, `48`, `50`, `60`, and `120` fps.

Use **Preserve source timing** unless your delivery target explicitly requires a fixed frame rate.

## Practical recommendations

- Choose **MP4 + Auto + Balanced** for the safest general-purpose export
- Choose **MOV + High** when the file is heading into an editing workflow
- Choose **MKV + Master** for robust archive-style H.264 outputs
- Choose **WebM + Web** when you specifically need VP9 delivery
- Choose **FLV / AVI / OGV / MPG** only when the downstream system really requires those containers
