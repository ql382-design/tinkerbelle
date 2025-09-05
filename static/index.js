const control = document.getElementById('control');
const light = document.getElementById('light');
let pickr;

const socket = io();

socket.on('connect', () => {
  // Change background color when receiving "hex" from server
  socket.on('hex', (val) => { 
    document.body.style.backgroundColor = val;
    triggerShake(); // Trigger shake effect on color change
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
      triggerShake(); // Shake effect on local color change
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

// Function to trigger screen shake effect
function triggerShake() {
  document.body.classList.add('shake');
  setTimeout(() => document.body.classList.remove('shake'), 300);
}

// Add CSS animation for shake effect
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
  0% { transform: translate(2px, 2px); }
  25% { transform: translate(-2px, 2px); }
  50% { transform: translate(-2px, -2px); }
  75% { transform: translate(2px, -2px); }
  100% { transform: translate(0, 0); }
}
.shake {
  animation: shake 0.3s linear;
}
`;
document.head.appendChild(style);
