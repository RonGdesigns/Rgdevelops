gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.normalizeScroll(true);

const sections = gsap.utils.toArray(".section");
const colors = ["#050505", "#0a192f", "#1a0b2e", "#001a1a", "#0d1117", "#1a0008"];

// Mobile optimized pacing
const scrollPacing = 3.5; 

sections.forEach((section, i) => {
    const isLastSection = i === sections.length - 1;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "body",
            // THE FIX: Hard pixel math. No browser can misinterpret this.
            start: () => i * (window.innerHeight * scrollPacing),
            end: () => (i + 1) * (window.innerHeight * scrollPacing),
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
          .to(section, { z: 0, opacity: 1, duration: 1, ease: "power2.out" })
          .to(section, { z: 0, opacity: 1, duration: 8 }) // MASSIVE RATIO HOLD
          .to(section, { z: 800, opacity: 0, duration: 1, ease: "power2.in" })
          .to(section, { visibility: "hidden", duration: 0.01 });
    }
});

// ==========================================
// 3D PARTICLE STREAM (HYPER-WARP TUNNEL)
// ==========================================
const particleContainer = document.getElementById("particles-container");
// 1. Boosted the density to 250 so space feels full
const particleCount = 250; 

for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // 2. Dynamic sizing (2px to 6px) to create extreme depth perception
    const size = Math.random() * 4 + 2; 
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // 3. The Glow: Adds a massive, scaled halo around each star
    particle.style.boxShadow = `0 0 ${size * 4}px ${size}px rgba(255, 255, 255, 0.9)`;
    particle.style.background = "#ffffff";

    // Spread them wider so they wrap around the edges of ultra-wide monitors
    const x = (Math.random() - 0.5) * window.innerWidth * 3;
    const y = (Math.random() - 0.5) * window.innerHeight * 3;

    // Start deep in the background, invisible
    gsap.set(particle, { x: x, y: y, z: -3000, opacity: 0 });

    // 4. The Warp Physics
    gsap.to(particle, {
        z: 1000, // Fly completely past the camera lens
        opacity: Math.random() * 0.8 + 0.2, // Randomize brightness
        duration: "random(1.5, 3.5)", // Much faster base speed
        repeat: -1, 
        ease: "power3.in", // THE MAGIC: They accelerate exponentially as they get closer
        delay: "random(0, 2)"
    });

    particleContainer.appendChild(particle);
}

gsap.to("#progress", { width: "100%", scrollTrigger: { scrub: 0.2 } });

// ==========================================
// ROCKET SHIP PHYSICS (STABILIZED HYBRID ENGINE)
// ==========================================
const rocket = document.getElementById("rocket-ship");
const flame = document.getElementById("rocket-flame");

// 1. Reset position (Removed xPercent, CSS handles centering now)
gsap.set(rocket, { rotation: 0, x: 0, y: 0 });

let isManualMode = false;
let floatAnim;

// 2. THE CHOREOGRAPHED SCROLL PATH
const flightTL = gsap.timeline({
    scrollTrigger: {
        id: "rocketScroll",
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 2 
    }
});

flightTL
    .to(rocket, { y: "-25vh", rotation: 0, duration: 1, ease: "none" })
    .to(rocket, { x: "40vw", rotation: 90, duration: 1, ease: "power1.inOut" })
    .to(rocket, { y: "-85vh", rotation: 0, duration: 2, ease: "power1.inOut" })
    .to(rocket, { x: "-40vw", rotation: -90, duration: 2, ease: "power1.inOut" })
    .to(rocket, { y: "-25vh", rotation: -180, duration: 2, ease: "power1.inOut" })
    .to(rocket, { x: "0vw", y: "0vh", rotation: -360, duration: 1.5, ease: "power1.inOut" });

// 3. THE FLAME IGNITION
ScrollTrigger.create({
    id: "flameScroll",
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
        if (isManualMode) return; 
        const speed = Math.abs(self.getVelocity());
        gsap.to(flame, {
            scaleY: 1 + (speed / 500),
            fill: speed > 600 ? "#ffffff" : "#ff0055",
            duration: 0.3,
            overwrite: "auto"
        });
    }
});

