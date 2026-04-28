gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. THE WORMHOLE ENTRANCE
// ==========================================
// Fade out the white flash immediately upon loading the page
gsap.to("#entrance-flash", {
    opacity: 0,
    duration: 1.2,
    ease: "power2.out",
    onComplete: () => {
        document.getElementById("entrance-flash").style.display = "none";
    }
});

// Drop-in animation for the Hero section
gsap.from(".project-hero > *", {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.3 // Wait for the flash to clear slightly
});

// ==========================================
// 2. SCROLL REVEALS
// ==========================================
// Fade in the project details smoothly as you scroll down
const revealElements = document.querySelectorAll(".reveal-element");

revealElements.forEach((el) => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 85%", // Triggers when the top of the element hits 85% down the screen
            toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});

// ==========================================
// 3. 3D TILT EFFECT (Vanilla JS Architecture)
// ==========================================
const tiltWrappers = document.querySelectorAll('.tilt-wrapper');

tiltWrappers.forEach(wrapper => {
    const image = wrapper.querySelector('.tilt-image');

    wrapper.addEventListener('mousemove', (e) => {
        // Get dimensions of the container
        const rect = wrapper.getBoundingClientRect();
        
        // Calculate mouse position relative to the center of the container (-1 to 1)
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        
        // Apply the 3D rotation (multiplier controls intensity. 10 = max 10 degrees)
        const rotateX = y * -10; 
        const rotateY = x * 10;
        
        image.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Add a dynamic glow that follows the mouse
        image.style.boxShadow = `${-x * 20}px ${-y * 20}px 50px rgba(0, 242, 255, 0.15)`;
    });

    // Reset when mouse leaves
    wrapper.addEventListener('mouseleave', () => {
        image.style.transform = `rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        image.style.boxShadow = `0 20px 50px rgba(0,0,0,0.5)`;
    });
});

// ==========================================
// 4. REVERSE HYPERDRIVE (EXIT SEQUENCE)
// ==========================================
const backBtn = document.querySelector(".back-btn");

if (backBtn) {
    backBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Stop the browser from instantly changing pages
        const targetUrl = backBtn.getAttribute("href");
        
        // Turn the flash screen back on and fade it to pure white
        const flashScreen = document.getElementById("entrance-flash");
        flashScreen.style.display = "block";
        
        gsap.to(flashScreen, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                // Once the screen is pure white, ACTUALLY change the page
                window.location.href = targetUrl;
            }
        });
    });
}

// ==========================================
// 5. AMBIENT DATA PARTICLES (BULLETPROOF)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const ambientContainer = document.getElementById("ambient-particles");

    if (ambientContainer) {
        const particleCount = 50; 

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("div");
            particle.classList.add("ambient-particle");

            const size = Math.random() * 3 + 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            ambientContainer.appendChild(particle);

            gsap.set(particle, {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: Math.random() * 0.5 + 0.3 
            });

            gsap.to(particle, {
                y: "-=1000", 
                x: `+=${(Math.random() - 0.5) * 150}`, 
                opacity: 0, 
                duration: Math.random() * 8 + 7, 
                repeat: -1,
                ease: "none",
                onRepeat: () => {
                    gsap.set(particle, {
                        y: window.innerHeight + 50,
                        x: Math.random() * window.innerWidth,
                        opacity: Math.random() * 0.5 + 0.3
                    });
                }
            });
        }
    } else {
        console.warn("RG DEBUG: Could not find #ambient-particles in the HTML.");
    }
});