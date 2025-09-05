// =========================
// Default values
// =========================
let SHAKE_STRENGTH = 4;
let SHAKE_DURATION = 10000;  // default shake effect duration in ms
let MAX_BRIGHTNESS = 130;

// =========================
// Initialize Audio
// =========================
const shakeAudio = new Audio('wine-glass-clink-36036.mp3');

// =========================
// Initialize Pickr color picker
// =========================
const pickr = Pickr.create({
  el: '.pickr',
  theme: 'classic',
  showAlways: true,
  swatches: [
    'rgba(76, 175, 80, 1)',   // Green
    'rgba(0, 0, 0, 1)',       // Black
    'rgba(244, 67, 54, 1)',   // Red
    'rgba(156, 39, 176, 1)',  // Purple
    'rgba(255, 255, 255, 1)'  // White
  ],
  components: { preview: false, opacity: false, hue: true }
});

// When color is changed → update background + trigger effect
pickr.on('change', e => {
  const hex = e.toHEXA().toString();
  document.body.style.backgroundColor = hex;
  triggerBrightnessAndShake();
});

// =========================
// Update shake animation CSS dynamically
// =========================
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
      100% { transform: translate(0,0) rotate(0deg); }
    }
    .shake { animation: shake 0.2s linear infinite; }
  `;
  document.head.appendChild(style);
}

// =========================
// Trigger brightness flash + shake + audio
// =========================
function triggerBrightnessAndShake() {
  // Darken first
  document.body.style.transition = `filter 1s ease`;
  document.body.style.filter = "brightness(20%)";

  // Brighten again
  setTimeout(() => {
    document.body.style.filter = `brightness(${MAX_BRIGHTNESS}%)`;

    // Start shaking
    setTimeout(() => {
      document.body.classList.add('shake');

      // Play shake sound
      shakeAudio.currentTime = 0;
      shakeAudio.play();

      // Stop shaking after SHAKE_DURATION
      setTimeout(() => document.body.classList.remove('shake'), SHAKE_DURATION);
    }, 200);

  }, 100);
}

// =========================
// Infinite shake control
// =========================
function startShaking() {
  document.body.classList.add("shake");
  shakeAudio.currentTime = 0;
  shakeAudio.play();
}
function stopShaking() {
  document.body.classList.remove("shake");
}

// =========================
// Slider event listeners
// =========================
document.getElementById('shakeStrength').addEventListener('input', e => {
  SHAKE_STRENGTH = parseInt(e.target.value);
  updateShakeCSS();
});
document.getElementById('brightness').addEventListener('input', e => {
  MAX_BRIGHTNESS = parseInt(e.target.value);
});

// =========================
// Quick mode buttons
// =========================
document.getElementById('lightMode').onclick = () => {
  SHAKE_STRENGTH = 2; MAX_BRIGHTNESS = 110;
  updateShakeCSS(); triggerBrightnessAndShake();
};
document.getElementById('mediumMode').onclick = () => {
  SHAKE_STRENGTH = 4; MAX_BRIGHTNESS = 130;
  updateShakeCSS(); triggerBrightnessAndShake();
};
document.getElementById('strongMode').onclick = () => {
  SHAKE_STRENGTH = 6; MAX_BRIGHTNESS = 150;
  updateShakeCSS(); triggerBrightnessAndShake();
};

// =========================
// Initialize with default shake settings
// =========================
updateShakeCSS();