// 4. THE INTERACTIVE OVERRIDE
Draggable.create(rocket, {
    type: "x,y",
    inertia: true,
    onPress: function() {
        if (!isManualMode) {
            isManualMode = true;
            
            // 1. Freeze time and grab the EXACT physical pixel coordinates on the monitor
            const rect = rocket.getBoundingClientRect();
            
            // 2. Kill the scroll timelines
            ScrollTrigger.getById("rocketScroll").kill();
            ScrollTrigger.getById("flameScroll").kill();
            flightTL.kill();
            
            // 3. THE PIXEL LOCK: Strip the 'vh/vw' math and lock it to the raw pixels
            gsap.set(rocket, {
                x: 0, 
                y: 0,
                left: rect.left + "px",
                top: rect.top + "px",
                bottom: "auto", // We must delete the original "bottom: 5%" CSS rule
                transformOrigin: "center center"
            });
            
            // 4. Force Draggable to recalibrate from these new pixel coordinates
            this.update(); 
        }

        if (floatAnim) floatAnim.kill();
        
        gsap.to(flame, { scaleY: 3, fill: "#ffffff", duration: 0.2 });
        gsap.to(rocket, { scale: 1.1, duration: 0.2 }); 
    },
    onRelease: function() {
        gsap.to(flame, { scaleY: 1, fill: "#ff0055", duration: 0.5 });
        gsap.to(rocket, { scale: 1, duration: 0.5 });
        
        floatAnim = gsap.to(rocket, {
            y: "-=30",
            rotation: "+=10",
            duration: 2,
            yoyo: true, 
            repeat: -1, 
            ease: "sine.inOut"
        });
    }
});

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

// ==========================================
// STATE MANAGEMENT (RETURN TELEPORTATION)
// ==========================================
window.addEventListener("load", () => {
    // 1. Check the URL for our secret coordinate
    const urlParams = new URLSearchParams(window.location.search);
    const returnIndex = urlParams.get("returnTo");

    if (returnIndex !== null) {
        const i = parseInt(returnIndex);
        
        // 2. The Math: Calculate the perfect center of the Dwell State
        // `i` is the start of the section. `i + 0.5` is the exact middle.
        const targetScroll = (i + 0.5) * (window.innerHeight * scrollPacing);
        
        // 3. Instantly teleport the user's scrollbar to that pixel
        window.scrollTo({
            top: targetScroll,
            behavior: "instant" // 'instant' prevents the page from smoothly scrolling down, keeping the illusion unbroken
        });
    }
});


