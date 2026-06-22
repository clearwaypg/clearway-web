'use client';

import {useEffect, useRef} from 'react';

import {Link} from '@/i18n/navigation';
import styles from './NotFound.module.css';

/* =========================================================
   404 — Clearway Performance Group
   Faithful port of the 404 design guide. A ball is fired at
   the goal behind a giant ghost "404"; on impact the ghost
   flashes and particles spray, then it bounces, rolls and
   fades, looping forever.
   ========================================================= */

const cx = (...names: Array<string | false | null | undefined>) =>
  names
    .filter(Boolean)
    .map((n) => styles[n as string] ?? (n as string))
    .join(' ');

export function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ghost = ghostRef.current;
    if (!canvas || !ghost) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let raf = 0;
    let ghostTimer = 0;

    function resize() {
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = W * DPR;
      canvas!.height = H * DPR;
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function goalRect() {
      const gw = Math.min(W * 0.22, 280);
      const gh = Math.min(H * 0.46, 300);
      const gx = W * 0.74 - gw / 2;
      const gy = H * 0.18;
      return {gx, gy, gw, gh};
    }

    const ball = {x: 0, y: 0, r: 0, rot: 0};
    const S = {WAIT: 0, FLY: 1, HIT: 2, BOUNCE: 3, ROLL: 4, FADE: 5};
    let state = S.WAIT;
    let stateT = 0;
    let hitX = 0;
    let hitY = 0;
    let bounceVX = 0;
    let bounceVY = 0;
    let impactAmt = 0;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      life: number;
    }> = [];
    let trail: Array<{x: number; y: number; r: number; a: number}> = [];
    let lastTs = 0;
    const DUR: Record<number, number> = {
      0: 2,
      1: 0.72,
      2: 0.48,
      3: 0.8,
      4: 1.6,
      5: 0.55
    };

    function initShot() {
      const {gx, gy, gw, gh} = goalRect();
      ball.r = Math.min(W, H) * 0.038;
      ball.rot = 0;
      ball.x = W * 0.1;
      ball.y = H * 0.72;
      const useRight = Math.random() > 0.5;
      hitX = useRight ? gx + gw : gx;
      hitY = gy + gh * (0.15 + Math.random() * 0.5);
      const dir = useRight ? 1 : -1;
      bounceVX = dir * (4 + Math.random() * 3);
      bounceVY = -(3 + Math.random() * 2);
      impactAmt = 0;
      particles = [];
      trail = [];
    }

    function spawnParticles(x: number, y: number) {
      for (let i = 0; i < 22; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 1.5 + Math.random() * 7;
        particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 2,
          r: 1 + Math.random() * 3.5,
          life: 1
        });
      }
    }

    function updateParticles(dt: number) {
      particles = particles.filter((p) => p.life > 0);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28;
        p.vx *= 0.97;
        p.life -= dt * 1.8;
      }
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeIn = (t: number) => t * t * t;
    const clamp = (v: number, lo: number, hi: number) =>
      Math.max(lo, Math.min(hi, v));

    function drawBg() {
      const {gx, gy, gw, gh} = goalRect();
      const cxp = gx + gw / 2;
      const cyp = gy + gh / 2;
      const gr = ctx!.createRadialGradient(
        cxp,
        cyp,
        0,
        cxp,
        cyp,
        Math.max(W, H) * 0.75
      );
      gr.addColorStop(0, '#0c1f47');
      gr.addColorStop(1, '#050f24');
      ctx!.fillStyle = gr;
      ctx!.fillRect(0, 0, W, H);
    }

    function drawGoal() {
      const {gx, gy, gw, gh} = goalRect();
      const POST = 6;
      ctx!.save();
      ctx!.beginPath();
      ctx!.rect(gx, gy, gw, gh);
      ctx!.clip();
      ctx!.strokeStyle = 'rgba(208,216,226,.07)';
      ctx!.lineWidth = 1;
      const cols = 10;
      const rows = 8;
      for (let i = 1; i < cols; i++) {
        const nx = gx + gw * (i / cols);
        ctx!.beginPath();
        ctx!.moveTo(nx, gy);
        ctx!.lineTo(nx + gw * 0.06, gy + gh);
        ctx!.stroke();
      }
      for (let j = 1; j < rows; j++) {
        const ny = gy + gh * (j / rows);
        ctx!.beginPath();
        ctx!.moveTo(gx, ny);
        ctx!.lineTo(gx + gw, ny);
        ctx!.stroke();
      }
      ctx!.restore();
      ctx!.save();
      ctx!.lineCap = 'round';
      ctx!.lineJoin = 'round';
      ctx!.shadowColor = 'rgba(255,255,255,.50)';
      ctx!.shadowBlur = 22;
      ctx!.strokeStyle = '#fff';
      ctx!.lineWidth = POST;
      ctx!.beginPath();
      ctx!.moveTo(gx, gy);
      ctx!.lineTo(gx, gy + gh);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(gx + gw, gy);
      ctx!.lineTo(gx + gw, gy + gh);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(gx - POST / 2, gy);
      ctx!.lineTo(gx + gw + POST / 2, gy);
      ctx!.stroke();
      ctx!.shadowBlur = 5;
      ctx!.lineWidth = POST * 0.4;
      ctx!.strokeStyle = '#ffffff';
      ctx!.beginPath();
      ctx!.moveTo(gx, gy);
      ctx!.lineTo(gx, gy + gh);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(gx + gw, gy);
      ctx!.lineTo(gx + gw, gy + gh);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(gx - POST / 2, gy);
      ctx!.lineTo(gx + gw + POST / 2, gy);
      ctx!.stroke();
      ctx!.restore();
    }

    function drawImpact(x: number, y: number, amt: number) {
      if (amt <= 0) return;
      ctx!.save();
      const bloom = ctx!.createRadialGradient(x, y, 0, x, y, ball.r * 7 * amt);
      bloom.addColorStop(0, `rgba(255,255,255,${0.88 * amt})`);
      bloom.addColorStop(0.3, `rgba(210,228,255,${0.4 * amt})`);
      bloom.addColorStop(1, 'rgba(0,0,0,0)');
      ctx!.fillStyle = bloom;
      ctx!.beginPath();
      ctx!.arc(x, y, ball.r * 7 * amt, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function drawParticles() {
      for (const p of particles) {
        if (p.life <= 0) continue;
        ctx!.save();
        ctx!.globalAlpha = Math.max(0, p.life) * 0.9;
        ctx!.shadowColor = 'rgba(208,216,226,.8)';
        ctx!.shadowBlur = 5;
        ctx!.fillStyle = '#fff';
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r * Math.max(0, p.life), 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
    }

    function addTrail(x: number, y: number) {
      trail.push({x, y, r: ball.r, a: 0.3});
      if (trail.length > 12) trail.shift();
      for (const t of trail) t.a *= 0.76;
    }
    function drawTrail() {
      for (const t of trail) {
        if (t.a < 0.015) continue;
        ctx!.save();
        ctx!.globalAlpha = t.a;
        ctx!.fillStyle = 'rgba(208,216,226,.6)';
        ctx!.beginPath();
        ctx!.arc(t.x, t.y, t.r * 0.45, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
    }

    function drawBall(x: number, y: number, rot: number, alpha?: number) {
      const r = ball.r;
      ctx!.save();
      if (alpha != null) ctx!.globalAlpha = alpha;
      ctx!.translate(x, y);
      ctx!.rotate(rot);
      const g = ctx!.createRadialGradient(
        -r * 0.28,
        -r * 0.32,
        r * 0.04,
        0,
        0,
        r * 1.05
      );
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.38, '#f0f4fa');
      g.addColorStop(0.72, '#d8e0ee');
      g.addColorStop(1, '#b2bccc');
      ctx!.beginPath();
      ctx!.arc(0, 0, r, 0, Math.PI * 2);
      ctx!.fillStyle = g;
      ctx!.fill();
      ctx!.save();
      ctx!.clip();
      const penta = (cxp: number, cyp: number, size: number, angle: number) => {
        ctx!.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = angle + (i * (Math.PI * 2)) / 5 - Math.PI / 2;
          ctx!.lineTo(cxp + Math.cos(a) * size, cyp + Math.sin(a) * size);
        }
        ctx!.closePath();
      };
      ctx!.fillStyle = '#0a2a5e';
      penta(0, 0, r * 0.38, 0);
      ctx!.fill();
      const dist = r * 0.68;
      for (let i = 0; i < 5; i++) {
        const a = (i * (Math.PI * 2)) / 5 - Math.PI / 2;
        penta(Math.cos(a) * dist, Math.sin(a) * dist, r * 0.24, a + Math.PI);
        ctx!.fill();
      }
      ctx!.restore();
      const sh = ctx!.createRadialGradient(
        -r * 0.3,
        -r * 0.35,
        0,
        -r * 0.1,
        -r * 0.15,
        r * 0.9
      );
      sh.addColorStop(0, 'rgba(255,255,255,.42)');
      sh.addColorStop(0.4, 'rgba(255,255,255,.08)');
      sh.addColorStop(1, 'rgba(5,15,36,.28)');
      ctx!.beginPath();
      ctx!.arc(0, 0, r, 0, Math.PI * 2);
      ctx!.fillStyle = sh;
      ctx!.fill();
      ctx!.restore();
    }

    function loop(ts: number) {
      raf = requestAnimationFrame(loop);
      const dt = clamp((ts - lastTs) / 1000, 0, 0.05);
      lastTs = ts;
      stateT += dt;
      const dur = DUR[state];
      const p = clamp(stateT / dur, 0, 1);
      updateParticles(dt);
      if (impactAmt > 0) impactAmt -= dt * 2.5;
      ctx!.clearRect(0, 0, W, H);
      drawBg();
      drawGoal();

      if (state === S.WAIT) {
        trail.length = 0;
        const bob = Math.sin(stateT * 1.6) * 3.5;
        drawBall(ball.x, ball.y + bob, ball.rot, 1);
        if (p >= 1) {
          state = S.FLY;
          stateT = 0;
          initShot();
        }
      } else if (state === S.FLY) {
        const pe = easeOut(p);
        const BX = lerp(ball.x, hitX, pe);
        const arc = -H * 0.34 * Math.sin(pe * Math.PI);
        const BY = lerp(ball.y, hitY, pe) + arc;
        ball.rot += dt * 12;
        addTrail(BX, BY);
        drawTrail();
        drawParticles();
        drawBall(BX, BY, ball.rot, 1);
        if (p >= 1) {
          state = S.HIT;
          stateT = 0;
          spawnParticles(hitX, hitY);
          impactAmt = 1;
          ghost!.classList.add(styles.hit);
          window.clearTimeout(ghostTimer);
          ghostTimer = window.setTimeout(
            () => ghost!.classList.remove(styles.hit),
            500
          );
        }
      } else if (state === S.HIT) {
        const vibr = (1 - p) * ball.r * 0.22;
        const BX = hitX + Math.sin(stateT * 52) * vibr;
        const BY = hitY + Math.cos(stateT * 44) * vibr;
        ball.rot += dt * 3;
        drawTrail();
        drawImpact(hitX, hitY, impactAmt);
        drawParticles();
        drawBall(BX, BY, ball.rot, 1);
        ball.x = BX;
        ball.y = BY;
        if (p >= 1) {
          state = S.BOUNCE;
          stateT = 0;
        }
      } else if (state === S.BOUNCE) {
        ball.x += bounceVX;
        ball.y += bounceVY;
        bounceVY += 0.38;
        if (ball.y > H * 0.74 && Math.abs(bounceVY) > 1) {
          bounceVY *= -0.44;
          bounceVX *= 0.82;
        }
        ball.rot += bounceVX * 0.07;
        drawTrail();
        drawImpact(hitX, hitY, clamp(impactAmt, 0, 1));
        drawParticles();
        drawBall(ball.x, ball.y, ball.rot, 1);
        if (p >= 1) {
          state = S.ROLL;
          stateT = 0;
        }
      } else if (state === S.ROLL) {
        ball.x += bounceVX * 0.045;
        bounceVX *= 0.96;
        ball.rot += bounceVX * 0.052;
        drawParticles();
        drawBall(ball.x, ball.y, ball.rot, 1);
        if (p >= 1) {
          state = S.FADE;
          stateT = 0;
        }
      } else if (state === S.FADE) {
        const alpha = 1 - easeIn(p);
        ball.x += bounceVX * 0.03;
        bounceVX *= 0.95;
        ball.rot += bounceVX * 0.04;
        drawBall(ball.x, ball.y, ball.rot, alpha);
        if (p >= 1) {
          state = S.WAIT;
          stateT = 0;
          trail.length = 0;
          particles = [];
          ball.x = W * 0.1;
          ball.y = H * 0.72;
        }
      }
    }

    resize();
    initShot();
    ball.x = W * 0.1;
    ball.y = H * 0.72;
    ball.r = Math.min(W, H) * 0.038;
    raf = requestAnimationFrame((ts) => {
      lastTs = ts;
      loop(ts);
    });
    function onResize() {
      resize();
      initShot();
      ball.x = W * 0.1;
      ball.y = H * 0.72;
    }
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(ghostTimer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className={cx('page')}>
      <div className={cx('grain')} aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg">
          <filter id="nf-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={4} />
          </filter>
          <rect width="100%" height="100%" filter="url(#nf-grain)" />
        </svg>
      </div>

      <nav className={cx('nav')}>
        <Link href="/" className={cx('logo')} aria-label="Clearway Performance Group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Logotipos/clearway-white.svg" alt="Clearway Performance Group" />
        </Link>
        <div className={cx('navLinks')}>
          <Link href="/for-clubs">For Clubs</Link>
          <Link href="/for-players">For Players</Link>
        </div>
      </nav>

      <div ref={ghostRef} className={cx('ghost')} aria-hidden>
        404
      </div>
      <canvas ref={canvasRef} className={cx('canvas')} aria-hidden />

      <div className={cx('copy')}>
        <div className={cx('copyInner')}>
          <div className={cx('eyebrow')}>Error 404 · Page not found</div>
          <h1 className={cx('title')}>
            <span className={cx('thin')}>This page didn&apos;t</span>
            <br />
            make the cut.
          </h1>
          <p className={cx('sub')}>
            Seven of every hundred players get through the filter.
            <br />
            This page didn&apos;t get through either.
          </p>
          <div className={cx('btns')}>
            <Link href="/" className={cx('btn', 'btnSolid')}>
              Back to home →
            </Link>
            <Link href="/for-clubs" className={cx('btn', 'btnGhost')}>
              For Clubs
            </Link>
            <Link href="/for-players" className={cx('btn', 'btnGhost')}>
              For Players
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
