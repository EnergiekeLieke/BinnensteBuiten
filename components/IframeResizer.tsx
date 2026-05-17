'use client';

import { useEffect } from 'react';

export default function IframeResizer() {
  useEffect(() => {
    let rafId: ReturnType<typeof requestAnimationFrame>;
    let laatste = 0;

    const stuur = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // offsetHeight is stabieler dan scrollHeight en triggert geen loop
        const h = document.body.offsetHeight;
        if (Math.abs(h - laatste) > 8) {
          laatste = h;
          window.parent.postMessage({ type: 'iframeHeight', height: h + 32 }, '*');
        }
      });
    };

    // Observeer body, niet documentElement (voorkomt scroll-feedback)
    const observer = new ResizeObserver(stuur);
    observer.observe(document.body);

    stuur();
    const t1 = setTimeout(stuur, 300);
    const t2 = setTimeout(stuur, 800);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return null;
}
