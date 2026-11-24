import { aboutDetails } from "../data/about";
import { H2, Icon, Label, Wrap } from "./ui";

const About: React.FC = () => {
  const { label, heading, bullets, paragraphs, features } = aboutDetails;

  return (
    <section
      id="about"
      aria-label="About"
      className="py-[clamp(48px,8vw,96px)] bg-surface text-fg"
    >
      <Wrap>
        <Label>{label}</Label>
        <H2>
          {heading.map((line, i) => (
            <span key={line}>
              {line}
              {i < heading.length - 1 && <br />}
            </span>
          ))}
        </H2>

        <div className="mt-11 grid gap-[clamp(24px,6vw,90px)] md:grid-cols-2">
          <ul className="max-w-[340px]">
            {bullets.map((b) => (
              <li
                key={b}
                className="relative border-b border-line py-3.5 pl-5 text-sm font-medium last:border-0 before:absolute before:top-[23px] before:left-0 before:size-1.5 before:rounded-full before:bg-brand before:content-['']"
              >
                {b}
              </li>
            ))}
          </ul>
          <div className="max-w-[56ch] space-y-5 text-[.95rem]">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <div className="mt-24 md:mt-52 grid gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="lg:border-l lg:border-line lg:px-[22px] lg:first:border-0 lg:first:pl-0"
            >
              <i className="mb-4 grid size-11 place-items-center rounded-full border border-line lg:mb-14">
                <Icon name={f.icon} />
              </i>
              <h3 className="font-display text-[1.35rem] font-bold tracking-[-.01em]">
                {f.title}
              </h3>
              <p className="mt-1 text-[.82rem] text-muted">{f.description}</p>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
};

export default About;
