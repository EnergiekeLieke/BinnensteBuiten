'use client';

import { useEffect } from 'react';

export default function IframeResizer() {
  useEffect(() => {
    let rafId: ReturnType<typeof requestAnimationFrame>;
    let laatste = 0;

    const stuur = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // Meet <main>, niet body — body heeft min-h-screen waardoor hij
        // altijd minstens de viewporthoogte rapporteert
        const doel = document.querySelector('main') ?? document.body;
        const h = doel.scrollHeight;
        if (Math.abs(h - laatste) > 8) {
          laatste = h;
          window.parent.postMessage({ type: 'iframeHeight', height: h + 32 }, '*');
        }
      });
    };

    const doel = document.querySelector('main') ?? document.body;
    const observer = new ResizeObserver(stuur);
    observer.observe(doel);

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
