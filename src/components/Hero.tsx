import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProgrammeLinks from "./ProgrammeLinks";
import { heroDetails } from "../data/hero";

const Hero: React.FC = () => {
  const {
    heading,
    subheading,
    primaryCta,
    secondaryCta,
    imageSrc,
    imageAlt,
    badges,
  } = heroDetails;

  return (
    <section
      id="hero"
      aria-label="Welcome"
      className="grid lg:grid-cols-[1.05fr_1fr] items-center gap-10 lg:gap-6 px-[clamp(1.25rem,4.7vw,4.5rem)] pt-6 md:pt-10 lg:pt-4 pb-10 lg:pb-8"
    >
      <div>
        <h1
          id="page-title"
          tabIndex={-1}
          className="font-display font-bold text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.17] tracking-[-0.01em] outline-none"
        >
          {heading.map((line, i) => (
            <span key={line}>
              {line}
              {i < heading.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="mt-6 lg:mt-9 max-w-[36rem] text-[clamp(1rem,1.33vw,1.25rem)] leading-[1.9]">
          {subheading}
        </p>

        <div className="mt-8 lg:mt-12 flex flex-wrap items-center gap-3 sm:gap-4">
          <Link
            to={primaryCta.url}
            className="group inline-flex items-center gap-5 h-14 md:h-16 xl:h-[72px] pl-7 pr-1.5 rounded-full bg-hx-accent text-hx-on-accent text-base xl:text-xl font-medium"
          >
            {primaryCta.text}
            <span
              className="grid place-items-center size-11 md:size-[52px] xl:size-[60px] rounded-full bg-white text-black transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <ArrowRight size={22} />
            </span>
          </Link>
          <button
            type="button"
            onClick={() =>
              document
                .getElementById(secondaryCta.targetId)
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="h-14 md:h-16 xl:h-[72px] px-10 xl:px-14 rounded-full border border-hx-ink/60 text-base xl:text-xl hover:bg-hx-ink hover:text-hx-card transition-colors"
          >
            {secondaryCta.text}
          </button>
        </div>

        <ProgrammeLinks />
      </div>

      {/* Portrait: layered discs, student illustration and floating badges */}
      <div className="relative w-full max-w-[360px] sm:max-w-[520px] lg:max-w-[650px] aspect-square mx-auto lg:ml-auto lg:mr-0 mt-14 lg:mt-12 lg:-mr-[1.6vw]">
        <div
          className="absolute inset-0 rounded-full shadow-[0_30px_80px_-20px_rgba(150,115,230,.45)]"
          style={{
            background:
              "radial-gradient(circle at 50% 28%, color-mix(in srgb, var(--hx-card) 70%, var(--hx-disc)) 0%, color-mix(in srgb, var(--hx-disc) 45%, var(--hx-card)) 58%, color-mix(in srgb, var(--hx-ink) 38%, var(--hx-disc)) 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-[8%] rounded-full bg-[var(--hx-disc)]"
          aria-hidden="true"
        />
        <img
          src={imageSrc}
          alt={imageAlt}
          width={400}
          height={540}
          className="absolute mt-14 left-[10%] w-[80%] top-[-11%]"
          fetchPriority="high"
        />
        {badges.map((b, i) => (
          <span
            key={i}
            className={b.className}
            style={{
              background:
                "linear-gradient(135deg, var(--hx-glass-from), var(--hx-glass-to))",
            }}
            aria-hidden="true"
          >
            {b.icon}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Hero;
