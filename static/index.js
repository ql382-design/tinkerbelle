const control = document.getElementById('control');
const light = document.getElementById('light');
let pickr;

// Default effect settings
let FADE_DURATION = 2000;   // ms
let SHAKE_DELAY = 1000;     // ms before shake starts
let SHAKE_DURATION = 2000;  // ms how long shake lasts
let SHAKE_STRENGTH = 4;     // px / degrees

const socket = io();

socket.on('connect', () => {
  // Change background color when receiving "hex" from server
  socket.on('hex', (val) => { 
    document.body.style.backgroundColor = val;
    triggerBrightnessAndShake();
  });

  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
});

// Controller mode
control.onclick = () => {
  console.log('control');

  if (document.fullscreenElement) {
    document.exitFullscreen()
      .then(() => console.log('exited full screen mode'))
      .catch((err) => console.error(err));
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
      components: {
        preview: false,
        opacity: false,
        hue: true,
      },
    });

    pickr.on('change', (e) => {
      const hexCode = e.toHEXA().toString();
      document.body.style.backgroundColor = hexCode;
      socket.emit('hex', hexCode);
      triggerBrightnessAndShake();
    });
  }
};

// Light mode
light.onclick = () => {
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
};

// Brightness + shake sequence
function triggerBrightnessAndShake() {
  document.body.style.transition = `filter ${FADE_DURATION}ms ease`;
  document.body.style.filter = "brightness(20%)";

  setTimeout(() => {
    document.body.style.filter = "brightness(130%)"; // strong bright effect
    setTimeout(() => {
      triggerShake();
    }, SHAKE_DELAY);
  }, 100);
}

// Shake effect
function triggerShake() {
  document.body.classList.add('shake');
  setTimeout(() => document.body.classList.remove('shake'), SHAKE_DURATION);
}

// Dynamic CSS for shake
function updateShakeCSS() {
  const oldStyle = document.getElementById('shake-style');
  if (oldStyle) oldStyle.remove();

  const style = document.createElement('style');
  style.id = 'shake-style';
  style.innerHTML = `
  @keyframes shake {
    0% { transform: translate(${SHAKE_STRENGTH}px, ${SHAKE_STRENGTH}px) rotate(0.5deg); }
    20% { transform: translate(-${SHAKE_STRENGTH}px, ${SHAKE_STRENGTH}px) rotate(-0.5deg); }
    40% { transform: translate(-${SHAKE_STRENGTH}px, -${SHAKE_STRENGTH}px) rotate(0.8deg); }
    60% { transform: translate(${SHAKE_STRENGTH}px, -${SHAKE_STRENGTH}px) rotate(-0.8deg); }
    80% { transform: translate(${SHAKE_STRENGTH}px, ${SHAKE_STRENGTH}px) rotate(0.5deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  .shake {
    animation: shake 0.2s linear infinite;
  }
  `;
  document.head.appendChild(style);
}

// Initialize shake CSS
updateShakeCSS();

// --- Enhanced Keyboard Control ---
// Hotkeys: 1 = light, 2 = medium, 3 = strong
window.addEventListener('keydown', (e) => {
  if (e.key === '1') {
    FADE_DURATION = 1000;
    SHAKE_DELAY = 500;
    SHAKE_DURATION = 1200;
    SHAKE_STRENGTH = 2;
    updateShakeCSS();
    console.log("Effect set to LIGHT");
  } else if (e.key === '2') {
    FADE_DURATION = 2000;
    SHAKE_DELAY = 1000;
    SHAKE_DURATION = 2000;
    SHAKE_STRENGTH = 4;
    updateShakeCSS();
    console.log("Effect set to MEDIUM");
  } else if (e.key === '3') {
    FADE_DURATION = 3000;
    SHAKE_DELAY = 1500;
    SHAKE_DURATION = 3000;
    SHAKE_STRENGTH = 6;
    updateShakeCSS();
    console.log("Effect set to STRONG");
  } else if (e.key === 'r') {
    // optional: random color trigger
    const randomColor = `hsl(${Math.floor(Math.random()*360)}, 70%, 60%)`;
    document.body.style.backgroundColor = randomColor;
    socket.emit('hex', randomColor);
    triggerBrightnessAndShake();
  }
});
