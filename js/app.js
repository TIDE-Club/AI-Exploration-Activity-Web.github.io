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

  function renderLabeledBlocks(items) {
    return items.map(item => {
      if (item.items) {
        return `
          <div class="labeled-list">
            <p><strong>${esc(item.label)}</strong></p>
            <ul>${item.items.map(entry => `<li>${esc(entry)}</li>`).join("")}</ul>
            ${item.note ? `<p class="labeled-list-note">${esc(item.note)}</p>` : ""}
          </div>
        `;
      }

      return `<p>${item.label ? `<strong>${esc(item.label)}</strong> ` : ""}${esc(item.text)}</p>`;
    }).join("");
  }

  function renderPage() {
    const content = DATA[activeLanguage];
    const isEnglish = activeLanguage === "en";
    const faqUrl = `./faq.html?lang=${activeLanguage}`;

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
            <p class="hero-signature">${esc(content.signature[0])}</p>
          </div>
        </section>

        <section class="document-area">
          <div class="container document-container">
            <article class="activity-document" lang="${content.lang}">
              <section class="document-section award-section">
                <div class="document-prose labeled-prose">
                  ${renderLabeledBlocks(content.award.blocks)}
                </div>
              </section>

              <section class="document-section question-section">
                <h2>${esc(content.question.title)}</h2>
                <p>${esc(content.question.body)}</p>
                <div class="question-actions">
                  <a class="action-button question-button" href="${esc(DATA.questionUrl)}" target="_blank" rel="noopener noreferrer">
                    ${esc(content.question.button)} <span aria-hidden="true">↗</span>
                  </a>
                  <a class="document-link" href="${esc(faqUrl)}">
                    ${esc(content.faqLink.button)} <span aria-hidden="true">→</span>
                  </a>
                </div>
              </section>

              <section class="document-section submission-section" id="submission-notice" tabindex="-1">
                <h2>${esc(content.submission.title)}</h2>
                <div class="submission-details">
                  ${renderLabeledBlocks(content.submission.details)}
                </div>
                <div class="submission-action">
                  <p class="submission-link-label"><strong>${esc(content.submission.linkLabel)}</strong></p>
                  <a class="action-button submission-button" href="${esc(DATA.submissionUrl)}" target="_blank" rel="noopener noreferrer">
                    ${esc(content.submission.button)} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </section>

            </article>
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
