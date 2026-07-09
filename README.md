# 💌 Birthday Surprise

An interactive, password-gated birthday microsite — a rebuild of the "midnight surprise" card as a real, self-hostable static site. No build step, no framework, no tracking.

## Flow
Password gate → "Hey! I made something for you" (Yes/No) → click 3 items:
- 📷 **Camera** → a "Memories" photo gallery
- ✉️ **Envelope** → a handwritten letter
- 📼 **Cassette** → your song (YouTube or mp3)

→ closing blessing + confetti.

## Make it yours
Edit **`js/config.js`** only:
- `password` — what the recipient types to unlock (share it separately).
- `recipientName`, `senderName`, `intro`, `letter[]`, `blessing`.
- `photos[]` — drop images in `assets/photos/` and list their paths (empty ⇒ pastel placeholders).
- `song` — a YouTube `youtubeId` **or** a local `mp3` path.

## Run locally
```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

## Deploy (free)
Push to GitHub → **Settings → Pages → Deploy from branch → `main` / root**. Send the link + password.

## Notes
- Placeholder emoji stand in for the original's copyrighted dog photos — swap in your own images.
- Fonts (Chewy / Fredoka / Caveat) load from Google Fonts.
