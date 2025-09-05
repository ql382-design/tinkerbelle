const startBtn = document.getElementById('startShake');
const sound = new Audio("https://raw.githubusercontent.com/ql382-design/tinkerbelle/main/static/wine-glass-clink-36036.mp3");

sound.volume = 1.0;

// Function to start screen shake and play sound
function startShake(duration = 10000) {
  document.body.classList.add('shake');
  sound.currentTime = 0;
  sound.play()
    .then(() => console.log("✅ 播放成功"))
    .catch(err => console.error("❌ 播放失败", err));

  setTimeout(() => {
    document.body.classList.remove('shake');
    sound.pause();
  }, duration);
}

if (startBtn) {
  startBtn.onclick = () => startShake();
}
