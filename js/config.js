// Personalization — edit ONLY this file to make the card your own.
// Why: keeps content separate from logic so non-devs can gift-customize.
window.CONFIG = {
  // Gate: recipient types this to unlock. Share it with them separately.
  password: "iloveyou",

  recipientName: "Bestie",        // shown on the intro screen
  senderName: "Me",               // signed at the bottom of the letter

  // Intro question screen
  intro: "Hey! I made something for you,\ndo you wanna see it?",

  // Handwritten letter (\n = new paragraph). Keep it heartfelt, keep it yours.
  letter: [
    "Happy Birthday!!",
    "I hope this year brings you everything you've been wishing for — happiness, success, peace, good health, and countless reasons to smile. Never forget how amazing, kind, and loved you are.",
    "No matter where life takes us, I hope we always stay this close and keep making memories together. Thank you for being the wonderful person you are and for making my life brighter every single day.",
    "Have the happiest birthday, and may all the good things you've been waiting for finally find you.",
  ],

  // "Moments of us" gallery. Drop images in assets/photos/ and list them here.
  // Empty list -> pretty pastel placeholder tiles are shown instead.
  photos: [
    // "assets/photos/1.jpg", "assets/photos/2.jpg", ...
  ],

  // Song. Paste a YouTube video ID (the part after v=) OR a local mp3 path.
  song: {
    title: "Count on Me",
    artist: "Bruno Mars",
    youtubeId: "cD-fLbGYME8", // Bruno Mars – Count on Me (lyric)
    mp3: "",                   // e.g. "assets/song.mp3" — takes priority if set
    lyric: "You can count on me like 1, 2, 3…",
  },

  // Closing blessing
  blessing: "May all the good things you've been\nwaiting for finally find you 💖",
};
