(function () {
  const DATA = window.ACTIVITY_DATA;
  const app = document.getElementById("app");
  const languageSwitch = document.getElementById("language-switch");
  const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
  let activeLanguage = requestedLanguage === "en" ? "en" : "zh";

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderTimeline(items) {
    return items.map(item => `
      <div class="timeline-item">
        <span>${esc(item.label)}</span>
        <strong>${esc(item.value)}</strong>
      </div>
    `).join("");
  }

  function renderList(items) {
    return items.map(item => `<li>${esc(item)}</li>`).join("");
  }

  function renderParagraphs(items) {
    return items.map(item => `<p>${esc(item)}</p>`).join("");
  }

  function renderPage() {
    const content = DATA[activeLanguage];
    const isEnglish = activeLanguage === "en";

    document.documentElement.lang = content.lang;
    document.title = content.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", content.description);
    document.getElementById("brand-text").textContent = content.brand;
    document.getElementById("footer-brand").textContent = content.footerBrand;
    document.getElementById("footer-school").textContent = content.footerSchool;
    document.getElementById("footer-note").textContent = content.footerNote;
    languageSwitch.setAttribute("aria-label", content.languageLabel);

    languageSwitch.querySelectorAll("[data-language]").forEach(button => {
      const isActive = button.dataset.language === activeLanguage;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    app.innerHTML = `
      <div id="top" class="page-content">
        <section class="activity-hero" aria-labelledby="activity-title">
          <div class="container hero-content">
            <p class="hero-eyebrow">${esc(content.hero.eyebrow)}</p>
            <h1 id="activity-title">${esc(content.hero.title)}</h1>
            <p class="hero-secondary" lang="${isEnglish ? "zh-CN" : "en"}">${esc(content.hero.secondaryTitle)}</p>
            <p class="hero-lead">${esc(content.hero.lead)}</p>
          </div>
        </section>

        <section class="timeline-band" aria-label="${esc(content.timelineLabel)}">
          <div class="container timeline-grid">
            ${renderTimeline(content.timeline)}
          </div>
        </section>

        <section class="content-band content-band-light">
          <div class="container content-grid">
            <div class="section-heading">
              <span class="eyebrow">${esc(content.overview.eyebrow)}</span>
              <h2>${esc(content.overview.title)}</h2>
            </div>
            <div class="prose" lang="${content.lang}">
              <p class="greeting">${esc(content.overview.greeting)}</p>
              ${renderParagraphs(content.overview.paragraphs)}
            </div>
          </div>
        </section>

        <section class="content-band">
          <div class="container content-grid">
            <div class="section-heading">
              <span class="eyebrow">${esc(content.arrangements.eyebrow)}</span>
              <h2>${esc(content.arrangements.title)}</h2>
            </div>
            <ol class="arrangement-list" lang="${content.lang}">
              ${renderList(content.arrangements.items)}
            </ol>
          </div>
        </section>

        <section class="award-band">
          <div class="container award-layout">
            <div class="award-copy">
              <span class="eyebrow eyebrow-gold">${esc(content.award.eyebrow)}</span>
              <h2>${esc(content.award.title)}</h2>
              ${renderParagraphs(content.award.paragraphs)}
            </div>
            <div class="award-dimensions" aria-label="${esc(content.award.title)}">
              ${content.award.dimensions.map(item => `
                <div class="award-dimension">
                  <span>${esc(item.label)}</span>
                  <strong>${esc(item.value)}</strong>
                </div>
              `).join("")}
            </div>
          </div>
        </section>

        <section class="survey-band">
          <div class="container survey-layout">
            <div>
              <span class="eyebrow">${esc(content.survey.eyebrow)}</span>
              <h2>${esc(content.survey.title)}</h2>
              <p>${esc(content.survey.body)}</p>
            </div>
            <a class="action-button action-button-primary survey-button" href="${esc(DATA.surveyUrl)}" target="_blank" rel="noopener noreferrer">
              ${esc(content.survey.button)} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section class="submission-band" id="submission-notice" tabindex="-1">
          <div class="container submission-layout">
            <span class="submission-label">${esc(content.submission.label)}</span>
            <div>
              <h2>${esc(content.submission.title)}</h2>
              <p>${esc(content.submission.body)}</p>
            </div>
          </div>
        </section>

        <section class="signature-band">
          <div class="container signature" lang="${content.lang}">
            <p>${esc(content.signature[0])}</p>
            <strong>${esc(content.signature[1])}</strong>
          </div>
        </section>
      </div>
    `;

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", event => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (target.hasAttribute("tabindex")) target.focus({ preventScroll: true });
      });
    });

  }

  languageSwitch.addEventListener("click", event => {
    const button = event.target.closest("[data-language]");
    if (!button || button.dataset.language === activeLanguage) return;
    activeLanguage = button.dataset.language;
    window.history.replaceState({}, "", `?lang=${activeLanguage}${window.location.hash}`);
    renderPage();
  });

  renderPage();
})();
