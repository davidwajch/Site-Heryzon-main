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

  // Pausa a faixa corrida e as ondas da abertura.
  const motionToggle = document.querySelector(".motion-toggle");
  if (motionToggle) {
    motionToggle.addEventListener("click", () => {
      const paused = document.documentElement.classList.toggle("motion-paused");
      motionToggle.setAttribute("aria-label", paused ? motionToggle.dataset.labelResume : motionToggle.dataset.labelPause);
    });
  }

  // Botões "Quero ser piloto" e "Falar sobre investimento" já escolhem o assunto do formulário.
  const interest = document.getElementById("f-interest");
  document.querySelectorAll("[data-interest]").forEach((link) => {
    link.addEventListener("click", () => {
      if (interest) interest.value = link.dataset.interest;
    });
  });

  // Como funciona: o passo que cruza o meio da tela acende as caixas correspondentes do fluxograma.
  const FLOW_NODES = { 1: ["cliente"], 2: ["triagem"], 3: ["kb"], 4: ["resolve", "registro"], 5: ["humano", "registro"] };
  const steps = document.querySelectorAll("[data-step]");
  const nodes = document.querySelectorAll("[data-node]");

  function highlightStep(step) {
    steps.forEach((el) => el.classList.toggle("is-active", Number(el.dataset.step) === step));
    nodes.forEach((el) => el.classList.toggle("is-lit", FLOW_NODES[step].includes(el.dataset.node)));
  }

  if (steps.length && "IntersectionObserver" in window && !reducedMotion) {
    highlightStep(1);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) highlightStep(Number(entry.target.dataset.step));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.forEach((el) => observer.observe(el));
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

  // Formulário: validação nativa, envio pelo enviar.php sem sair da página.
  const form = document.getElementById("contact-form");
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
