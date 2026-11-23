(() => {
  const sources = ['assets/works/showreel-02/showreel-cover.png', 'assets/works/presentation-01/cover-antireal.png'];
  const recolor = (img) => {
    if (img.dataset.blueCover) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently:true });
      ctx.drawImage(img, 0, 0);
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height), p = image.data;
      for (let i = 0; i < p.length; i += 4) {
        const r = p[i], g = p[i+1], b = p[i+2];
        if (g > 95 && g > b * 1.4 && g > r * 1.05) {
          const intensity = Math.max(r,g,b) / 255;
          p[i] = 76 * intensity; p[i+1] = 160 * intensity; p[i+2] = 255 * intensity;
        }
      }
      ctx.putImageData(image, 0, 0); img.dataset.blueCover = '1'; img.src = canvas.toDataURL('image/png');
    } catch (_) { /* Keep the original when image pixels cannot be accessed. */ }
  };
  document.querySelectorAll('.work-preview img').forEach(img => {
    if (!sources.some(src => img.getAttribute('src') === src)) return;
    if (img.complete && img.naturalWidth) recolor(img);
    else img.addEventListener('load', () => recolor(img), { once:true });
  });
})();
