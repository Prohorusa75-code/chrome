"use client";

import { useEffect, useRef } from "react";

/* Вращающийся кованый диск на canvas.
   Шина и тормозной диск заранее нарисованы в отдельные картинки и только поворачиваются,
   спицы заливаются хромом каждый кадр: блик стоит на месте, а металл проезжает под ним.
   При загрузке диск раскручен и плавно замедляется; при прокрутке страницы ускоряется,
   свет чуть следует за курсором. Кадры считаются, только пока диск виден. */

const SIZE = 1000; // система координат рисунка: центр в (0,0), радиус шины 500
const SPOKES = 5;

const CHROME: [number, string][] = [
  [0, "#2c2c31"],
  [0.08, "#f6f6f8"],
  [0.17, "#6a6a71"],
  [0.3, "#1f1f23"],
  [0.42, "#b9b9c0"],
  [0.5, "#ffffff"],
  [0.6, "#55555b"],
  [0.74, "#26262a"],
  [0.86, "#d9d9de"],
  [0.94, "#74747b"],
  [1, "#2c2c31"],
];

function conic(ctx: CanvasRenderingContext2D, start: number) {
  const g = ctx.createConicGradient(start, 0, 0);
  CHROME.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}

function layer(draw: (c: CanvasRenderingContext2D) => void, px: number) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = px;
  const c = cv.getContext("2d")!;
  c.scale(px / SIZE, px / SIZE);
  c.translate(SIZE / 2, SIZE / 2);
  draw(c);
  return cv;
}

function ring(c: CanvasRenderingContext2D, outer: number, inner: number) {
  c.beginPath();
  c.arc(0, 0, outer, 0, Math.PI * 2);
  c.arc(0, 0, inner, 0, Math.PI * 2, true);
}

/* шина: боковина, надпись по кругу и протектор по краю */
function drawTyre(c: CanvasRenderingContext2D) {
  const g = c.createRadialGradient(0, 0, 395, 0, 0, 500);
  g.addColorStop(0, "#070708");
  g.addColorStop(0.35, "#17171b");
  g.addColorStop(0.8, "#101013");
  g.addColorStop(1, "#050506");
  c.fillStyle = g;
  ring(c, 498, 392);
  c.fill("evenodd");

  c.fillStyle = "#26262b";
  for (let i = 0; i < 120; i++) {
    c.save();
    c.rotate((i / 120) * Math.PI * 2);
    c.fillRect(-3.5, -498, 7, 15);
    c.restore();
  }

  c.strokeStyle = "#232328";
  c.lineWidth = 1.5;
  [478, 412].forEach((r) => {
    c.beginPath();
    c.arc(0, 0, r, 0, Math.PI * 2);
    c.stroke();
  });

  c.fillStyle = "#3d3d44";
  c.font = "600 25px var(--font-inter-tight), Arial, sans-serif";
  c.textAlign = "center";
  const text = "CHROME  ·  285/35 ZR22  ·  RUNFLAT  ·  CHROME  ·  285/35 ZR22  ·  RUNFLAT  ·  ";
  const step = (Math.PI * 2) / text.length;
  [...text].forEach((ch, i) => {
    c.save();
    c.rotate(i * step);
    c.fillText(ch, 0, -436);
    c.restore();
  });
}

