'use client';

import { useEffect } from 'react';

export default function IframeResizer() {
  useEffect(() => {
    const sendHeight = () => {
      window.parent.postMessage({ type: 'iframeHeight', height: document.documentElement.scrollHeight }, '*');
    };
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.documentElement);
    sendHeight();
    return () => observer.disconnect();
  }, []);

  return null;
}
