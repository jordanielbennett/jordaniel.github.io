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
      cursor: pointer;
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
      transition: color 0.5s ease; /* Makes the text color change smoothly */
      animation: pulse 2s infinite ease-in-out; /* Hint to make user click */
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
      50% { opacity: 1; transform: translate(-50%, -50%) scale(1.03); }
    }
  </style>
</head>
<body>
  <canvas id="visualizer"></canvas>
  <div id="name" style="color: #ffffff;">jordaniel</div>

  <script>
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

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

    // --- NEW: IMMEDIATE COLOR ASSIGNMENT ---
    // This picks a random color from your array right away on page load
    const initialPair = trackColorPairs[Math.floor(Math.random() * trackColorPairs.length)];
    document.getElementById('name').style.color = initialPair.color;
    // ----------------------------------------

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

      currentAudio.addEventListener('ended', playNext);
      animate();
    }

    function playNext() {
      // Remove the pulsing animation class once the user starts the music experience
      document.getElementById('name').style.animation = 'none';

      if (!audioContext) {
        initAudio();
      }

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      if (playlist.length === 0) {
        playlist = shuffle(trackColorPairs);
      }

      const { track, color } = playlist.shift();
      document.getElementById('name').style.color = color;

      currentAudio.src = track;
      currentAudio.load();
      
      currentAudio.play().catch(err => {
        console.log("Playback error:", err);
      });
    }

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

    document.addEventListener('click', playNext);
  </script>
</body>
</html>
