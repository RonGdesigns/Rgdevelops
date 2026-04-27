gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.normalizeScroll(true);

const sections = gsap.utils.toArray(".section");
const colors = ["#050505", "#0a192f", "#1a0b2e", "#001a1a", "#0d1117", "#1a0008"];

// UX Tweak: Increase this number (e.g., 150, 200) to make the scrolling feel slower and more deliberate.
const scrollPacing = 500;

sections.forEach((section, i) => {
  const isLastSection = i === sections.length - 1;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "body",
      // Use our new scrollPacing variable
      start: `${i * scrollPacing}vh`,
      end: `${(i + 1) * scrollPacing}vh`,
      scrub: 0.5,
      onEnter: () => gsap.to("body", { backgroundColor: colors[i], duration: 1 }),
      onEnterBack: () => gsap.to("body", { backgroundColor: colors[i], duration: 1 })
    }
  });

  gsap.set(section, { z: -2500, opacity: 0, visibility: "hidden" });

  if (isLastSection) {
    tl.to(section, { visibility: "visible", duration: 0.01 })
      .to(section, { z: 0, opacity: 1, duration: 1, ease: "power2.out" });
  } else {
    tl.to(section, { visibility: "visible", duration: 0.01 })

      // Phase 1: Fly in from the distance
      .to(section, { z: 0, opacity: 1, duration: 1, ease: "power2.out" })

      // Phase 2: THE DWELL STATE (The Fix)
      // The element does nothing here, giving the user time to read it as they swipe
      .to(section, { z: 0, opacity: 1, duration: 1.5 })

      // Phase 3: Fly past the camera and fade out
      .to(section, { z: 800, opacity: 0, duration: 1, ease: "power2.in" })

      .to(section, { visibility: "hidden", duration: 0.01 });
  }

}
);

// ==========================================
// 3D PARTICLE STREAM (THE STARFIELD)
// ==========================================
const particleContainer = document.getElementById("particles-container");
const particleCount = 150;

for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement("div");
  particle.classList.add("particle");

  const x = (Math.random() - 0.5) * window.innerWidth * 2;
  const y = (Math.random() - 0.5) * window.innerHeight * 2;

  gsap.set(particle, { x: x, y: y, z: -2000, opacity: Math.random() });

  gsap.to(particle, {
    z: 500, opacity: 0, duration: "random(2, 5)",
    repeat: -1, ease: "none", delay: "random(0, 3)"
  });

  particleContainer.appendChild(particle);
}

gsap.to("#progress", { width: "100%", scrollTrigger: { scrub: 0.2 } });

// ==========================================
// HYPERDRIVE PAGE TRANSITION (APPROACH B)
// ==========================================
const projects = document.querySelectorAll(".interactive-project");

projects.forEach(project => {
  project.addEventListener("click", (e) => {
    const targetUrl = project.getAttribute("data-url");
    if (!targetUrl) return;

    document.body.style.overflow = "hidden";
    const warpTL = gsap.timeline();

    warpTL.to("#world", { scale: 15, opacity: 0, duration: 0.8, ease: "power4.in" }, 0)
      .to("#hyperdrive-flash", { opacity: 1, duration: 0.4, ease: "power2.in" }, "-=0.4")
      .call(() => { window.location.href = targetUrl; });
  });
});
