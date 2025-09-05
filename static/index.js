const control = document.getElementById('control'); 
const light = document.getElementById('light');
const play = document.getElementById('play');
const pause = document.getElementById('pause');
const audioIn = document.getElementById('audioIn');
let audio = new Audio(); // 单一全局音频对象
let pickr;

// 当前模式标记
let isController = false;
let isLight = false;

const socket = io();

// ========== Lighting Control ==========
function createPickr() {
  pickr = Pickr.create({
    el: '.pickr',
    theme: 'classic',
    showAlways: true,
    swatches: [
      'rgba(255, 255, 255, 1)',
      'rgba(244, 67, 54, 1)',
      'rgba(233, 30, 99, 1)',
      'rgba(156, 39, 176, 1)',
      'rgba(103, 58, 183, 1)',
      'rgba(63, 81, 181, 1)',
      'rgba(33, 150, 243, 1)',
      'rgba(3, 169, 244, 1)',
      'rgba(0, 188, 212, 1)',
      'rgba(0, 150, 136, 1)',
      'rgba(76, 175, 80, 1)',
      'rgba(139, 195, 74, 1)',
      'rgba(205, 220, 57, 1)',
      'rgba(255, 235, 59, 1)',
      'rgba(255, 193, 7, 1)',
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
  });
}

// ========== Control Mode ==========
control.onclick = () => {
  isController = true;
  isLight = false;

  if (document.fullscreenElement) {
    document.exitFullscreen().catch((err) => console.error(err));
  }
  document.getElementById('user').classList.remove('fadeOut');
  document.getElementById('controlPanel').style.opacity = 0.9;
};

// ========== Light Mode ==========
light.onclick = () => {
  isController = false;
  isLight = true;

  audio.muted = true;
  audio.play().then(() => audio.muted = false);
  document.documentElement.requestFullscreen();
  document.getElementById('user').classList.add('fadeOut');
  if (pickr) {
    pickr.destroyAndRemove();
    pickr = undefined;
  }
  document.getElementById('controlPanel').style.opacity = 0;
};

// ========== 本地音效播放（复用 audio 对象） ==========
function playLocalSound(name) {
  const src = `static/sounds/${name}.mp3`;

  // 停止当前音频
  audio.pause();

  // 切换音频源
  audio.src = src;
  audio.load();

  // 播放
  audio.play().then(() => {
    console.log("Playing local sound:", src);
  }).catch(err => {
    console.error("Audio play failed:", err);
  });
}

// ========== Socket 事件 ==========
socket.on('connect', () => {
  socket.on('hex', (val) => {
    document.body.style.backgroundColor = val;
  });

  socket.on('audio', (val) => {
    if (isLight) {   // 只有手机端（Light）播放声音
      playLocalSound(val);
    }
  });

  socket.on('pauseAudio', () => {
    if (isLight) {
      audio.pause();
    }
  });
});

// ========== 输入框播放 ==========
play.onclick = () => {
  if (isController) {
    socket.emit('audio', audioIn.value);
  }
};

pause.onclick = () => {
  if (isController) {
    socket.emit('pauseAudio', audioIn.value);
  }
};

audioIn.onkeyup = (e) => { if (e.keyCode === 13) { play.click(); } };

// ========== Quick Sounds ==========
function bindSoundButton(id, filename) {
  const btn = document.getElementById(id);
  if (btn) {
    btn.onclick = () => {
      if (isController) {  // 只有控制端发消息
        socket.emit('audio', filename);

        // 高亮按钮
        btn.style.backgroundColor = "#2e7d32";
        setTimeout(() => btn.style.backgroundColor = "", 500);
      }
    };
  }
}

// 绑定六个按钮
bindSoundButton('soundThunder', 'thunder');
bindSoundButton('soundLaugh', 'laugh');
bindSoundButton('soundEatfull', 'eatfull');
bindSoundButton('soundDrum', 'drum');
bindSoundButton('soundExplosion', 'explosion');
bindSoundButton('soundClap', 'clap');

// ========== Accordion 折叠 ==========
const acc = document.getElementsByClassName("accordion");
for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    const panel = this.nextElementSibling;

    if (panel.style.display === "block") {
      panel.style.display = "none";

      if (panel.querySelector(".pickr") && pickr) {
        pickr.destroyAndRemove();
        pickr = undefined;

        const newPickrDiv = document.createElement("div");
        newPickrDiv.className = "pickr";
        panel.appendChild(newPickrDiv);
      }

    } else {
      panel.style.display = "block";
      if (panel.querySelector(".pickr") && !pickr) {
        createPickr();
      }
    }
  });
}

// ========== 默认状态：Lighting 收起，Quick Sounds 展开 ==========
window.onload = () => {
  const panels = document.getElementsByClassName("panel");
  if (panels.length > 0) {
    panels[0].style.display = "none"; // Lighting 收起
  }
  if (panels.length > 2) {
    panels[2].style.display = "block"; // Quick Sounds 展开
  }
};
