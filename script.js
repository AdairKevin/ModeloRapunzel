/* Time */
const second = 1000,
  minute = second * 60,
  hour = minute * 60,
  day = hour * 24;

let countDown = new Date("Aug 15, 2026 18:00:00").getTime(),
  x = setInterval(function () {
    let now = new Date().getTime(),
      distance = countDown - now;

    if (distance < 0) {
      clearInterval(x);
      document.getElementById("dias").innerText = 0;
      document.getElementById("horas").innerText = 0;
      document.getElementById("minutos").innerText = 0;
      document.getElementById("segundos").innerText = 0;
      console.log("¡El tiempo ha terminado!");
      return; // Termina la ejecución de la función
    }

    const dias = Math.floor(distance / day);
    const horas = Math.floor((distance % day) / hour);
    const minutos = Math.floor((distance % hour) / minute);
    const segundos = Math.floor((distance % minute) / second);

    document.getElementById("dias").innerText = dias;
    document.getElementById("horas").innerText = horas;
    document.getElementById("minutos").innerText = minutos;
    document.getElementById("segundos").innerText = segundos;

    console.log(dias, horas, minutos, segundos);
  }, second);

if (segundos == 0) {
  ((document.getElementById("dias").innerText = "00"),
    (document.getElementById("horas").innerText = "00"),
    (document.getElementById("minutos").innerText = "00"),
    (document.getElementById("segundos").innerText = "00"));
}

const audio = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const progressBar = document.getElementById("progressBar");

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
