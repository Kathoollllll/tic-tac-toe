document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
      startBtn.addEventListener("click", () => {
          const clickSound = new Audio("sounds/click.wav");
          clickSound.play();
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