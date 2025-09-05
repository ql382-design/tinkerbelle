<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Enhanced Control Panel</title>
<script src="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/classic.min.css"/>
<script src="/socket.io/socket.io.js"></script>
<style>
  body { margin:0; height:100vh; transition: filter 2s ease; }
  .shake { animation: shake 0.2s linear infinite; }

  @keyframes shake {
    0% { transform: translate(2px,2px) rotate(0.5deg); }
    20% { transform: translate(-2px,2px) rotate(-0.5deg); }
    40% { transform: translate(-2px,-2px) rotate(0.8deg); }
    60% { transform: translate(2px,-2px) rotate(-0.8deg); }
    80% { transform: translate(2px,2px) rotate(0.5deg); }
    100% { transform: translate(0,0) rotate(0deg); }
  }

  #controlPanel {
    position: fixed; top: 10px; left: 10px;
    background: rgba(255,255,255,0.8); padding:10px; border-radius:8px;
    z-index:1000; font-family: sans-serif;
  }

  #controlPanel label, #controlPanel button { display:block; margin:5px 0; }
</style>
</head>
<body>

<div id="controlPanel">
  <div class="pickr"></div>
  <label>Shake Strength: <input type="range" id="shakeStrength" min="1" max="10" value="4"></label>
  <label>Shake Duration (ms): <input type="range" id="shakeDuration" min="200" max="5000" value="2000"></label>
  <label>Brightness (%) : <input type="range" id="brightness" min="50" max="150" value="130"></label>
  <div>
    <button id="lightMode">Light</button>
    <button id="mediumMode">Medium</button>
    <button id="strongMode">Strong</button>
  </div>
</div>

<script>
const socket = io();

// Default values
let SHAKE_STRENGTH = 4;
let SHAKE_DURATION = 2000;
let MAX_BRIGHTNESS = 130;

// Pickr color picker
const pickr = Pickr.create({
  el: '.pickr',
  theme: 'classic',
  showAlways: true,
  swatches: [
    'rgba(76, 175, 80, 1)', 'rgba(0, 0, 0, 1)',
    'rgba(244, 67, 54, 1)', 'rgba(156, 39, 176, 1)',
    'rgba(255, 255, 255, 1)'
  ],
  components: { preview: false, opacity: false, hue: true }
});

pickr.on('change', e => {
  const hex = e.toHEXA().toString();
  document.body.style.backgroundColor = hex;
  socket.emit('hex', hex);
  triggerBrightnessAndShake();
});

// Socket listener for remote hex updates
socket.on('hex', val => {
  document.body.style.backgroundColor = val;
  triggerBrightnessAndShake();
});

// Shake CSS updater
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

// Trigger shake with brightness fade
function triggerBrightnessAndShake() {
  document.body.style.transition = `filter 1s ease`;
  document.body.style.filter = "brightness(20%)";

  setTimeout(() => {
    document.body.style.filter = `brightness(${MAX_BRIGHTNESS}%)`;
    setTimeout(() => {
      document.body.classList.add('shake');
      setTimeout(() => document.body.classList.remove('shake'), SHAKE_DURATION);
    }, 200);
  }, 100);
}

// Input sliders for dynamic control
document.getElementById('shakeStrength').addEventListener('input', e => {
  SHAKE_STRENGTH = parseInt(e.target.value);
  updateShakeCSS();
});
document.getElementById('shakeDuration').addEventListener('input', e => {
  SHAKE_DURATION = parseInt(e.target.value);
});
document.getElementById('brightness').addEventListener('input', e => {
  MAX_BRIGHTNESS = parseInt(e.target.value);
});

// Quick mode buttons
document.getElementById('lightMode').onclick = () => { SHAKE_STRENGTH=2; SHAKE_DURATION=1200; MAX_BRIGHTNESS=110; updateShakeCSS(); triggerBrightnessAndShake(); };
document.getElementById('mediumMode').onclick = () => { SHAKE_STRENGTH=4; SHAKE_DURATION=2000; MAX_BRIGHTNESS=130; updateShakeCSS(); triggerBrightnessAndShake(); };
document.getElementById('strongMode').onclick = () => { SHAKE_STRENGTH=6; SHAKE_DURATION=3000; MAX_BRIGHTNESS=150; updateShakeCSS(); triggerBrightnessAndShake(); };

// Initialize CSS
updateShakeCSS();
</script>

</body>
</html>
