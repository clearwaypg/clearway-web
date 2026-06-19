'use client';

import {useEffect} from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/* Subtle wheel smoothing — removes the stepped/jumpy feel of native mouse
   scroll without adding heavy inertia. A high lerp keeps it close to normal
   scrolling (fast, continuous, not floaty). Lenis drives real document scroll,
   so existing IntersectionObservers keep firing. Disabled when the user prefers
   reduced motion. Touch is left native (smoothing touch feels laggy). */
export function SmoothScroll({children}: {children: React.ReactNode}) {
  useEffect(() => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduce) return;

    const lenis = new Lenis({
      lerp: 0.13, // high → close to native, minimal float
      smoothWheel: true,
      syncTouch: false // keep native touch scrolling
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
