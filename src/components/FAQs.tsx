import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { faqDetails, faqs } from "../data/faqs";

const FAQs: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faqs"
      aria-labelledby="faqs-title"
      className="bg-[var(--fq-bg)] px-3 pt-[clamp(40px,6vw,60px)] pb-[clamp(56px,8vw,110px)] text-fg sm:px-6"
    >
      <h2
        id="faqs-title"
        className="text-center text-[clamp(2rem,4vw,3.2rem)] leading-tight font-bold tracking-[-.01em]"
      >
        {faqDetails.heading}
      </h2>

      <div className="mx-auto mt-[clamp(28px,4vw,55px)] max-w-[920px] bg-[var(--fq-card)]">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.question}>
              <h3>
                <button
                  type="button"
                  id={`faq-q-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex min-h-[90px] w-full cursor-pointer items-start justify-between gap-6 px-5 pt-[18px] text-left"
                >
                  <span className="text-[clamp(1rem,1.6vw,1.25rem)] leading-7 font-semibold">
                    {f.question}
                  </span>
                  <span className="mt-1 shrink-0 text-[var(--fq-plus)]" aria-hidden="true">
                    {isOpen ? (
                      <Minus size={28} strokeWidth={1.25} />
                    ) : (
                      <Plus size={28} strokeWidth={1.25} />
                    )}
                  </span>
                </button>
              </h3>
              {/* Grid-rows trick animates the height; inert keeps closed answers out of reach. */}
              <div
                id={`faq-a-${i}`}
                role="region"
                aria-labelledby={`faq-q-${i}`}
                inert={!isOpen}
                className={`grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-[70ch] px-5 pb-8 text-fg2">{f.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQs;
