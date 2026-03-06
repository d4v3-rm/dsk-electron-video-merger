# Codec and Container Guide

## Reading the export editor

The export editor is organized around five decisions:

1. **Container and codec family**
2. **Output resolution**
3. **Compression profile**
4. **Backend**
5. **Frame timing**

Container decides the actual codec path. Resolution decides whether the output follows the source canvas or a fixed delivery frame. Compression adjusts quality and size. Backend decides whether supported H.264 outputs run on CPU or NVENC. Frame timing controls whether cadence is preserved or normalized.

## Format matrix

| Format | Video codec | Audio codec | Backend | Best use |
| --- | --- | --- | --- | --- |
| `MP4` | H.264 | AAC | CPU or NVENC | General delivery and broad compatibility |
| `MOV` | H.264 | AAC | CPU or NVENC | Editing handoff and post workflows |
| `MKV` | H.264 | AAC | CPU or NVENC | Flexible archive-style output |
| `WebM` | VP9 | Opus | CPU only | Browser-first delivery |
| `FLV` | H.264 | AAC | CPU or NVENC | Legacy streaming or ingest targets |
| `AVI` | MPEG-4 Part 2 | MP3 | CPU only | Legacy interchange |
| `OGV` | Theora | Vorbis | CPU only | Open-media and niche archival targets |
| `MPG` | MPEG-2 | MP2 | CPU only | Signage, appliances, and older playback chains |

## Compression profiles

The five profiles always mean the same intent, even if the exact encoder parameter changes by codec family.

| Profile | Intent | Typical use |
| --- | --- | --- |
| `Master` | Highest retention, larger files | Handoff, edit-safe exports, archive masters |
| `High` | Conservative compression | Premium delivery with limited loss |
| `Balanced` | Default tradeoff | Most everyday exports |
| `Web` | Stronger bitrate reduction | Upload and distribution copies |
| `Small` | Most aggressive compression | Tight storage or bandwidth limits |

### Technical mapping

| Codec family | Master | High | Balanced | Web | Small |
| --- | --- | --- | --- | --- | --- |
| H.264 CPU | `CRF 16` | `CRF 20` | `CRF 23` | `CRF 27` | `CRF 31` |
| H.264 NVENC | `CQ 16` | `CQ 19` | `CQ 22` | `CQ 26` | `CQ 30` |
| VP9 | `CRF 26` | `CRF 29` | `CRF 32` | `CRF 35` | `CRF 39` |
| AVI MPEG-4 | `q:v 2` | `q:v 4` | `q:v 5` | `q:v 7` | `q:v 9` |
| OGV Theora | `q:v 9` | `q:v 8` | `q:v 7` | `q:v 6` | `q:v 5` |
| MPG MPEG-2 | `q:v 2` | `q:v 4` | `q:v 5` | `q:v 7` | `q:v 9` |

For H.264, VP9, AVI, and MPG, lower values usually preserve more detail. For Theora, higher `q:v` preserves more detail.

## Resolution rules

| Resolution | Behavior |
| --- | --- |
| `Source` | Keeps the native input resolution. In merge mode, the timeline inherits the first clip canvas. |
| `720p` | Normalizes the output to `1280 x 720` |
| `1080p` | Normalizes the output to `1920 x 1080` |
| `1440p` | Normalizes the output to `2560 x 1440` |
| `2160p` | Normalizes the output to `3840 x 2160` |

Fixed resolutions use a 16:9 canvas. Inputs are scaled to fit and padded when aspect ratios do not match the selected frame.

## Backend rules

| Backend | Behavior |
| --- | --- |
| `Auto` | Uses NVENC on supported H.264 containers when available, otherwise stays on CPU |
| `CPU` | Forces software encoding on every format |
| `NVIDIA NVENC` | Requests direct GPU encoding on `MP4`, `MOV`, `MKV`, and `FLV` only |

If NVENC is requested but unavailable, the app falls back to CPU instead of failing the job.

## Frame timing rules

| Mode | Behavior |
| --- | --- |
| `Preserve source timing` | Keeps original cadence and avoids intentional frame duplication or dropping |
| `Constant frame rate` | Normalizes output to a fixed fps and may duplicate or drop frames by design |

Available CFR targets are `24`, `25`, `30`, `48`, `50`, `60`, and `120` fps.

Use `Preserve source timing` unless the downstream target explicitly requires CFR.

## Practical recommendations

- Use `MP4 + Source + Auto + Balanced` for the safest general-purpose output.
- Use `MOV + Source + High` when the file is heading into an editing workflow.
- Use `MKV + 1080p + Master` for robust H.264 archive-style exports with a fixed delivery frame.
- Use `WebM + 720p + Web` only when VP9 delivery is actually required.
- Use `FLV`, `AVI`, `OGV`, or `MPG` only when the receiving system truly needs those containers.
