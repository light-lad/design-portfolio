(() => {
  const img = document.querySelector('.hero-portrait-circle img');
  if (!img) return;
  const render = () => {
    try {
      const size = 720, cell = 5, count = size * size;
      const source = document.createElement('canvas'); source.width = source.height = size;
      const sc = source.getContext('2d', { willReadFrequently: true });
      sc.drawImage(img, 0, 0, size, size);
      const px = sc.getImageData(0, 0, size, size).data;
      const mask = new Uint8Array(count), queue = new Int32Array(count);
      const br = px[0], bg = px[1], bb = px[2];
      let start = 0, end = 0;
      function visit(i) {
        if (mask[i]) return;
        const p = i * 4;
        const d = Math.abs(px[p] - br) + Math.abs(px[p + 1] - bg) + Math.abs(px[p + 2] - bb);
        if (d > 60) return;
        mask[i] = 1; queue[end++] = i;
      }
      for (let x = 0; x < size; x++) { visit(x); visit((size - 1) * size + x); }
      for (let y = 1; y < size - 1; y++) { visit(y * size); visit(y * size + size - 1); }
      while (start < end) {
        const i = queue[start++], x = i % size, y = (i / size) | 0;
        if (x > 0) visit(i - 1); if (x + 1 < size) visit(i + 1);
        if (y > 0) visit(i - size); if (y + 1 < size) visit(i + size);
      }
      const out = document.createElement('canvas'); out.width = out.height = size;
      const ctx = out.getContext('2d'); ctx.fillStyle = '#4CA0FF'; ctx.fillRect(0, 0, size, size);
      for (let y = 0; y < size; y += cell) for (let x = 0; x < size; x += cell) {
        let light = 0, n = 0;
        for (let dy = 0; dy < cell; dy++) for (let dx = 0; dx < cell; dx++) {
          const i = (y + dy) * size + x + dx;
          if (mask[i]) continue;
          const p = i * 4; light += .2126 * px[p] + .7152 * px[p + 1] + .0722 * px[p + 2]; n++;
        }
        if (n < cell * cell * .5) continue;
        ctx.fillStyle = '#fff'; ctx.fillRect(x, y, cell, cell);
        ctx.fillStyle = '#111'; ctx.beginPath();
        ctx.arc(x + cell / 2, y + cell / 2, cell * .70 * Math.sqrt(1 - light / n / 255), 0, Math.PI * 2); ctx.fill();
      }
      img.src = out.toDataURL('image/png');
    } catch (_) { /* Preserve the original if pixels cannot be read. */ }
  };
  if (img.complete && img.naturalWidth) render();
  else img.addEventListener('load', render, { once: true });
})();