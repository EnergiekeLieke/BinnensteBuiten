'use client';

import { useEffect } from 'react';

export default function IframeResizer() {
  useEffect(() => {
    const sendHeight = () => {
      window.parent.postMessage({ type: 'iframeHeight', height: document.documentElement.scrollHeight + 32 }, '*');
    };

    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.documentElement);

    sendHeight();
    setTimeout(sendHeight, 300);
    setTimeout(sendHeight, 800);

    window.addEventListener('load', sendHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('load', sendHeight);
    };
  }, []);

  return null;
}
