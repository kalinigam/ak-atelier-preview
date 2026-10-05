// Section-only previews open destination sections in the complete page.
if (document.documentElement.classList.contains('services-only')) {
  document.querySelectorAll('#channels a[href^="#"]').forEach(link => {
    const destination = new URL(link.getAttribute('href'), location.href);
    destination.search = '';
    link.href = destination.href;
    link.target = '_blank';
    link.rel = 'noopener';
  });
}
// Measure both ends of each connector so text wrapping and viewport changes
// cannot separate the lines from their service ports or the central ring.
(() => {
  const grid = document.querySelector('.system-grid');
  if (!grid) return;
  const hub = grid.querySelector('.system-hub');
  const core = grid.querySelector('.system-core');
  const svg = grid.querySelector('.system-wires');
  const ports = [...grid.querySelectorAll('.system-port')];
  const paths = [...svg.querySelectorAll('path')];
  let pending = false;
  function draw() {
    pending = false;
    const bounds = grid.getBoundingClientRect();
    if (!bounds.width || !hub.getBoundingClientRect().width) return;
    const portBoxes = ports.map(port => port.getBoundingClientRect());
    // The visual center belongs between the heading rows, not between the
    // outer card edges: differing paragraph lengths must not lower the logo.
    const headingCenter = portBoxes.reduce((sum, box) => sum + box.top + box.height / 2, 0) / portBoxes.length;
    const coreBounds = core.getBoundingClientRect();
    hub.style.transform = `translateY(${headingCenter - coreBounds.top - coreBounds.height / 2}px)`;
    const circle = hub.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    const cx = circle.left + circle.width / 2 - bounds.left;
    const cy = circle.top + circle.height / 2 - bounds.top;
    const radius = circle.width / 2;
    ports.forEach((port, index) => {
      const box = portBoxes[index];
      const sx = box.left + box.width / 2 - bounds.left;
      const sy = box.top + box.height / 2 - bounds.top;
      const side = index % 2 === 0 ? -1 : 1;
      const dy = (index < 2 ? -1 : 1) * radius * .4;
      const ex = cx + side * Math.sqrt(radius * radius - dy * dy);
      const ey = cy + dy;
      const bend = (sx + ex) / 2;
      paths[index].setAttribute('d', `M ${sx} ${sy} C ${bend} ${sy}, ${bend} ${ey}, ${ex} ${ey}`);
    });
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(draw); }
  }
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observer.observe(grid);
    observer.observe(hub);
    ports.forEach(port => observer.observe(port.parentElement));
  }
  window.addEventListener('resize', schedule);
  document.fonts.ready.then(schedule);
  schedule();
})();
// Native details remain usable without JavaScript. This adds image switching.
(() => {
  const section = document.querySelector('.focus-services');
  if (!section) return;
  const items = [...section.querySelectorAll('details')];
  const images = [...section.querySelectorAll('.focus-art img')];
  const title = section.querySelector('[data-focus-title]');
  const count = section.querySelector('[data-focus-count]');
  items.forEach((item, index) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach(other => { if (other !== item) other.open = false; });
      images.forEach((image, imageIndex) => image.classList.toggle('is-active', imageIndex === index));
      title.textContent = item.querySelector('h3').textContent;
      count.textContent = `0${index + 1} / 04`;
    });
  });
})();
