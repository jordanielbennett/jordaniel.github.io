<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>jordaniel</title>
  <link rel="stylesheet" href="style.css">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <style>
    body {
      margin: 0;
      background-color: #1a1a1a;
      overflow: hidden;
      cursor: pointer; /* Gives a visual cue that the page is clickable */
    }
    canvas {
      position: absolute;
      top: 0;
      left: 0;
    }
    #name {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 5em;
      font-weight: bold;
      text-transform: lowercase;
      font-family: Helvetica, Arial, sans-serif;
      user-select: none;
      pointer-events: none;
      mix-blend-mode: difference;
      color: #ffffff; /* Default starting color */
    }
  </style>
</head>
<body>
  <canvas id="visualizer"></canvas>
  <div id="name">jordaniel</div>

  <script>
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // FIXED: Cleaned up array, completely deleted old tracks, no broken trailing commas
    const trackColorPairs = [
      { track: 'audio/track1.mp3', color: '#c3fbb0' },
      { track: 'audio/track2.mp3', color: '#d8ccf7' },
      { track: 'audio/track3.mp3', color: '#ffbad4' },
      { track: 'audio/track4.mp3', color: '#ffe28a' },
      { track: 'audio/track5.mp3', color: '#ffa078' }
    ];

    let playlist = [];
    let currentAudio = null;
    let audioContext = null;
    let analyser = null;
    let dataArray = null;

    function shuffle(array) {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    // Initialize Audio Graph ONCE on the very first user click
    function initAudio() {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      currentAudio = new Audio();
      currentAudio.crossOrigin = "anonymous";

      const src = audioContext.createMediaElementSource(currentAudio);
      analyser = audioContext.createAnalyser();

      src.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 256;

      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      // Automatically advance when song ends
      currentAudio.addEventListener('ended', playNext);

      // Kick off the visualizer loop
      animate();
    }

    function playNext() {
      // 1. Build the audio elements on first click if they don't exist yet
      if (!audioContext) {
        initAudio();
      }

      // 2. Bypass browser autoplay restrictions safely
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // 3. Handle playlist shuffling
      if (playlist.length === 0) {
        playlist = shuffle(trackColorPairs);
      }

      const { track, color } = playlist.shift();
      document.getElementById('name').style.color = color;

      // 4. Update the track source smoothly without breaking Web Audio nodes
      currentAudio.src = track;
      currentAudio.load();
      
      currentAudio.play().catch(err => {
        console.log("Playback error:", err);
      });
    }

    // Visualizer drawing loop
    function animate() {
      requestAnimationFrame(animate);
      if (!analyser) return;

      analyser.getByteFrequencyData(dataArray);
      const bufferLength = analyser.frequencyBinCount;

      ctx.fillStyle = 'rgba(26, 26, 26, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < bufferLength; i++) {
        const radius = dataArray[i] * 1.2;
        const angle = i * (Math.PI * 2 / bufferLength);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (Math.hypot(x - centerX, y - centerY) < 10) continue;

        ctx.beginPath();
        ctx.arc(x, y, 3 + Math.sin(Date.now() * 0.002 + i) * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${i * 5 + Date.now() * 0.01}, 80%, 70%)`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // FIXED: Removed DOMContentLoaded autoplay attempt. 
    // Website now safely waits for the user to click anywhere to start or skip songs.
    document.addEventListener('click', playNext);
  </script>
</body>
</html>
