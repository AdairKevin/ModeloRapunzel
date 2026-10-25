/* =========================================================
   EXTRAS: los datos y textos vienen de contenido.json
   (los carga motor.js en window.INVITACION); aquí no se edita nada
   ========================================================= */
const DATOS = window.INVITACION;
const CONFIG = {
  titulo: DATOS.evento.tituloCalendario,
  inicio: DATOS.evento.inicio, // AAAA-MM-DDTHH:MM
  duracionHoras: DATOS.evento.duracionHoras,
  lugar: DATOS.evento.lugarCalendario,
  whatsapp: DATOS.confirmacion.whatsapp, // vacío = el invitado elige contacto
};

(() => {
const audio = document.getElementById("audioPlayer") || new Audio();
const tema = document.body.dataset.tema;
const fecha = new Date(CONFIG.inicio);

/* ---------- Aparición al hacer scroll ---------- */
const animables = [
  [".music-card", "zoom"],
  [".palabras", ""],
  [".img-separador", "zoom"],
  [".box-info > div", ""],
  [".timer", ""],
  [".section-calendario", "zoom"],
  [".box-place", "izq"],
  [".box-place-salon", "der"],
  [".social-card", "zoom"],
  [".info-block", ""],
  [".box-message", "zoom"],
];
animables.forEach(([selector, tipo]) => {
  document.querySelectorAll(selector).forEach((el) => {
    el.classList.add("reveal");
    if (tipo) el.classList.add(tipo);
  });
});
const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observador.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observador.observe(el));

/* ---------- Partículas temáticas ---------- */
const capa = document.getElementById("particulas");
const azar = (min, max) => Math.random() * (max - min) + min;

const PARTICULAS = {
  // Pétalos de rosa cayendo y destellos dorados
  bridgerton() {
    const p = document.createElement("span");
    const esPetalo = Math.random() < 0.7;
    p.className = "particula " + (esPetalo ? "petalo" : "destello");
    p.style.left = azar(0, 100) + "vw";
    const dur = azar(7, 13);
    p.animate(
      [
        { transform: `translate(0,0) rotate(0deg)`, opacity: 0 },
        { opacity: 0.9, offset: 0.1 },
        { transform: `translate(${azar(-80, 80)}px, 110vh) rotate(${azar(180, 720)}deg)`, opacity: 0 },
      ],
      { duration: dur * 1000, easing: "ease-in" }
    ).onfinish = () => p.remove();
    return p;
  },
  // Linternas flotantes que suben, como en Enredados
  rapunzel() {
    const p = document.createElement("span");
    p.className = "particula linterna";
    const escala = azar(0.5, 1.1);
    p.style.left = azar(0, 95) + "vw";
    p.style.top = "auto";
    p.style.bottom = "-50px";
    p.animate(
      [
        { transform: `translate(0,0) scale(${escala})`, opacity: 0 },
        { opacity: 0.95, offset: 0.15 },
        { transform: `translate(${azar(-40, 40)}px, -55vh) scale(${escala})`, offset: 0.6 },
        { transform: `translate(${azar(-60, 60)}px, -115vh) scale(${escala * 0.8})`, opacity: 0 },
      ],
      { duration: azar(12, 20) * 1000, easing: "linear" }
    ).onfinish = () => p.remove();
    return p;
  },
  // Luciérnagas del bayou que flotan y parpadean
  sapo() {
    const p = document.createElement("span");
    p.className = "particula luciernaga";
    p.style.left = azar(0, 100) + "vw";
    p.style.top = azar(10, 95) + "vh";
    const x = azar(-60, 60),
      y = azar(-80, 20);
    p.animate(
      [
        { transform: "translate(0,0)", opacity: 0 },
        { transform: `translate(${x / 2}px, ${y / 2}px)`, opacity: 1, offset: 0.3 },
        { transform: `translate(${x}px, ${y}px)`, opacity: 0.2, offset: 0.6 },
        { transform: `translate(${x * 1.4}px, ${y * 1.3}px)`, opacity: 0 },
      ],
      { duration: azar(5, 9) * 1000, easing: "ease-in-out" }
    ).onfinish = () => p.remove();
    return p;
  },
  // Cartas de la Reina de Corazones cayendo en espiral
  alice() {
    const p = document.createElement("span");
    const palos = ["♥", "♠", "♦", "♣"];
    const palo = palos[Math.floor(Math.random() * 4)];
    p.className = "particula carta " + (palo === "♥" || palo === "♦" ? "roja" : "negra");
    p.textContent = palo;
    p.style.left = azar(0, 95) + "vw";
    p.animate(
      [
        { transform: "translate(0,0) rotateY(0deg) rotate(0deg)", opacity: 0 },
        { opacity: 1, offset: 0.1 },
        {
          transform: `translate(${azar(-100, 100)}px, 110vh) rotateY(${azar(360, 1080)}deg) rotate(${azar(-90, 90)}deg)`,
          opacity: 0.2,
        },
      ],
      { duration: azar(8, 14) * 1000, easing: "ease-in" }
    ).onfinish = () => p.remove();
    return p;
  },
};

const crearParticula = PARTICULAS[tema];
function lanzar(cantidad) {
  for (let i = 0; i < cantidad; i++) {
    setTimeout(() => capa.appendChild(crearParticula()), i * 120);
  }
}
const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Se activan al abrir el sobre: ráfaga inicial y luego goteo constante */
document.getElementById("openEnvelope").addEventListener("click", () => {
  if (audio.src) audio.play().then(() => (document.getElementById("playPauseBtn").textContent = "⏸")).catch(() => {});
  if (reducido || !crearParticula) return;
  setTimeout(() => {
    lanzar(tema === "sapo" ? 25 : 18);
    setInterval(() => {
      if (capa.childElementCount < 28) capa.appendChild(crearParticula());
    }, tema === "sapo" ? 500 : 900);
  }, 900);
});

/* ---------- Botón flotante de música ---------- */
const flotante = document.createElement("button");
flotante.className = "musica-flotante";
flotante.setAttribute("aria-label", (DATOS.musica && DATOS.musica.botonFlotanteAria) || "");
flotante.textContent = "♫";
document.body.appendChild(flotante);
if (!document.querySelector(".music-card")) flotante.hidden = true;
flotante.addEventListener("click", () => document.getElementById("playPauseBtn").click());
audio.addEventListener("play", () => flotante.classList.add("sonando"));
audio.addEventListener("pause", () => flotante.classList.remove("sonando"));
if (document.querySelector(".music-card"))
  new IntersectionObserver(([e]) => flotante.classList.toggle("activo", !e.isIntersecting)).observe(
    document.querySelector(".music-card")
  );

/* ---------- Calendario ---------- */
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const seccionCal = document.getElementById("calendario");
if (seccionCal) {
  const anio = fecha.getFullYear(),
    mes = fecha.getMonth();
  const primerDia = new Date(anio, mes, 1).getDay();
  const diasMes = new Date(anio, mes + 1, 0).getDate();
  let celdas = ["D", "L", "M", "M", "J", "V", "S"].map((d) => `<span class="dia-semana">${d}</span>`).join("");
  celdas += "<span></span>".repeat(primerDia);
  for (let d = 1; d <= diasMes; d++) {
    celdas += `<span class="${d === fecha.getDate() ? "dia-evento" : ""}">${d}</span>`;
  }

  const pad = (n) => String(n).padStart(2, "0");
  const fin = new Date(fecha.getTime() + CONFIG.duracionHoras * 3600000);
  const formato = (f) => `${f.getFullYear()}${pad(f.getMonth() + 1)}${pad(f.getDate())}T${pad(f.getHours())}${pad(f.getMinutes())}00`;
  const google =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(CONFIG.titulo)}` +
    `&dates=${formato(fecha)}/${formato(fin)}` +
    `&location=${encodeURIComponent(CONFIG.lugar)}`;

  seccionCal.innerHTML = `
    <div class="calendario-card">
      <h2 class="calendario-titulo">${DATOS.calendario.titulo}</h2>
      <p class="calendario-mes">${meses[mes]} ${anio}</p>
      <div class="calendario-grid">${celdas}</div>
      <div class="calendario-botones">
        <a class="btn-tema" href="${google}" target="_blank" rel="noopener">${DATOS.calendario.botonGoogle}</a>
        <button class="btn-tema secundario" id="descargarIcs">${DATOS.calendario.botonIcs}</button>
      </div>
    </div>`;

  document.getElementById("descargarIcs").addEventListener("click", () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Mirai//Invitacion//ES",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@mirai`,
      `DTSTART:${formato(fecha)}`,
      `DTEND:${formato(fin)}`,
      `SUMMARY:${CONFIG.titulo}`,
      `LOCATION:${CONFIG.lugar}`,
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${CONFIG.titulo}`,
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    enlace.download = "evento.ics";
    enlace.click();
  });
}

/* ---------- Confirmación por WhatsApp ---------- */
const form = document.getElementById("rsvpForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const datos = new FormData(form);
    const W = DATOS.confirmacion.mensajeWhatsapp;
    const asiste = datos.get("asistencia") === "si";
    let texto =
      `${W.saludo} ${datos.get("nombre").trim()}.\n` +
      (asiste
        ? `${W.asiste}\n${W.asistentes}: ${datos.get("personas")}`
        : W.noAsiste);
    const mensaje = (datos.get("mensaje") || "").trim();
    if (mensaje) texto += `\n${W.mensaje}: ${mensaje}`;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank");
    form.classList.add("enviado");
    form.style.display = "none";
    if (crearParticula && !reducido) lanzar(15);
  });
  form.querySelectorAll('input[name="asistencia"]').forEach((r) =>
    r.addEventListener("change", () => {
      form.querySelector(".campo-personas").style.display = r.value === "si" && r.checked ? "" : "none";
    })
  );
}

/* ---------- Sobre: tooltip, carta interior y destello al abrir ---------- */
const sello = document.getElementById("openEnvelope");
const sobre = document.querySelector(".envelope");
const tooltip = document.createElement("span");
tooltip.className = "sobre-tooltip";
tooltip.textContent = DATOS.sobre.tooltip;
sello.appendChild(tooltip);
const carta = document.createElement("div");
carta.className = "sobre-carta";
carta.innerHTML = `<small>${DATOS.sobre.carta}</small><strong>${DATOS.sobre.cartaNombre}</strong>`;
sobre.appendChild(carta);

sello.addEventListener("click", () => {
  if (reducido) return;
  const r = sello.getBoundingClientRect();
  const cx = r.left + r.width / 2,
    cy = r.top + r.height / 2;
  const luz = document.createElement("span");
  luz.className = "destello-sobre";
  luz.style.left = cx - 5 + "px";
  luz.style.top = cy - 5 + "px";
  document.body.appendChild(luz);
  luz.animate([{ transform: "scale(0)", opacity: 1 }, { transform: "scale(60)", opacity: 0 }], {
    duration: 900,
    easing: "ease-out",
  }).onfinish = () => luz.remove();
  for (let i = 0; i < 26; i++) {
    const c = document.createElement("span");
    c.className = "chispa";
    c.style.left = cx - 3 + "px";
    c.style.top = cy - 3 + "px";
    document.body.appendChild(c);
    const ang = (i / 26) * Math.PI * 2,
      dist = azar(70, 160);
    c.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist + 40}px) scale(0)`, opacity: 0 },
      ],
      { duration: azar(700, 1200), easing: "cubic-bezier(0.1, 0.8, 0.3, 1)" }
    ).onfinish = () => c.remove();
  }
});

/* ---------- Cronograma e itinerario aparecen uno por uno ---------- */
document.querySelectorAll(".cronograma li, .timeline .event").forEach((el, i) => {
  el.classList.add("reveal", i % 2 ? "der" : "izq");
  observador.observe(el);
});
})();
