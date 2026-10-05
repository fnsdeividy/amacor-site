/* =========================================================================
   AMACOR — versão "Sami"
   JS puro. Sem scroll suave (Lenis) de propósito aqui — o tom é direto,
   então o scroll nativo (mais "cru") combina melhor do que o efeito
   cinematográfico da versão Alice.
   ========================================================================= */

(function () {
  "use strict";

  var WHATSAPP_NUMBER = "5521972318026";

  /* ---------- WhatsApp: monta os links ---------- */
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    var msg = el.getAttribute("data-wa-msg") || "Olá! Quero saber mais sobre os planos de saúde da Amacor.";
    el.setAttribute("href", "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  /* ---------- Rastreamento de clique (conversão do Google Ads) ----------
     COMO LIGAR: adicione o Google Tag Manager no <head>, crie um gatilho
     de evento personalizado "whatsapp_click" e aponte pra tag de conversão. */
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.addEventListener("click", function () {
      var label = el.getAttribute("data-wa-label") || "whatsapp";
      if (typeof window.gtag === "function") {
        window.gtag("event", "whatsapp_click", { event_category: "conversao", event_label: label });
      }
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: "whatsapp_click", whatsapp_source: label });
      }
    });
  });

  /* ---------- Widget do hero: escolher plano atualiza o CTA
     (motivo: dar uma resposta imediata, sem formulário, reforçando o tom direto) ---------- */
  var widget = document.getElementById("hero-widget");
  if (widget) {
    var options = widget.querySelectorAll(".widget-option");
    var cta = document.getElementById("widget-cta");
    options.forEach(function (opt) {
      opt.addEventListener("click", function () {
        options.forEach(function (o) { o.classList.remove("is-active"); });
        opt.classList.add("is-active");
        var msg = opt.getAttribute("data-msg");
        cta.setAttribute("data-wa-msg", msg);
        cta.setAttribute("href", "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg));
      });
    });
  }

  /* ---------- Formulário de contato: envia sem recarregar a página ---------- */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var statusEl = document.getElementById("form-status");
      var submitBtn = contactForm.querySelector(".form-submit");
      statusEl.className = "form-status";
      statusEl.textContent = "";
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";

      fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          statusEl.classList.add(data.success ? "is-success" : "is-error");
          statusEl.textContent = data.message || (data.success ? "Enviado!" : "Algo deu errado.");
          if (data.success) {
            contactForm.reset();
            if (typeof window.gtag === "function") {
              window.gtag("event", "form_submit", { event_category: "conversao", event_label: "contact-form" });
            }
            if (Array.isArray(window.dataLayer)) {
              window.dataLayer.push({ event: "form_submit" });
            }
          }
        })
        .catch(function () {
          statusEl.classList.add("is-error");
          statusEl.textContent = "Não foi possível enviar agora. Tente pelo WhatsApp.";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Enviar mensagem";
        });
    });
  }

  /* ---------- FAQ ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    item.querySelector(".faq-q").addEventListener("click", function () {
      var open = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", open ? "false" : "true");
    });
  });

  /* ---------- Navegação por âncora (logo, menu, "Ver planos e preços") ---------- */
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href").slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  if (prefersReducedMotion || typeof gsap === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Reveal ao entrar na viewport (motivo: hierarquia de leitura) ---------- */
  document.querySelectorAll(".reveal").forEach(function (el) {
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: function () { el.classList.add("is-in"); },
    });
  });

  /* ---------- Modo QA: pula pra uma seção sem depender de âncora de URL
     (evita um bug conhecido do Edge headless com âncora + screenshot). ---------- */
  var isQaMode = /[?&]qa=1/.test(window.location.search);
  var gotoMatch = window.location.search.match(/[?&]goto=([a-zA-Z0-9-]+)/);
  if (isQaMode && gotoMatch) {
    var target = document.getElementById(gotoMatch[1]);
    if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
  }

  /* ---------- Números: contagem sobe ao entrar na viewport ---------- */
  document.querySelectorAll(".stat-num").forEach(function (el) {
    var raw = el.textContent.trim();
    var match = raw.match(/^([\d.,]+)(.*)$/);
    if (!match) return;
    var numPart = match[1];
    var suffix = match[2] || "";
    var isDecimalThousand = numPart.indexOf(".") > -1;
    var target = parseInt(numPart.replace(/\D/g, ""), 10);
    if (isNaN(target)) return;

    var counter = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      once: true,
      onEnter: function () {
        gsap.to(counter, {
          val: target,
          duration: 1.3,
          ease: "power2.out",
          onUpdate: function () {
            var v = Math.round(counter.val);
            var formatted = isDecimalThousand ? v.toLocaleString("pt-BR") : String(v);
            el.textContent = formatted + suffix;
          },
        });
      },
    });
  });
})();
