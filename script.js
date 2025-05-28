const trackColorPairs = [
  { track: 'audio/track1.mp3', color: '#c3fbb0' },
  { track: 'audio/track2.mp3', color: '#d8ccf7' },
  { track: 'audio/track3.mp3', color: '#ffbad4' },
  { track: 'audio/track4.mp3', color: '#ffe28a' },
  { track: 'audio/track5.mp3', color: '#ffa078' },
  { track: 'audio/track6.mp3', color: '#c1e1ff' },
  { track: 'audio/track7.mp3', color: '#abebe3' }
];

let playlist = [];
let currentAudio = null;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function playNext() {
  // Stop any current track
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  // Refill the playlist if empty
  if (playlist.length === 0) {
    playlist = shuffle(trackColorPairs);
  }

  const { track, color } = playlist.shift();
  document.getElementById('name').style.color = color;

  currentAudio = new Audio(track);

  // Auto-play the next track when this one ends
  currentAudio.addEventListener('ended', () => {
    playNext();
  });

  currentAudio.play().catch(err => {
    console.log("Playback error or autoplay blocked:", err);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  playNext();
});

document.addEventListener('click', () => {
  playNext();
});


