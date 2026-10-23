// Alturas das barras da waveform (decorativa).
const WAVEFORM_BARS = [
  18, 34, 62, 78, 42, 56, 88, 70, 38, 24, 48, 74, 92, 54, 32, 66, 80, 44, 58,
  28, 40, 72, 86, 52,
];

// Endpoint PHP que envia a mensagem no servidor.
const CONTACT_ENDPOINT = "enviar.php";

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

// Envia a mensagem pelo endpoint, sem o visitante sair da página.
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  const button = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    if (status) status.textContent = "Enviando...";
    if (button) button.disabled = true;

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.ok) {
        form.reset();
        if (status) {
          status.textContent =
            "Mensagem enviada! Em breve entramos em contato.";
        }
      } else if (status) {
        status.textContent =
          data.error || "Não foi possível enviar. Tente novamente.";
      }
    } catch {
      if (status) {
        status.textContent = "Erro de conexão. Tente novamente em instantes.";
      }
    } finally {
      if (button) button.disabled = false;
    }
  });
}

renderWaveforms();
setupWaveformPlayback();
setupExclusiveAudio();
setupMobileMenu();
setupContactForm();
