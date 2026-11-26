import { useState } from "react";
import { quotes, testimonialsDetails } from "../data/testimonials";
import { Button, H2, Label } from "./ui";

const Testimonials: React.FC = () => {
  const { label, heading, allLabel, role, image } = testimonialsDetails;
  const [i, setI] = useState(0);
  const [all, setAll] = useState(false);
  const list = all ? quotes : [quotes[i]];

  return (
    <section
      id="stories"
      aria-labelledby="stories-title"
      className="grid min-h-[620px] bg-hx-accent text-on-brand md:grid-cols-2"
    >
      <div className="flex flex-col items-start justify-between gap-[30px] border-b border-white/20 p-[clamp(28px,5vw,64px)_clamp(16px,4vw,40px)] md:border-r md:border-b-0">
        <div>
          <Label className="!text-white/90">{label}</Label>
          <H2>
            <span id="stories-title">{heading}</span>
          </H2>
        </div>
        <Button v="k" aria-pressed={all} onClick={() => setAll(!all)}>
          {allLabel}
        </Button>
      </div>

      <div className="relative flex flex-col justify-end gap-4 p-[clamp(28px,4vw,48px)_clamp(16px,4vw,40px)] pt-[90px] md:pt-12">
        <div
          className="absolute top-6 left-[clamp(16px,4vw,40px)] -skew-x-12 text-[7rem] leading-[.5] font-bold md:top-14"
          aria-hidden="true"
        >
          “
        </div>
        <img
          src={image}
          alt=""
          loading="lazy"
          className="-mb-2 w-[min(58%,300px)] self-end grayscale [mask-image:linear-gradient(#000_70%,transparent)]"
        />
        {list.map((s) => (
          <figure key={s.name} className="m-0">
            <blockquote className="m-0 max-w-[44ch] text-[1.02rem]">
              {s.text}
            </blockquote>
            <figcaption className="mt-4 border-t border-white/25 pt-[18px]">
              <b>{s.name}</b>
              <small className="block text-white/90">{role}</small>
            </figcaption>
          </figure>
        ))}
        <div className="flex gap-2 self-end">
          {quotes.map((q, k) => (
            <button
              key={q.name}
              aria-label={`Testimonial ${k + 1}`}
              aria-current={k === i && !all ? "true" : undefined}
              onClick={() => {
                setI(k);
                setAll(false);
              }}
              className={`h-3 cursor-pointer rounded-full ${k === i && !all ? "w-11 bg-white" : "w-3 bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
