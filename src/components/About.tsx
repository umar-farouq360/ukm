import { aboutDetails } from "../data/about";
import { H2, Label, Wrap } from "./ui";

const About: React.FC = () => {
  const { label, heading, bullets, paragraphs } = aboutDetails;

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
      </Wrap>
    </section>
  );
};

export default About;
