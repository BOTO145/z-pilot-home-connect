# Z-Pilot UI

> Talk to your home. Voice-first AI interface for Z-Pilot server.

```
         ◉  Z-Pilot
      AI Assistant
         00:42

  ┌─────────────────────┐
  │  "Turn on the light"│
  └─────────────────────┘
     ✦ Done. Light is on.

  [🎤]  [🔊]  [📎]  [📵]
```

---

## What it is

A calling-style web app that connects to your [Z-Pilot server](../zpilot/) over Tailscale.
Open it, tap **Call**, and talk to your home AI — voice in, voice out.
Ask it to control lights, fans, doors, or pull up a live ESP32-CAM feed.

---

## Stack

| | |
|---|---|
| Framework | Vite + React 18 |
| Styling | Raw CSS — no Tailwind, no UI lib |
| Voice | Web Speech API (browser-native) |
| Transport | `fetch()` — no axios |
| Fonts | DM Sans + JetBrains Mono |

---

## Quick start

```bash
git clone <your-repo>
cd zpilot-ui

npm install

cp .env.example .env
# → set VITE_SERVER_URL to your Tailscale URL

npm run dev
# → http://localhost:5173
```

---

## Environment

```bash
# .env
VITE_SERVER_URL=https://zpilot.tail1234.ts.net
```

Replace `zpilot.tail1234.ts.net` with your actual Tailscale machine URL.
For local dev only: `http://localhost:8000`

---

## How it works

```
You speak
   │
   ▼
Web Speech API (browser)
   │  transcript
   ▼
POST /chat  ──────────────────────▶  Z-Pilot Server (FastAPI)
                                            │
                                            ▼
                                       Groq LLM
                                            │
                              ┌─────────────┴─────────────┐
                              │                           │
                         text reply                  action block
                              │                           │
                              ▼                     ┌─────┴──────┐
                        AI bubble               gpio │            │ cam
                                                     ▼            ▼
                                              ESP32 HTTP    open proxy
                                              pin toggle    stream URL
```

**Camera streams never reach the AI.** When you say "show me the garage", the server returns a proxy URL — the browser opens it directly as an `<img>` tag. The LLM sees nothing.

---

## Screens

| Screen | Trigger |
|--------|---------|
| **Idle** | App opens — shows avatar + Call button |
| **Calling** | Call button tapped — server health check passes |
| **Ended** | Hang up tapped — shows duration, returns to Idle after 2s |

---

## Controls

| Button | Action |
|--------|--------|
| 🎤 Mic | Tap to start listening · tap again to send · pulse ring = active |
| 🔊 Speaker | Toggle speaker on/off |
| 📎 Image | Attach a photo — sent with your next voice message |
| 📵 Hang up | End call, return to idle |

---

## Live cam stream

When the AI opens a camera feed, an overlay slides up:

```
┌─────────────────────────────┐
│  Live View: Garage        ✕ │
├─────────────────────────────┤
│                             │
│   < MJPEG feed via proxy >  │
│                             │
├─────────────────────────────┤
│  ▶ LIVE        ⇌ Streaming  │
└─────────────────────────────┘
```

The stream goes through the server proxy (`/cam-stream/<device_id>`) to avoid
mixed-content and CORS issues when accessing LAN cameras over Tailscale HTTPS.

---

## Project structure

```
zpilot-ui/
├── index.html
├── vite.config.js
├── .env.example
└── src/
    ├── App.jsx               ← screen state machine
    ├── App.css               ← CSS variables + global styles
    ├── screens/
    │   ├── IdleScreen.jsx    ← avatar + call button
    │   ├── CallingScreen.jsx ← active call UI
    │   └── EndedScreen.jsx   ← call ended + duration
    ├── components/
    │   ├── Avatar.jsx
    │   ├── CallTimer.jsx     ← mm:ss counter
    │   ├── ChatFeed.jsx      ← message bubbles
    │   ├── CamOverlay.jsx    ← MJPEG stream overlay
    │   ├── ControlBar.jsx    ← 4 bottom buttons
    │   └── GpioCard.jsx      ← inline GPIO result card
    └── hooks/
        ├── useSpeech.js      ← Web Speech API wrapper
        └── useApi.js         ← fetch wrappers + camStreamUrl()
```

---

## Server

This app talks to the **Z-Pilot FastAPI server**.
See [`../zpilot/README.md`](../zpilot/README.md) for setup.

Required endpoints:

```
GET  /health                     → server alive check
POST /chat                       → main AI endpoint
GET  /devices                    → list ESP32 devices
POST /gpio                       → direct GPIO control
GET  /cam-stream/:device_id      → MJPEG proxy
```

---

## Browser support

| Browser | Voice input |
|---------|------------|
| Chrome / Edge | ✅ Full support |
| Safari (iOS 17+) | ✅ Works |
| Firefox | ⚠️ No Web Speech API — mic button hidden |

---

## License

MIT
