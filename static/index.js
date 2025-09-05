const control = document.getElementById('control');
const light = document.getElementById('light');
let pickr;

const socket = io();

// Default effect settings (can be updated by hotkeys)
let FADE_DURATION = 2000;   // ms
let SHAKE_DELAY = 1000;     // ms
let SHAKE_DURATION = 800;   // ms
let SHAKE_STRENGTH = 3;     // px and degrees

socket.on('connect', () => {
  // Change background color when receiving "hex" from server
  socket.on('hex', (val) => { 
    document.body.style.backgroundColor = val;
    triggerBrightnessAndShake(); // Trigger effect on color change
  });

  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
});

// Enter controller mode
control.onclick = () => {
  console.log('control');
  // Exit fullscreen if active
  if (document.fullscreenElement) {
    document.exitFullscreen()
      .then(() => console.log('exited full screen mode'))
      .catch((err) => console.error(err));
  }

  // Show controls
  document.getElementById('user').classList.remove('fadeOut');
  document.getElementById('controlPanel').style.opacity = 0.6;

  // Initialize color picker if not already created
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

    // When color changes, update background and notify server
    pickr.on('change', (e) => {
      const hexCode = e.toHEXA().toString();
      document.body.style.backgroundColor = hexCode;
      socket.emit('hex', hexCode);
      triggerBrightnessAndShake(); // effect on local change
    });
  }
};

// Enter light mode (fullscreen and hide controls)
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

// Brightness + shake combined effect
function triggerBrightnessAndShake() {
  // Step 1: darken the screen
  document.body.style.transition = `filter ${FADE_DURATION}ms ease`;
  document.body.style.filter = "brightness(20%)";

  // Step 2: brighten the screen gradually
  setTimeout(() => {
    document.body.style.filter = "brightness(130%)"; // stronger brightness

    // Step 3: after delay, trigger shake
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

// Add CSS animation for shake effect (strength will be dynamic)
const style = document.createElement('style');
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

// Hotkeys for quick adjustment
window.addEventListener('keydown', (e) => {
  if (e.key === '1') {
    // Light effect
    FADE_DURATION = 1000;
    SHAKE_DELAY = 500;
    SHAKE_DURATION = 600;
    SHAKE_STRENGTH = 2;
    console.log("Effect set to LIGHT");
  } else if (e.key === '2') {
    // Medium effect
    FADE_DURATION = 2000;
    SHAKE_DELAY = 1000;
    SHAKE_DURATION = 1000;
    SHAKE_STRENGTH = 4;
    console.log("Effect set to MEDIUM");
  } else if (e.key === '3') {
    // Strong effect
    FADE_DURATION = 3000;
    SHAKE_DELAY = 2000;
    SHAKE_DURATION = 1500;
    SHAKE_STRENGTH = 6;
    console.log("Effect set to STRONG");
  }
});
