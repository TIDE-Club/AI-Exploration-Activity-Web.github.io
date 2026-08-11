(function () {
  const DATA = window.ACTIVITY_DATA;
  const app = document.getElementById("faq-app");
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

  function renderItems(items) {
    return items.map(item => `
      <article class="faq-item">
        <div class="faq-question">
          <span class="faq-marker" aria-hidden="true">Q</span>
          <h2>${esc(item.question)}</h2>
        </div>
        <div class="faq-answer">
          <span class="faq-marker" aria-hidden="true">A</span>
          <p>${esc(item.answer)}</p>
        </div>
      </article>
    `).join("");
  }

  function renderPage() {
    const content = DATA[activeLanguage];
    const faq = content.faqPage;
    const isEnglish = activeLanguage === "en";
    const homeUrl = `./?lang=${activeLanguage}`;

    document.documentElement.lang = content.lang;
    document.title = faq.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", `${faq.title} · ${content.footerBrand}`);
    document.getElementById("faq-brand").setAttribute("href", homeUrl);
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
        <section class="activity-hero faq-page-hero" aria-labelledby="faq-title">
          <div class="container hero-content">
            <a class="faq-back-link" href="${esc(homeUrl)}"><span aria-hidden="true">←</span>${esc(faq.back)}</a>
            <p class="hero-eyebrow">${esc(faq.eyebrow)}</p>
            <h1 id="faq-title">${esc(faq.title)}</h1>
            <p class="hero-secondary" lang="${isEnglish ? "zh-CN" : "en"}">${esc(faq.secondaryTitle)}</p>
          </div>
        </section>

        <section class="document-area">
          <div class="container document-container">
            <article class="activity-document" lang="${content.lang}">
              <p class="faq-intro">${esc(faq.intro)}</p>
              <div class="faq-list">
                ${renderItems(faq.items)}
              </div>
              <section class="faq-question-cta">
                <h2>${esc(faq.questionTitle)}</h2>
                <p>${esc(faq.questionBody)}</p>
                <a class="action-button" href="${esc(DATA.questionUrl)}" target="_blank" rel="noopener noreferrer">
                  ${esc(faq.questionButton)} <span aria-hidden="true">↗</span>
                </a>
              </section>
            </article>
          </div>
        </section>
      </div>
    `;
  }

  languageSwitch.addEventListener("click", event => {
    const button = event.target.closest("[data-language]");
    if (!button || button.dataset.language === activeLanguage) return;
    activeLanguage = button.dataset.language;
    window.history.replaceState({}, "", `?lang=${activeLanguage}`);
    renderPage();
  });

  renderPage();
})();
