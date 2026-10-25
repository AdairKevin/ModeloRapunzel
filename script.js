/* Los datos vienen de contenido.json (los carga motor.js en window.INVITACION) */

/* Cuenta regresiva: la fecha se cambia en evento.inicio de contenido.json */
const second = 1000,
  minute = second * 60,
  hour = minute * 60,
  day = hour * 24;

const countDown = new Date(window.INVITACION.evento.inicio).getTime();
const x =
  document.getElementById("dias") &&
  setInterval(function () {
    const distance = Math.max(0, countDown - Date.now());
    document.getElementById("dias").innerText = Math.floor(distance / day);
    document.getElementById("horas").innerText = Math.floor((distance % day) / hour);
    document.getElementById("minutos").innerText = Math.floor((distance % hour) / minute);
    document.getElementById("segundos").innerText = Math.floor((distance % minute) / second);
    if (distance === 0) clearInterval(x);
  }, second);

/* Música */
const audio = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const progressBar = document.getElementById("progressBar");

if (audio) {
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playPauseBtn.textContent = "⏸";
    } else {
      audio.pause();
      playPauseBtn.textContent = "▶";
    }
  });

  audio.addEventListener("timeupdate", () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = progress + "%";
  });

  audio.addEventListener("ended", () => {
    playPauseBtn.textContent = "▶";
    progressBar.style.width = "0%";
  });
}

/* Sobre */
const openBtn = document.getElementById("openEnvelope");
const envelope = document.querySelector(".envelope");
const screen = document.getElementById("envelopeScreen");
const invitation = document.getElementById("invitationContent");

openBtn.addEventListener("click", () => {
  envelope.classList.add("open");

  setTimeout(() => {
    screen.classList.add("fade-out");
    invitation.classList.remove("hidden");
  }, 1200);
});
