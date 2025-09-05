// Get the button element (if present) and create audio object
const startBtn = document.getElementById('startShake');
const sound = new Audio('wine-glass-clink-36036.mp3');

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

  // Stop shake and audio after duration
