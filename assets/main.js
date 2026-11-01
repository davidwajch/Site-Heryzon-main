(() => {
  const LANG_KEY = "heryzon-lang";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Seletor de idioma: guarda a escolha (único dado salvo no navegador) e mantém a seção atual.
  document.querySelectorAll("[data-lang-switch]").forEach((link) => {
    link.addEventListener("click", () => {
      try {
        localStorage.setItem(LANG_KEY, link.dataset.langSwitch);
      } catch {}
      link.hash = location.hash;
    });
  });

  // Menu do celular: abre pelo botão, fecha com Esc e ao escolher uma seção.
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  if (header && menuToggle) {
    const menuLabel = menuToggle.querySelector(".menu-toggle-label");
    const setMenuOpen = (open) => {
      header.classList.toggle("is-menu-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuLabel.textContent = open ? menuToggle.dataset.labelClose : menuToggle.dataset.labelOpen;
    };
    menuToggle.addEventListener("click", () => setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || menuToggle.getAttribute("aria-expanded") !== "true") return;
      setMenuOpen(false);
      menuToggle.focus();
    });
    header.querySelectorAll(".main-nav a").forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
  }

  // Faixa corrida: no toque, um toque pausa e outro retoma. Mouse (hover) e teclado (foco) ficam no CSS.
  const marquee = document.querySelector(".marquee");
  if (marquee) {
    if (reducedMotion) {
      marquee.removeAttribute("tabindex");
    } else {
      let pointerType = "";
      marquee.addEventListener("pointerdown", (event) => {
        pointerType = event.pointerType;
      });
      marquee.addEventListener("click", () => {
        if (pointerType && pointerType !== "mouse") marquee.classList.toggle("is-paused");
      });
    }
  }

  // Formulário: Piloto mostra os campos da empresa; Investidor só nome, e-mail e mensagem.
  // Campos escondidos ficam desabilitados, então não são validados nem enviados.
  const form = document.getElementById("contact-form");
  const topicChoice = form?.querySelector(".topic");
  const topicStatus = form?.querySelector("[data-topic-status]");

  function applyTopic(announce) {
    const topic = form.querySelector('input[name="interest"]:checked').value;
    form.querySelectorAll("[data-topic]").forEach((field) => {
      const shown = field.dataset.topic === topic;
      field.hidden = !shown;
      field.querySelectorAll("input, select, textarea").forEach((control) => {
        control.disabled = !shown;
      });
    });
    if (announce) topicStatus.textContent = topicChoice.getAttribute(`data-announce-${topic}`);
  }

  if (topicChoice) {
    applyTopic(false);
    topicChoice.addEventListener("change", () => applyTopic(true));
  }

  // Botões "Quero ser piloto" e "Falar sobre investimento" já escolhem o assunto do formulário.
  document.querySelectorAll("[data-interest]").forEach((link) => {
    link.addEventListener("click", () => {
      const radio = form?.querySelector(`input[name="interest"][value="${link.dataset.interest}"]`);
      if (!radio || radio.checked) return;
      radio.checked = true;
      applyTopic(true);
    });
  });

  // Como funciona: o passo que cruza a linha de leitura acende as caixas correspondentes do fluxograma.
  // No computador a linha é o meio da tela; no celular, com o fluxograma fixo no topo,
  // é o meio da área que sobra abaixo dele.
  const FLOW_NODES = { 1: ["cliente"], 2: ["triagem"], 3: ["kb"], 4: ["resolve", "registro"], 5: ["humano", "registro"] };
  const steps = document.querySelectorAll("[data-step]");
  const nodes = document.querySelectorAll("[data-node]");
  const howFlow = document.querySelector(".how-flow");
  const compactFlow = window.matchMedia("(max-width: 980px) and (min-height: 600px)");
  let activeStep = 0;

  function highlightStep(step) {
    if (step === activeStep) return;
    activeStep = step;
    steps.forEach((el) => el.classList.toggle("is-active", Number(el.dataset.step) === step));
    nodes.forEach((el) => el.classList.toggle("is-lit", FLOW_NODES[step].includes(el.dataset.node)));
  }

  function readingLine() {
    if (!compactFlow.matches) return window.innerHeight / 2;
    const flowBottom = Math.max(howFlow.getBoundingClientRect().bottom, 0);
    return flowBottom + (window.innerHeight - flowBottom) / 2;
  }

  // Fixo = encostado no topo; antes de chegar lá ou depois de soltar, ele está acima ou abaixo disso.
  function updateStuck() {
    const top = parseFloat(getComputedStyle(howFlow).top) || 0;
    const stuck = compactFlow.matches && Math.abs(howFlow.getBoundingClientRect().top - top) < 1;
    howFlow.classList.toggle("is-stuck", stuck);
  }

  function updateActiveStep() {
    updateStuck();
    const line = readingLine();
    let step = 1;
    steps.forEach((el) => {
      if (el.getBoundingClientRect().top <= line) step = Number(el.dataset.step);
    });
    highlightStep(step);
  }

  if (steps.length && howFlow && !reducedMotion) {
    let frame = 0;
    const scheduleUpdate = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          updateActiveStep();
        });
      }
    };
    updateActiveStep();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
  }

  // As ondas da abertura só se movem enquanto o áudio do painel toca.
  const callPanel = document.querySelector(".call-panel");
  const panelAudio = callPanel?.querySelector("audio");
  if (panelAudio) {
    const setPlaying = (playing) => callPanel.classList.toggle("is-playing", playing);
    panelAudio.addEventListener("playing", () => setPlaying(true));
    ["pause", "ended", "waiting", "emptied"].forEach((type) => panelAudio.addEventListener(type, () => setPlaying(false)));
  }

  // Player próprio: play/pausa, barra clicável e arrastável, setas avançam e voltam 5 s.
  const SEEK_STEP = 5;
  const clock = (seconds) => {
    const total = Math.round(seconds);
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
  };

  document.querySelectorAll("[data-audio-player]").forEach((player) => {
    const audio = player.querySelector("audio");
    const toggle = player.querySelector(".audio-toggle");
    const progress = player.querySelector(".audio-progress");
    const current = player.querySelector(".audio-current");
    const total = player.querySelector(".audio-duration");
    const knownDuration = Number(player.dataset.duration);
    audio.controls = false;

    const duration = () => (Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : knownDuration);

    function render() {
      const length = duration();
      const time = Math.min(audio.currentTime, length);
      player.style.setProperty("--progress", `${(time / length) * 100}%`);
      current.textContent = clock(time);
      total.textContent = clock(length);
      progress.setAttribute("aria-valuemax", String(Math.round(length)));
      progress.setAttribute("aria-valuenow", String(Math.round(time)));
      progress.setAttribute("aria-valuetext", `${clock(time)} / ${clock(length)}`);
    }

    // Enquanto toca, redesenha a cada quadro para a barra andar sem saltos.
    let frame = 0;
    const loop = () => {
      render();
      frame = audio.paused ? 0 : requestAnimationFrame(loop);
    };

    function setPlaying() {
      const playing = !audio.paused;
      player.classList.toggle("is-playing", playing);
      toggle.setAttribute("aria-label", playing ? toggle.dataset.labelPause : toggle.dataset.labelPlay);
      if (playing && !frame) frame = requestAnimationFrame(loop);
      render();
    }

    function seek(seconds) {
      audio.currentTime = Math.max(0, Math.min(seconds, duration()));
      render();
    }

    toggle.addEventListener("click", () => (audio.paused ? audio.play() : audio.pause()));
    ["play", "pause", "ended"].forEach((type) => audio.addEventListener(type, setPlaying));
    ["loadedmetadata", "timeupdate", "seeked"].forEach((type) => audio.addEventListener(type, render));

    progress.addEventListener("keydown", (event) => {
      const moves = { ArrowRight: SEEK_STEP, ArrowUp: SEEK_STEP, ArrowLeft: -SEEK_STEP, ArrowDown: -SEEK_STEP };
      if (event.key in moves) seek(audio.currentTime + moves[event.key]);
      else if (event.key === "Home") seek(0);
      else if (event.key === "End") seek(duration());
      else return;
      event.preventDefault();
    });

    const seekToPointer = (event) => {
      const track = progress.querySelector(".audio-track").getBoundingClientRect();
      seek(((event.clientX - track.left) / track.width) * duration());
    };
    progress.addEventListener("pointerdown", (event) => {
      progress.setPointerCapture(event.pointerId);
      seekToPointer(event);
    });
    progress.addEventListener("pointermove", (event) => {
      if (progress.hasPointerCapture(event.pointerId)) seekToPointer(event);
    });
  });

  // "Ouvir o Bruno" na abertura toca e pausa o áudio do painel, no lugar. Sem JavaScript continua
  // sendo um link para "Ouça o Bruno"; com JavaScript vira um botão.
  const heroLink = document.querySelector("[data-hero-play]");
  if (heroLink && panelAudio) {
    const heroButton = document.createElement("button");
    heroButton.type = "button";
    heroButton.className = heroLink.className;
    heroButton.innerHTML = heroLink.innerHTML;
    heroLink.replaceWith(heroButton);
    const heroLabel = heroButton.querySelector(".hero-play-label");

    const syncHero = () => {
      const playing = !panelAudio.paused;
      heroButton.classList.toggle("is-playing", playing);
      heroLabel.textContent = playing ? heroLink.dataset.labelPause : heroLink.dataset.labelPlay;
    };
    ["play", "pause", "ended"].forEach((type) => panelAudio.addEventListener(type, syncHero));

    heroButton.addEventListener("click", () => {
      if (!panelAudio.paused) {
        panelAudio.pause();
        return;
      }
      // No celular o painel fica abaixo dos botões: rola até ele. O play sai no próprio clique,
      // junto com a rolagem, porque o Safari pode bloquear um play disparado depois.
      const box = callPanel.getBoundingClientRect();
      const headerBottom = header && getComputedStyle(header).position === "sticky" ? header.getBoundingClientRect().bottom : 0;
      if (box.top < headerBottom || box.bottom > window.innerHeight) {
        callPanel.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "center" });
      }
      panelAudio.play();
    });
  }

  // Só um player toca por vez.
  const players = document.querySelectorAll("audio");
  players.forEach((audio) => {
    audio.addEventListener("play", () => {
      players.forEach((other) => {
        if (other !== audio) other.pause();
      });
    });
  });

  // Envio pelo enviar.php sem sair da página, com a validação nativa do navegador.
  if (!form) return;
  const error = form.querySelector(".form-error");
  const success = document.querySelector(".form-success");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.getAttribute("aria-busy") === "true") return;

    error.hidden = true;
    form.querySelectorAll('input[type="text"], input[type="email"]').forEach((input) => {
      input.value = input.value.trim();
    });
    if (!form.reportValidity()) return;

    form.setAttribute("aria-busy", "true");
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(`HTTP ${response.status}`);

      form.hidden = true;
      success.textContent = form.dataset.success;
      success.hidden = false;
      success.focus();
    } catch {
      error.textContent = form.dataset.error;
      error.hidden = false;
    } finally {
      form.removeAttribute("aria-busy");
    }
  });
})();
