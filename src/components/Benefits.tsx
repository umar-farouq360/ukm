import { benefits, benefitsDetails } from "../data/benefits";
import { Wrap } from "./ui";

const Benefits: React.FC = () => {
  const { heading, image, imageAlt } = benefitsDetails;

  return (
    <section
      id="benefits"
      aria-labelledby="benefits-title"
      className="bg-surface py-[clamp(48px,8vw,96px)] text-fg"
    >
      <Wrap>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-[clamp(24px,4vw,56px)]">
          {/* Illustration with decorative shapes */}
          <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[600px]">
            {/* green blob */}
            <svg className="absolute left-[4%] top-[22%] w-[92%]" viewBox="0 0 400 380" aria-hidden="true" focusable="false">
              <path d="M30 110 C45 40 120 20 170 50 C230 85 270 100 335 130 C410 170 410 250 360 290 C310 330 250 320 200 340 C130 365 40 330 22 250 C14 205 18 150 30 110Z" fill="#A2DD3E" />
            </svg>
            {/* red arc */}
            <svg className="absolute left-[3%] top-[2%] w-[32%]" viewBox="0 0 200 270" fill="none" aria-hidden="true" focusable="false">
              <path d="M176 18 C100 8 26 60 22 130 C20 175 40 210 62 232" stroke="#E94D4D" strokeWidth="20" strokeLinecap="round" />
            </svg>
            {/* purple arc */}
            <svg className="absolute bottom-[1%] right-[2%] w-[25%]" viewBox="0 0 160 160" fill="none" aria-hidden="true" focusable="false">
              <path d="M82 12 C128 14 150 56 148 92 C146 128 112 152 76 148 C50 146 30 134 12 118" stroke="#9A6CF7" strokeWidth="26" strokeLinecap="butt" />
            </svg>
            {/* dotted triangle */}
            <div
              className="absolute bottom-[1%] left-[2%] h-[36%] w-[40%] text-fg"
              style={{
                backgroundImage: "radial-gradient(currentColor 3px, transparent 3.5px)",
                backgroundSize: "clamp(16px,2vw,26px) clamp(16px,2vw,26px)",
                clipPath: "polygon(0 0, 0 100%, 100% 100%)",
              }}
              aria-hidden="true"
            />
            <img
              src={image}
              alt={imageAlt}
              width={480}
              height={640}
              loading="lazy"
              className="absolute left-[19%] top-[6%] w-[58%]"
            />
          </div>

          {/* Benefits list */}
          <div>
            <h2
              id="benefits-title"
              className="font-display text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.3] font-bold tracking-[-.01em]"
            >
              {heading}
            </h2>
            <ul className="mt-[clamp(28px,4.5vw,62px)] flex flex-col gap-[clamp(28px,4.5vw,64px)]">
              {benefits.map((b) => (
                <li key={b.title} className="grid grid-cols-[auto_1fr] items-center gap-[clamp(16px,2.6vw,38px)]">
                  <span
                    className="grid size-[clamp(72px,7.4vw,110px)] shrink-0 place-items-center rounded-full text-white"
                    style={{ background: b.gradient }}
                    aria-hidden="true"
                  >
                    {b.icon}
                  </span>
                  <div>
                    <h3 className="font-display text-[clamp(1.25rem,2vw,1.75rem)] leading-tight font-medium">{b.title}</h3>
                    <p className="mt-2.5 max-w-[34em] text-[clamp(.95rem,1.15vw,1.05rem)] leading-relaxed text-fg2">{b.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Wrap>
    </section>
  );
};

export default Benefits;
