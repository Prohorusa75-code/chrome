"use client";

import { MetalShader } from "./metal-shader";

/* Фон Hero: жидкий металлический шар позади текста.
   (Замена компонента 21st.dev «Liquid Metal Hero» — его не удалось скачать из-за лимита аккаунта;
   по заданию запасной вариант — LiquidMetal из @paper-design/shaders-react напрямую.) */
export function LiquidMetalHero() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
      <div className="relative aspect-square w-[min(120vw,760px)]">
        {/* CSS-фолбэк: виден, пока грузится шейдер, и при «меньше движения» */}
        <div className="metal-orb absolute inset-[14%] opacity-90 blur-[1px]" />
        <MetalShader
          className="absolute inset-0"
          shape="circle"
          colorBack="#08080a"
          colorTint="#ffffff"
          repetition={2}
          softness={0.12}
          shiftRed={0}
          shiftBlue={0}
          distortion={0.08}
          contour={0.45}
          angle={70}
          scale={0.78}
          speed={0.8}
          maxPixelCount={1600 * 1600}
        />
      </div>
      {/* затемнение к центру, чтобы текст читался поверх металла */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle, rgba(8,8,10,.92) 0%, rgba(8,8,10,.75) 38%, transparent 70%)" }} />
    </div>
  );
}
