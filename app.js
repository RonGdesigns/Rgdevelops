gsap.registerPlugin(ScrollTrigger);

// 1. The Bug Fix: Bulletproof 3D Timeline
const sections = gsap.utils.toArray(".section");

sections.forEach((section, i) => {
  // We create a specific timeline for EACH section
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "body",
      start: `${i * 100}vh`,
      end: `${(i + 1) * 100}vh`,
      scrub: 1, // Smooth scrub
    }
  });

  // Start configuration: far away, invisible
  gsap.set(section, { z: -2500, opacity: 0, visibility: "hidden" });

  tl.to(section, { visibility: "visible", duration: 0.01 }) // Snap on
    .to(section, { z: 0, opacity: 1, duration: 0.4, ease: "power1.out" }) // Fly to readable distance
    .to(section, { z: 500, opacity: 0, duration: 0.4, ease: "power1.in" }) // Fly past camera and fade
    .to(section, { visibility: "hidden", duration: 0.01 }); // Snap off (Fixes the ghosting)
});

// 2. Color Morphing Logic
// Array of colors corresponding to each section
const colors = ["#050505", "#0a192f", "#1a0b2e", "#001a1a", "#0d1117", "#1a0008"];

ScrollTrigger.create({
  trigger: "body",
  start: "top top",
  end: "bottom bottom",
  scrub: true,
  onUpdate: (self) => {
    // Calculate which color index we should be on based on scroll progress
    const progress = self.progress;
    const colorIndex = Math.floor(progress * (colors.length - 1));
    document.body.style.backgroundColor = colors[colorIndex];
  }
});

// 3. Particle Stream Generator
const particleContainer = document.getElementById("particles-container");
const particleCount = 150; // Adjust for more/less density

for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement("div");
  particle.classList.add("particle");

  // Randomize starting positions
  const x = (Math.random() - 0.5) * window.innerWidth * 2;
  const y = (Math.random() - 0.5) * window.innerHeight * 2;

  gsap.set(particle, { x: x, y: y, z: -2000, opacity: Math.random() });

  // Infinite loop animation flying toward the camera
  gsap.to(particle, {
    z: 500,
    opacity: 0,
    duration: "random(2, 5)", // Random speed for depth perception
    repeat: -1,
    ease: "none",
    delay: "random(0, 3)" // Stagger the starts
  });

  particleContainer.appendChild(particle);
}

// Top Progress Bar
gsap.to("#progress", {
  width: "100%",
  scrollTrigger: { scrub: 0.2 }
});
