import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { Reveal } from "@/components/ui/reveal";
import { REVIEWS } from "@/lib/data";
import { SECTION, WRAP } from "./wrap";

export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className={`${WRAP} ${SECTION}`}>
      <Reveal className="text-center">
        <p className="text-[13px] tracking-[0.3em] text-text-muted uppercase">Отзывы</p>
        <h2 id="reviews-title" className="chrome-text mt-5 text-[clamp(36px,4.8vw,68px)] leading-[1.02] font-light tracking-[-0.04em]">
          Говорят владельцы
        </h2>
      </Reveal>
      <Reveal delay={0.1} className="mt-16">
        <AnimatedTestimonials testimonials={REVIEWS} autoplay interval={7000} />
      </Reveal>
    </section>
  );
}
