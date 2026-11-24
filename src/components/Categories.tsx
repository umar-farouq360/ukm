import { Link } from "react-router-dom";
import { categoriesDetails, categoryCards } from "../data/categories";
import { CATEGORY_ICON, H2, Label, Wrap } from "./ui";

const Categories: React.FC = () => {
  return (
    <section
      id="cats"
      aria-labelledby="cats-title"
      className="bg-surface pt-[clamp(48px,8vw,90px)] text-fg"
    >
      <Wrap className="mb-10 text-center">
        <Label>{categoriesDetails.label}</Label>
        <H2>
          <span id="cats-title">{categoriesDetails.heading}</span>
        </H2>
      </Wrap>

      {/* w-fit + mx-auto centres the cards when they fit, and they still scroll sideways on small screens */}
      <div
        tabIndex={0}
        aria-label={categoriesDetails.heading}
        className="mx-auto flex w-fit max-w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categoryCards.map((cat) => {
          const Icon = CATEGORY_ICON[cat.id];
          return (
            <Link
              key={cat.id}
              to={`/courses?category=${cat.id}`}
              className="group flex min-h-[520px] w-[min(340px,80vw)] flex-none snap-start flex-col items-center gap-1.5 border border-b-0 border-line bg-surface p-[32px_22px] text-center text-fg no-underline hover:bg-fg hover:text-surface"
            >
              <h3 className="font-display text-[1.35rem] leading-[1.15] font-bold tracking-[-.01em]">
                {cat.name}
              </h3>
              <div className="text-[.85rem] text-muted group-hover:text-surface/70">
                {cat.who}
              </div>
              <div
                className="m-auto grid size-[130px] place-items-center rounded-3xl border-[1.5px] border-current opacity-90"
                aria-hidden="true"
              >
                <Icon size={56} strokeWidth={1.25} />
              </div>
              <div className="min-h-24">
                <span className="mb-2.5 block text-[.82rem]">
                  {cat.count} courses
                </span>
                {cat.subjects.map((s) => (
                  <i
                    key={s}
                    className="m-[3px] inline-block rounded-full border border-line px-3.5 py-[5px] text-[.75rem] not-italic group-hover:border-surface/40"
                  >
                    {s}
                  </i>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