// ==========================================
// STATE MANAGEMENT (REVERSE HYPERDRIVE TELEPORT)
// ==========================================
window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const returnIndex = urlParams.get("returnTo");

    if (returnIndex !== null) {
        const i = parseInt(returnIndex);
        
        // 1. Calculate the exact center of the Dwell State
        const targetScroll = (i + 0.5) * (window.innerHeight * scrollPacing);
        
        // 2. Instantly teleport the scrollbar
        window.scrollTo({
            top: targetScroll,
            behavior: "instant" 
        });

        // 3. Set the starting frame for the Reverse Hyperdrive 
        // (Screen is white, 3D world is zoomed in massively)
        gsap.set("#hyperdrive-flash", { opacity: 1 });
        gsap.set("#world", { scale: 15, opacity: 0 });

        // 4. Animate the camera zooming OUT of the project
        const returnTL = gsap.timeline();
        
        // Slight delay gives the browser a millisecond to paint the scrollbar position
        returnTL.to("#hyperdrive-flash", { opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.1 })
                .to("#world", { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.8");
                
        // Clean up the URL so if they refresh, they don't get teleported again
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// ==========================================
// CUSTOM CURSOR TRACKING
// ==========================================
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

// QuickSetters for max performance (60fps without lag)
const setDotX = gsap.quickSetter(cursorDot, "x", "px");
const setDotY = gsap.quickSetter(cursorDot, "y", "px");
const setRingX = gsap.quickSetter(cursorRing, "x", "px");
const setRingY = gsap.quickSetter(cursorRing, "y", "px");

window.addEventListener("mousemove", (e) => {
    // Dot instantly follows the mouse
    setDotX(e.clientX);
    setDotY(e.clientY);
    
    // Ring follows with a slight, smooth delay
    gsap.to(cursorRing, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
});

// Expand ring when clicking
window.addEventListener("mousedown", () => gsap.to(cursorRing, { width: 45, height: 45, duration: 0.1 }));
window.addEventListener("mouseup", () => gsap.to(cursorRing, { width: 30, height: 30, duration: 0.1 }));

// ==========================================
// HIDDEN TERMINAL LOGIC
// ==========================================
const terminal = document.getElementById("dev-terminal");
const termInput = document.getElementById("term-input");
const termOutput = document.getElementById("term-output");

// Toggle Terminal on `~` or `\`` key
document.addEventListener("keydown", (e) => {
    if (e.key === "`" || e.key === "~") {
        e.preventDefault(); // Stops the backtick from typing in the input
        terminal.classList.toggle("active");
        if (terminal.classList.contains("active")) {
            termInput.value = "";
            termInput.focus();
        }
    }
});

// Command Processing
termInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const cmd = termInput.value.trim().toLowerCase();
        termInput.value = ""; // Clear input
        
        // Echo the command to the screen
        termOutput.innerHTML += `<p style="color: #fff;">> ${cmd}</p>`;

        // Command Dictionary
        if (cmd === "help") {
            termOutput.innerHTML += `<p>> Commands: whoami, stack, nightmare, clear</p>`;
        } else if (cmd === "whoami") {
            termOutput.innerHTML += `<p>> I am an engineer building high-performance digital architectures.</p>`;
        } else if (cmd === "stack") {
            termOutput.innerHTML += `<p>> React Native, GSAP, Node.js, Python, Three.js</p>`;
        } else if (cmd === "nightmare") {
            // THE THEME SWITCHER
            document.body.classList.toggle("nightmare-mode");
            if (document.body.classList.contains("nightmare-mode")) {
                termOutput.innerHTML += `<p style="color: #ff0055;">> OVERRIDE ACCEPTED. NIGHTMARE MODE ENGAGED.</p>`;
            } else {
                termOutput.innerHTML += `<p>> SYSTEM RESTORED. STANDARD MODE ENGAGED.</p>`;
            }
        } else if (cmd === "clear") {
            termOutput.innerHTML = "";
        } else if (cmd !== "") {
            termOutput.innerHTML += `<p>> Command not found: ${cmd}</p>`;
        } else if (cmd === "resume") {
            termOutput.innerHTML += `<p>> SECURE TRANSFER INITIATED: DOWNLOADING RESUME.PDF...</p>`;
            // Replace with your actual resume link
            window.open('assets/your-resume.pdf', '_blank'); 
            
        } else if (cmd === "email") {
            termOutput.innerHTML += `<p>> ESTABLISHING SECURE COMMLINK...</p>`;
            window.location.href = "mailto:youremail@example.com";
            
        } else if (cmd === "ls") {
            termOutput.innerHTML += `<p style="color: #00ffcc;">> DIRECTORIES: <br>&nbsp;&nbsp;irondigital/ <br>&nbsp;&nbsp;sortingsource/ <br>&nbsp;&nbsp;ezbreathe/ <br>&nbsp;&nbsp;pocketcode/</p>`;
            
        } else if (cmd.startsWith("cd ")) {
            const target = cmd.split(" ")[1];
            if (target === "irondigital" || target === "irondigital/") {
                termOutput.innerHTML += `<p>> JUMPING TO SECTOR: IRON DIGITAL...</p>`;
                setTimeout(() => window.location.href = "iron-digital.html", 800);
            } else {
                termOutput.innerHTML += `<p>> ERROR: Directory not found.</p>`;
            }
            
        } else if (cmd.startsWith("sudo ")) {
            termOutput.innerHTML += `<p style="color: #ff0055;">> SECURITY ALERT: User is not in the sudoers file. This incident will be reported to the architect.</p>`;
            
        } else if (cmd === "rm -rf /") {
            termOutput.innerHTML += `<p style="color: #ff0055; font-weight: bold;">> FATAL ERROR: CORE DELETION INITIATED.</p>`;
            // Shakes the entire webpage
            gsap.to("body", { x: "random(-10, 10)", y: "random(-10, 10)", duration: 0.05, repeat: 20, yoyo: true });
            setTimeout(() => location.reload(), 1500);
            
        }

        // Auto-scroll to bottom of terminal
        termOutput.scrollTop = termOutput.scrollHeight;
    }
});

