/* Render the portrait as a black-and-white halftone on the new blue ground. */
(() => {
  const img = document.querySelector('.hero-portrait-circle img');
  if (!img) return;
  const render = () => {
    try {
      const size = 720, cell = 5;
      const source = document.createElement('canvas');
      source.width = source.height = size;
      const sc = source.getContext('2d', { willReadFrequently: true });
      sc.drawImage(img, 0, 0, size, size);
      const pixels = sc.getImageData(0, 0, size, size).data;
      const out = document.createElement('canvas');
      out.width = out.height = size;
      const ctx = out.getContext('2d');
      ctx.fillStyle = '#4CA0FF'; ctx.fillRect(0, 0, size, size);
      for (let y = 0; y < size; y += cell) for (let x = 0; x < size; x += cell) {
        let light = 0, count = 0;
        for (let dy = 0; dy < cell; dy++) for (let dx = 0; dx < cell; dx++) {
          const i = ((y + dy) * size + x + dx) * 4;
          const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
          if (r > 125 && r > g * 1.2 && g > b * 1.35) continue;
          light += .2126 * r + .7152 * g + .0722 * b; count++;
        }
        if (count < cell * cell * .5) continue;
        ctx.fillStyle = '#fff'; ctx.fillRect(x, y, cell, cell);
        ctx.fillStyle = '#111'; ctx.beginPath();
        ctx.arc(x + cell / 2, y + cell / 2, cell * .70 * Math.sqrt(1 - light / count / 255), 0, Math.PI * 2); ctx.fill();
      }
      img.src = out.toDataURL('image/png');
    } catch (_) { /* Leave the original portrait available if canvas is blocked. */ }
  };
  if (img.complete && img.naturalWidth) render();
  else img.addEventListener('load', render, { once: true });
})();
