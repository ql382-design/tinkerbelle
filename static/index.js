// Get the button element and create audio object
const startBtn = document.getElementById('startShake');
const sound = new Audio('static/wine-glass-clink-36036.mp3'); // Make sure the path is correct
sound.volume = 1.0;

// Add shake animation CSS to the document
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
  animation: shake 0.3s linear infinite; /* infinite shake loop */
}
`;
document.head.appendChild(style);

// Function to start screen shake and play sound
function startShake(duration = 10000) { // duration in milliseconds, default 10s
  document.body.classList.add('shake'); // add shake animation
  sound.currentTime = 0; // reset audio to start
  sound.play(); // play audio

  // Stop shake and audio after the duration
  setTimeout(() => {
    document.body.classList.remove('shake'); // remove shake animation
    sound.pause(); // pause audio
  }, duration);
}

// Bind click event to button to start shake
if (startBtn) {
  startBtn.onclick = () => startShake(); // must be user interaction to allow audio play
}

// Optional: start shake automatically on page load (may be blocked by browser)
// startShake();

