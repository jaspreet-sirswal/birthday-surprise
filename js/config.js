// Personalization — edit ONLY this file to make the card your own.
// Why: keeps content separate from logic so non-devs can gift-customize.
window.CONFIG = {
  // Gate: recipient types this to unlock. Share it with them separately.
  password: "24042001",

  recipientName: "Ayushi",              // shown throughout
  senderName: "Jaspreet",               // signed at the bottom of the letter

  // Cinematic splash (first thing she sees)
  splashLine: "For Ayushi",             // rendered in romantic script
  splashSub: "a little something made with love — tap to open 💌",

  // Typewriter line on the intro screen (before the Yes/No question)
  typeLine: "Hey Ayushi… I made something just for you 💛",
  intro: "do you wanna see it?",

  // Handwritten letter (each entry = one paragraph).
  letter: [
    "Happy Birthday, my love 💗",
    "From the moment you came into my life, every ordinary day started feeling like something worth remembering. You make me laugh, you make me softer, and somehow you make everything better just by being you.",
    "I hope this year brings you everything you've been wishing for — happiness, success, peace, and a hundred reasons to smile. And through all of it, I'll be right here, cheering the loudest.",
    "Thank you for being mine, and for letting me be yours. Here's to more sunsets, more silly fights, more chai, and more us.",
    "Happy Birthday, Ayushi. I love you — today, tomorrow, and always.",
  ],

  // "Moments of us" gallery. captions[i] pairs with photos[i] (optional).
  photos: [
    "assets/photos/01.jpg", "assets/photos/02.jpg", "assets/photos/03.jpg", "assets/photos/04.jpg",
    "assets/photos/05.jpg", "assets/photos/06.jpg", "assets/photos/07.jpg", "assets/photos/08.jpg",
    "assets/photos/09.jpg", "assets/photos/10.jpg", "assets/photos/11.jpg", "assets/photos/12.jpg",
    "assets/photos/13.jpg", "assets/photos/14.jpg", "assets/photos/15.jpg", "assets/photos/16.jpg",
  ],
  captions: [], // e.g. ["our first trip ✨", "you + sunsets", ...] — leave empty to skip

  // 💕 "Reasons I love you" — she reveals these one by one.
  reasons: [
    "The way your eyes light up when you talk about something you love.",
    "How you make even a boring day feel like an adventure.",
    "Your laugh — it's my favourite sound in the whole world.",
    "The way you care about people so deeply and so quietly.",
    "How safe and at home you make me feel.",
    "That you chose me, every single day.",
  ],

  // Song. YouTube video ID OR a local mp3 path (mp3 wins if set).
  song: {
    title: "Count on Me",
    artist: "Bruno Mars",
    youtubeId: "6k8cpUkKK4c",
    mp3: "",
    lyric: "You can count on me like 1, 2, 3… 💫",
  },

  // Grand finale
  finaleTitle: "I love you, Ayushi 💗",
  finaleSub: "Happy Birthday, my forever.",
};
