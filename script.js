// Alturas das barras da waveform (decorativa).
const WAVEFORM_BARS = [
  18, 34, 62, 78, 42, 56, 88, 70, 38, 24, 48, 74, 92, 54, 32, 66, 80, 44, 58,
  28, 40, 72, 86, 52,
];

const CONTACT_EMAIL = "vozzicontato@gmail.com";

// Preenche cada container [data-waveform] com as barras.
function renderWaveforms() {
  document.querySelectorAll("[data-waveform]").forEach((container) => {
    const fragment = document.createDocumentFragment();
    WAVEFORM_BARS.forEach((height, index) => {
      const bar = document.createElement("span");
      bar.style.setProperty("--bar-height", `${height}%`);
      // Índice usado pelo CSS para escalonar o atraso da animação.
      bar.style.setProperty("--i", `${index}`);
      fragment.appendChild(bar);
    });
    container.appendChild(fragment);
  });
}

// Anima a waveform enquanto o áudio correspondente está tocando.
function setupWaveformPlayback() {
  document.querySelectorAll("audio").forEach((audio) => {
    const card = audio.closest(".hero-signal-card, .audio-demo-card");
    const wave = card && card.querySelector("[data-waveform]");
    if (!wave) return;

    const play = () => wave.classList.add("is-playing");
    const stop = () => wave.classList.remove("is-playing");

    audio.addEventListener("play", play);
    audio.addEventListener("playing", play);
    audio.addEventListener("pause", stop);
    audio.addEventListener("ended", stop);
  });
}

// Garante que apenas um player de áudio toque por vez.
function setupExclusiveAudio() {
  const players = document.querySelectorAll("audio");
  players.forEach((audio) => {
    audio.addEventListener("play", () => {
      players.forEach((other) => {
        if (other !== audio) other.pause();
      });
    });
  });
}

// Fecha o menu mobile ao clicar em um link.
function setupMobileMenu() {
  const menu = document.querySelector(".mobile-menu");
  if (!menu) return;
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => menu.removeAttribute("open"));
  });
}

// Monta um e-mail (mailto) com os dados do formulário.
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const organization = (data.get("organization") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    const placeholder = "a ser incluido";
    const subject = `Contato Vozzi - ${name || placeholder}`;
    const body = [
      `Nome: ${name || placeholder}`,
      `Email: ${email || placeholder}`,
      `Organização: ${organization || placeholder}`,
      "",
      "Mensagem:",
      message || placeholder,
    ].join("\n");

    if (status) status.textContent = "Abrindo email para envio...";
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  });
}

renderWaveforms();
setupWaveformPlayback();
setupExclusiveAudio();
setupMobileMenu();
setupContactForm();
