<script>
const socket = io();

// 
let SHAKE_STRENGTH = 4;
let SHAKE_DURATION = 10000;  // 固定10秒
let MAX_BRIGHTNESS = 130;

//  Pickr
const pickr = Pickr.create({
  el: '.pickr',
  theme: 'classic',
  showAlways: true,
  swatches: ['rgba(76, 175, 80, 1)', 'rgba(0, 0, 0, 1)', 'rgba(244, 67, 54, 1)', 'rgba(156, 39, 176, 1)', 'rgba(255, 255, 255, 1)'],
  components: { preview:false, opacity:false, hue:true }
});

pickr.on('change', e => {
  const hex = e.toHEXA().toString();
  document.body.style.backgroundColor = hex;
  socket.emit('hex', hex);
  triggerBrightnessAndShake();
});

// 
socket.on('hex', val => {
  document.body.style.backgroundColor = val;
  triggerBrightnessAndShake();
});

// 
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

//  shake CSS
updateShakeCSS();
</script>
