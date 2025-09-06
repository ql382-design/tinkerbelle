const control = document.getElementById('control');
const light = document.getElementById('light');
const play = document.getElementById('play');
const pause = document.getElementById('pause');
const audioIn = document.getElementById('audioIn');
const audio = new Audio();
let pickr;

const socket = io();

// --- Wine audio and button ---
const wineAudio = new Audio("/static/wine.mp3"); // load wine.mp3
const wineBtn = document.getElementById("wineBtn"); // button in index.html

socket.on('connect', () => {
  socket.on('hex', (val) => { document.body.style.backgroundColor = val })
  socket.on('audio', (val) => { getSound(encodeURI(val)); })
  socket.on('pauseAudio', (val) => { audio.pause(); })
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
});

// ========== Utility: trigger shake ==========
function triggerShake(duration = 300) {
  document.body.classList.add('shake');
  setTimeout(() => document.body.classList.remove('shake'), duration);
}

// Controller mode
control.onclick = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(console.error);
  }
  document.getElementById('user').classList.remove('fadeOut');
  document.getElementById('controlPanel').style.opacity = 0.6;
  if (!pickr) {
    pickr = Pickr.create({
      el: '.pickr',
      theme: 'classic',
      showAlways: true,
      swatches: [
        'rgba(76, 175, 80, 1)',
        'rgba(0, 0, 0, 1)',
        'rgba(244, 67, 54, 1)',
        'rgba(0, 0, 0, 1)',
        'rgba(156, 39, 176, 1)',
        'rgba(244, 67, 54, 1)',
        'rgba(0, 0, 0, 1)',
        'rgba(255, 255, 255, 1)',
        'rgba(244, 67, 54, 1)',
        'rgba(0, 0, 0, 1)',  
      ],
      components: { preview: false, opacity: false, hue: true },
    });

    pickr.on('change', (e) => {
      const hexCode = e.toHEXA().toString();
      document.body.style.backgroundColor = hexCode;
      socket.emit('hex', hexCode)
    });
  }
};

// Light mode
light.onclick = () => {
  audio.muted = true;
  audio.play().then(() => { audio.muted = false });

  document.documentElement.requestFullscreen();
  document.getElementById('user').classList.add('fadeOut');
  if (pickr) {
    pickr.destroyAndRemove();
    document.getElementById('controlPanel').append(
      Object.assign(document.createElement('div'), { className: 'pickr' })
    );
    pickr = undefined;
  }
  document.getElementById('controlPanel').style.opacity = 0;

  // Always shake on click
  triggerShake(500);

  // Try to enable gyroscope for iOS
  enableGyro();
};

// Audio functions
const getSound = (query, loop = false, random = false) => {
  const url = `https://freesound.org/apiv2/search/text/?query=${query}+"&fields=name,previews&token=U5slaNIqr6ofmMMG2rbwJ19mInmhvCJIryn2JX89&format=json`;
  fetch(url)
    .then((response) => response.clone().text())
    .then((data) => {
      data = JSON.parse(data);
      if (data.results.length >= 1) {
        var src = random ? choice(data.results).previews['preview-hq-mp3'] : data.results[0].previews['preview-hq-mp3'];
        audio.src = src;
        audio.play();
      }
    })
    .catch(console.log);
};

play.onclick = () => {
  socket.emit('audio', audioIn.value)
  getSound(encodeURI(audioIn.value));

  // Shake on play
  triggerShake(300);
};
pause.onclick = () => {
  socket.emit('pauseAudio', audioIn.value)
  audio.pause();
};
audioIn.onkeyup = (e) => { if (e.keyCode === 13) { play.click(); } };

// --- Wine button click ---
wineBtn.onclick = () => {
  wineAudio.currentTime = 0;
  wineAudio.play();
  triggerShake(5000); // 5 seconds shake
};

// ========== Extra Features ==========

// Shake CSS animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
  0% { transform: translate(2px, 2px); }
  25% { transform: translate(-2px, 2px); }
  50% { transform: translate(-2px, -2px); }
  75% { transform: translate(2px, -2px); }
  100% { transform: translate(0, 0); }
}
.shake { animation: shake 0.3s linear; }
`;
document.head.appendChild(style);

// Enable gyroscope (iOS permission if needed)
function enableGyro() {
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    // iOS Safari
    DeviceMotionEvent.requestPermission()
      .then(state => {
        if (state === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      })
      .catch(console.error);
  } else {
    // Android / Desktop
    window.addEventListener('deviceorientation', handleOrientation);
  }
}

// Orientation handler: brightness + shake
function handleOrientation(event) {
  const tilt = Math.abs(event.gamma || 0);
  const brightness = Math.min(100, 50 + tilt);
  document.body.style.filter = `brightness(${brightness}%)`;

  if (tilt > 20) {
    triggerShake(300);
  }
}
