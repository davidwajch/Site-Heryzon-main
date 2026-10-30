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

  function updateActiveStep() {
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
