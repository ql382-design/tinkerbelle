<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Color Control with Shake Effect</title>

<!-- Pickr Color Picker -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/classic.min.css"/>
<script src="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js"></script>

<style>
  body { 
    margin:0; height:100vh; 
    transition: filter 2s ease; 
    font-family:sans-serif; 
    background:#222; /* Default dark background */
  }
  .shake { animation: shake 0.2s linear infinite; }

  /* Default shake keyframes */
  @keyframes shake {
    0% { transform: translate(2px,2px) rotate(0.5deg); }
    20% { transform: translate(-2px,2px) rotate(-0.5deg); }
    40% { transform: translate(-2px,-2px) rotate(0.8deg); }
    60% { transform: translate(2px,-2px) rotate(-0.8deg); }
    80% { transform: translate(2px,2px) rotate(0.5deg); }
    100% { transform: translate(0,0) rotate(0deg); }
  }

  /* Control Panel */
  #controlPanel {
    position: fixed; 
    top: 10px; 
    left: 10px;
    background: rgba(255,255,255,0.9); 
    padding:15px; 
    border-radius:8px;
    z-index:1000;
    width: 220px;
  }
  #controlPanel label { display:block; margin:10px 0 5px; font-size:14px; }
  #controlPanel input[type=range] { width: 100%; }
  #controlPanel button { margin:5px 2px; padding:5px 10px; }
</style>
</head>
<body>

<!-- Control Panel -->
<div id="controlPanel">
  <p><b>Control Panel</b></p>
  
  <!-- Color Picker -->
  <div class="pickr"></div>

  <!-- Sliders -->
  <label>Shake Strength</label>
  <input type="range" id="shakeStrength" min="1" max="10" value="4">

  <label>Brightness (%)</label>
  <input type="range" id="brightness" min="50" max="150" value="130">

  <!-- Quick buttons -->
  <div>
    <button id="lightMode">Light</button>
    <button id="mediumMode">Medium</button>
    <button id="strongMode">Strong</button>
  </div>
</div>

<script>
// =========================
// Default values
// =========================
let SHAKE_STRENGTH = 4;
let SHAKE_DURATION = 10000;  // Fixed 10 seconds
let MAX_BRIGHTNESS = 130;

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
  components: { preview:false, opacity:false, hue:true }
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
// Trigger brightness flash + shake
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

      // Stop shaking after SHAKE_DURATION
      setTimeout(() => document.body.classList.remove('shake'), SHAKE_DURATION);
    }, 200);

  }, 100);
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
  SHAKE_STRENGTH=2; MAX_BRIGHTNESS=110;
  updateShakeCSS(); triggerBrightnessAndShake();
};
document.getElementById('mediumMode').onclick = () => {
  SHAKE_STRENGTH=4; MAX_BRIGHTNESS=130;
  updateShakeCSS(); triggerBrightnessAndShake();
};
document.getElementById('strongMode').onclick = () => {
  SHAKE_STRENGTH=6; MAX_BRIGHTNESS=150;
  updateShakeCSS(); triggerBrightnessAndShake();
};

// =========================
// Initialize with default shake settings
// =========================
updateShakeCSS();
</script>

</body>
</html>
