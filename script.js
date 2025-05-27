const colors = [
  '#c3fbb0', '#d8ccf7', '#ffbad4',
  '#ffe28a', '#ffa078', '#c1e1ff', '#abebe3'
];

const tracks = [
  'audio/track1.mp3', 'audio/track2.mp3', 'audio/track3.mp3',
  'audio/track4.mp3', 'audio/track5.mp3', 'audio/track6.mp3',
  'audio/track7.mp3'
];

let playlist = [];
let currentAudio = null;

// Fisher-Yates shuffle
function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function playRandom() {
  const color = colors[Math.floor(Math.random() * colors.length)];
  document.getElementById('name').style.color = color;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  if (playlist.length === 0) playlist = shuffle(tracks);

  currentAudio = new Audio(playlist.shift());
  currentAudio.play().catch(err => {
    console.log("Autoplay blocked or error:", err);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  playRandom();
});

document.addEventListener('click', () => {
  playRandom();
});
