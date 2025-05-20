document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
      startBtn.addEventListener("click", () => {
          const clickSound = new Audio("sounds/click.wav");
          clickSound.play();

          localStorage.setItem('backgroundMusic', 'true');
           if (!backgroundMusic) {
                backgroundMusic = playBackgroundMusic();
            } else if (backgroundMusic.paused) {
                backgroundMusic.play()
                    .then(() => {
                    })
                    .catch(error => {
                        console.error("Autoplay was prevented for background music:", error);
                    });
            }

          setTimeout(() => {
              window.location.href = "difficulty.html";
          }, 300);
      });
  }

  const canvas = document.getElementById("animated-bg");
  if (canvas) {
      const ctx = canvas.getContext("2d");
      let stars = [];

      function resizeCanvas() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          stars = Array.from({ length: 100 }, () => ({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              radius: Math.random() * 1.5 + 0.5,
              speed: Math.random() * 0.5 + 0.2,
          }));
      }

      function drawStars() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "yellow";
          for (let star of stars) {
              ctx.beginPath();
              ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
              ctx.fill();
              star.y += star.speed;
              if (star.y > canvas.height) {
                  star.y = 0;
                  star.x = Math.random() * canvas.width;
              }
          }
      }

      function animate() {
          drawStars();
          requestAnimationFrame(animate);
      }

      resizeCanvas();
      animate();
      window.addEventListener("resize", resizeCanvas);
  }
});

let backgroundMusic;

function playBackgroundMusic() {
    let backgroundMusicEnabled = localStorage.getItem('backgroundMusic') !== 'false';
    if (backgroundMusicEnabled) {
        backgroundMusic = new Audio('sounds/background.mp3');
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.5;
        backgroundMusic.play();
        return backgroundMusic;
    }
    return null;
}

function stopBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
}

function playSoundEffect(sound) {
    let soundEffectsEnabled = localStorage.getItem('soundEffects') !== 'false';
    if (soundEffectsEnabled) {
        let soundEffect = new Audio(`sounds/${sound}.wav`);
        soundEffect.play();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let soundEffectsEnabled = localStorage.getItem('soundEffects') !== 'false';
    let backgroundMusicEnabled = localStorage.getItem('backgroundMusic') !== 'false';

    document.getElementById('soundEffects').innerText = soundEffectsEnabled ? "On" : "Off";
    document.getElementById('backgroundMusic').innerText = backgroundMusicEnabled ? "On" : "Off";

    if (backgroundMusicEnabled) {
        backgroundMusic = playBackgroundMusic();
    }

    window.toggleSoundEffects = function () {
        let button = document.getElementById('soundEffects');
        soundEffectsEnabled = !soundEffectsEnabled;
        button.innerText = soundEffectsEnabled ? "On" : "Off";
        localStorage.setItem('soundEffects', soundEffectsEnabled);
    };

    window.toggleBackgroundMusic = function () {
        let button = document.getElementById('backgroundMusic');
        backgroundMusicEnabled = !backgroundMusicEnabled;
        button.innerText = backgroundMusicEnabled ? "On" : "Off";
        localStorage.setItem('backgroundMusic', backgroundMusicEnabled);
        if (backgroundMusicEnabled) {
            if (!backgroundMusic) {
                backgroundMusic = playBackgroundMusic();
            } else {
                backgroundMusic.play();
            }
        } else {
            if (backgroundMusic) {
                backgroundMusic.pause();
            }
        }
    };
});

function showHowToPlay() {
    document.getElementById('settingsContent').style.display = 'none';
    document.getElementById('instructionsContent').style.display = 'block';
    document.getElementById('aboutContent').style.display = 'none';
    document.getElementById('modalTitle').innerText = "🎮 How to Play";
}

function showAbout() {
    document.getElementById('settingsContent').style.display = 'none';
    document.getElementById('instructionsContent').style.display = 'none';
    document.getElementById('aboutContent').style.display = 'block';
    document.getElementById('modalTitle').innerText = "🎮 About The Game";
}

function openSettingsModal() {
    document.getElementById('settingsModal').classList.add('show');
    document.getElementById('overlay').classList.add('show');
    document.querySelectorAll('.difficulty-select button').forEach(button => {
        button.setAttribute('disabled', 'true');
    });
    document.querySelectorAll('.settings-button').forEach(button => {
        button.setAttribute('disabled', 'true');
    });
    document.querySelector('.close-button').removeAttribute('disabled');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
    document.querySelectorAll('.difficulty-select button').forEach(button => {
        button.removeAttribute('disabled');
    });
    document.querySelectorAll('.settings-button').forEach(button => {
        button.removeAttribute('disabled');
    });
}

 function showSettings() {
        document.getElementById('settingsContent').style.display = 'block';
        document.getElementById('instructionsContent').style.display = 'none';
        document.getElementById('aboutContent').style.display = 'none';
        document.getElementById('modalTitle').innerText = 'Settings';
    }