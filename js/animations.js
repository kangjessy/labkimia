// js/animations.js

document.addEventListener("DOMContentLoaded", () => {
  // 1. Framer-like Scroll Reveals
  const revealElements = document.querySelectorAll(
    ".reveal-up, .reveal-scale, .reveal-fade"
  );

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          observer.unobserve(entry.target); // Animate only once
        }
      });
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    }
  );

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // 2. Number Counter Animation
  const numberElements = document.querySelectorAll(".counter-value");

  const animateValue = (obj, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Add + sign if needed
        if(obj.dataset.plus === "true") obj.innerHTML += "+";
      }
    };
    window.requestAnimationFrame(step);
  };

  const numberObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute("data-target"));
          animateValue(entry.target, 0, target, 2500);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  numberElements.forEach((el) => numberObserver.observe(el));

  // 3. Cursor Glow Effect
  const glow = document.createElement("div");
  glow.id = "cursor-glow";
  document.body.appendChild(glow);
  
  // Only show glow on non-touch devices
  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      requestAnimationFrame(() => {
        glow.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
      });
    }, {passive: true});
  }

  // 4. Subtle Parallax for Hero blobs
  const blobs = document.querySelectorAll(".hero-bg .blob");
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    requestAnimationFrame(() => {
      blobs.forEach((blob, index) => {
        const speed = (index + 1) * 0.1;
        // Keep the original translates and append the scroll parallax
        blob.style.transform = `translateY(${scrollY * speed}px)`;
      });
    });
  }, {passive: true});
});