/* тормозной диск с насечками и перфорацией */
function drawBrake(c: CanvasRenderingContext2D) {
  c.fillStyle = "#050506";
  c.beginPath();
  c.arc(0, 0, 392, 0, Math.PI * 2);
  c.fill();

  const g = c.createRadialGradient(0, 0, 120, 0, 0, 320);
  g.addColorStop(0, "#3a3a40");
  g.addColorStop(0.55, "#5a5a61");
  g.addColorStop(0.9, "#35353a");
  g.addColorStop(1, "#1a1a1d");
  c.fillStyle = g;
  ring(c, 318, 130);
  c.fill("evenodd");

  c.strokeStyle = "#1b1b1f";
  c.lineWidth = 6;
  c.lineCap = "round";
  for (let i = 0; i < 12; i++) {
    c.save();
    c.rotate((i / 12) * Math.PI * 2);
    c.beginPath();
    c.moveTo(14, -150);
    c.quadraticCurveTo(46, -225, 20, -306);
    c.stroke();
    c.restore();
  }

  c.fillStyle = "#101013";
  for (let i = 0; i < 36; i++) {
    c.save();
    c.rotate((i / 36) * Math.PI * 2);
    c.beginPath();
    c.arc(0, -(180 + (i % 3) * 42), 6.5, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }
}

/* одна Y-образная спица: контур от ступицы к ободу */
function spokePath(): Path2D {
  const p = new Path2D();
  p.moveTo(-30, -96);
  p.bezierCurveTo(-34, -170, -44, -215, -86, -268);
  p.lineTo(-118, -364);
  p.lineTo(-74, -372);
  p.bezierCurveTo(-52, -300, -24, -262, 0, -236);
  p.bezierCurveTo(24, -262, 52, -300, 74, -372);
  p.lineTo(118, -364);
  p.lineTo(86, -268);
  p.bezierCurveTo(44, -215, 34, -170, 30, -96);
  p.closePath();
  return p;
}

export function SpinningWheel({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const baseSpeed = calm ? 0.28 : 0.42; // радиан в секунду
    const spoke = spokePath();
    let tyre: HTMLCanvasElement | null = null;
    let brake: HTMLCanvasElement | null = null;
    let px = 0;

    const prepare = () => {
      const size = Math.round(canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 1.5));
      if (!size || size === px) return;
      px = size;
      canvas.width = canvas.height = px;
      tyre = layer(drawTyre, px);
      brake = layer(drawBrake, px);
    };

    let angle = 0;
    let speed = calm ? 1.4 : 5.5; // при загрузке диск раскручен и выбегает до обычной скорости
    let scrollBoost = 0;
    let light = -0.9;
    let lightTarget = -0.9;
    let lastY = window.scrollY;
    let last = performance.now();
    let raf = 0;
    let visible = true;

    const draw = () => {
      if (!tyre || !brake) return;
      const s = px / SIZE;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, px, px);
      ctx.setTransform(s, 0, 0, s, px / 2, px / 2);

      const blit = (img: HTMLCanvasElement) => {
        ctx.save();
        ctx.rotate(angle);
        ctx.drawImage(img, -SIZE / 2, -SIZE / 2, SIZE, SIZE);
        ctx.restore();
      };
      blit(tyre);
      blit(brake);

      // суппорт стоит на месте и не вращается
      ctx.save();
      ctx.rotate(1.05);
      ctx.fillStyle = "#17171b";
      ctx.strokeStyle = "#4a4a50";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-92, -336, 184, 92, 26);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#6e6e76";
      ctx.font = "600 26px var(--font-inter-tight), Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("CHROME", 0, -281);
      ctx.restore();

      // обод: неподвижный блик
      ctx.fillStyle = conic(ctx, light);
      ring(ctx, 392, 366);
      ctx.fill("evenodd");
      ctx.strokeStyle = "#08080a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 380, 0, Math.PI * 2);
      ctx.stroke();

      // заклёпки кованого обода вращаются вместе с диском
      ctx.fillStyle = "#101013";
      for (let i = 0; i < 30; i++) {
        const a = angle + (i / 30) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 379, Math.sin(a) * 379, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // спицы: тень, затем хром, блик остаётся на месте
      const sheen = conic(ctx, light - angle);
      for (let i = 0; i < SPOKES; i++) {
        ctx.save();
        ctx.rotate(angle + (i / SPOKES) * Math.PI * 2);
        ctx.save();
        ctx.translate(7, 9);
        ctx.fillStyle = "rgba(0,0,0,.62)";
        ctx.fill(spoke);
        ctx.restore();
        ctx.restore();
      }
      for (let i = 0; i < SPOKES; i++) {
        const a = (i / SPOKES) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle + a);
        ctx.fillStyle = conic(ctx, light - angle - a);
        ctx.fill(spoke);
        ctx.strokeStyle = "rgba(255,255,255,.28)";
        ctx.lineWidth = 1.5;
        ctx.stroke(spoke);
        ctx.restore();
      }

      // ступица, болты и колпачок
      ctx.save();
      ctx.rotate(angle);
      ctx.fillStyle = sheen;
      ctx.beginPath();
      ctx.arc(0, 0, 112, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0c0c0f";
      ctx.beginPath();
      ctx.arc(0, 0, 100, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < SPOKES; i++) {
        const a = ((i + 0.5) / SPOKES) * Math.PI * 2;
        const x = Math.cos(a) * 73;
        const y = Math.sin(a) * 73;
        ctx.fillStyle = "#8a8a92";
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#17171b";
        ctx.beginPath();
        ctx.arc(x, y, 6.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = sheen;
      ctx.beginPath();
      ctx.arc(0, 0, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0a0a0c";
      ctx.font = "600 56px var(--font-inter-tight), Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("C", 0, 3);
      ctx.textBaseline = "alphabetic";
      ctx.restore();
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const y = window.scrollY;
      scrollBoost = Math.min(9, scrollBoost + Math.abs(y - lastY) * 0.012);
      lastY = y;
      scrollBoost *= Math.pow(0.08, dt);
      speed += (baseSpeed - speed) * (1 - Math.pow(0.22, dt));
      angle = (angle + (speed + scrollBoost) * dt) % (Math.PI * 2);
      light += (lightTarget - light) * (1 - Math.pow(0.02, dt));
      draw();
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      lightTarget = -0.9 + Math.max(-1, Math.min(1, nx)) * 0.7;
    };
    const onResize = () => {
      prepare();
      draw();
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        lastY = window.scrollY;
        raf = requestAnimationFrame(loop);
      }
    });

    prepare();
    draw();
    // шрифт надписей мог ещё не загрузиться — перерисуем слои, когда он будет готов
    document.fonts?.ready.then(() => {
      px = 0;
      prepare();
    });
    io.observe(canvas);
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className={`block aspect-square w-full ${className}`} aria-hidden="true" />;
}
