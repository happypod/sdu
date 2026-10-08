"use strict";

// Update only the decorative background; stop requesting frames once it settles.
function initializeGradient() {
  const gradient = document.querySelector("#ambient-gradient");
  if (!gradient) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let currentX = 0.5;
  let currentY = 0.5;
  let targetX = 0.5;
  let targetY = 0.5;
  let frame = 0;
  let lastTime = 0;

  function paint() {
    gradient.style.setProperty("--glow-x", `${(28 + currentX * 44).toFixed(2)}%`);
    gradient.style.setProperty("--glow-y", `${(20 + currentY * 44).toFixed(2)}%`);
    gradient.style.setProperty("--sun-hue", (39 + currentX * 14).toFixed(2));
    gradient.style.setProperty("--sky-hue", (180 + currentY * 22).toFixed(2));
    gradient.style.setProperty("--peach-hue", (20 + currentY * 12).toFixed(2));
  }

  function isEnabled() {
    return finePointer.matches && !reducedMotion.matches && !document.hidden;
  }

  function animate(time) {
    frame = 0;
    if (!isEnabled()) return;
    const elapsed = lastTime ? Math.min(time - lastTime, 64) : 16;
    lastTime = time;
    const easing = 1 - Math.exp(-elapsed / 110);
    currentX += (targetX - currentX) * easing;
    currentY += (targetY - currentY) * easing;
    const settled = Math.abs(targetX - currentX) + Math.abs(targetY - currentY) < 0.0005;
    if (settled) { currentX = targetX; currentY = targetY; }
    paint();
    if (!settled) frame = requestAnimationFrame(animate);
  }

  function schedule() {
    if (!frame && isEnabled()) {
      lastTime = 0;
      frame = requestAnimationFrame(animate);
    }
  }

  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    currentX = currentY = targetX = targetY = 0.5;
    paint();
  }

  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || !isEnabled()) return;
    targetX = Math.max(0, Math.min(1, event.clientX / window.innerWidth));
    targetY = Math.max(0, Math.min(1, event.clientY / window.innerHeight));
    schedule();
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => {
    targetX = targetY = 0.5;
    schedule();
  });
  window.addEventListener("blur", reset);
  document.addEventListener("visibilitychange", reset);
  reducedMotion.addEventListener("change", reset);
  finePointer.addEventListener("change", reset);
}

initializeGradient();
