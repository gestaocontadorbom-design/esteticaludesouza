const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const fadeElements = document.querySelectorAll(".fade-in");
const whatsappForm = document.querySelector("#whatsapp-form");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const whatsappNumber = "5511968862848";

const buildWhatsAppLink = (message) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

whatsappLinks.forEach((link) => {
  const currentUrl = new URL(link.href);
  const currentMessage = currentUrl.searchParams.get("text") || "Olá, quero agendar um atendimento.";
  link.href = buildWhatsAppLink(currentMessage);
});

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  fadeElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  fadeElements.forEach((element) => observer.observe(element));
}

if (whatsappForm) {
  whatsappForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(whatsappForm);
    const nome = String(formData.get("nome") || "").trim();
    const procedimento = String(formData.get("procedimento") || "").trim();
    const observacoes = String(formData.get("observacoes") || "").trim();

    if (!nome || !procedimento) {
      whatsappForm.reportValidity();
      return;
    }

    const messageLines = [
      `Olá! Meu nome é ${nome}.`,
      `Tenho interesse no procedimento: ${procedimento}.`,
    ];

    if (observacoes) {
      messageLines.push(`Observações: ${observacoes}.`);
    }

    messageLines.push("Gostaria de mais informações e de agendar meu atendimento.");

    window.open(buildWhatsAppLink(messageLines.join("\n")), "_blank", "noopener,noreferrer");
  });
}
