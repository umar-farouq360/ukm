import {
  useEffect,
  useId,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Library,
  Lock,
  User,
} from "lucide-react";
import {
  allLessons,
  categoryById,
  instructorById,
  naira,
  type Course,
  type CategoryId,
} from "../data";
import { courseDone, useApp, type Progress } from "../store";

const base =
  "inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
export const btnPrimary = `${base} bg-brand text-on-brand hover:bg-brand-hover`;
export const btnSecondary = `${base} border border-control bg-surface text-fg hover:bg-subtle`;
export const btnGhost = `${base} text-fg2 hover:bg-subtle`;
export const card = "rounded-2xl border border-soft bg-surface";

export const CATEGORY_ICON: Record<CategoryId, typeof Award> = {
  undergraduate: GraduationCap,
  masters: BookMarked,
  postgraduate: Library,
  certificate: Award,
};

/** Sets the document title and moves focus to the page heading on route change (screen-reader friendly). */
export function PageTitle({
  title,
  children,
  className = "",
}: {
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    document.title = `${title} | UKM University`;
    const h = document.getElementById("page-title");
    h?.focus({ preventScroll: true });
  }, [title]);
  return (
    <h1
      id="page-title"
      tabIndex={-1}
      className={`text-[28px] leading-9 md:text-[32px] md:leading-10 font-bold outline-none ${className}`}
    >
      {children ?? title}
    </h1>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "warn";
}) {
  const t =
    tone === "brand"
      ? "bg-selected text-link border-line"
      : tone === "warn"
        ? "bg-warn text-warn-fg border-transparent"
        : "bg-subtle text-fg2 border-soft";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${t}`}
    >
      {children}
    </span>
  );
}

/** Progress is always shown as a bar AND text, never colour alone. */
export function ProgressBar({
  done,
  total,
  label,
}: {
  done: number;
  total: number;
  label: string;
}) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs font-semibold text-fg2 mb-1.5">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={label}
        className="h-2.5 rounded-full bg-subtle border border-soft overflow-hidden"
      >
        <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function courseProgress(course: Course, p?: Progress) {
  const lessons = allLessons(course);
  const done = p ? lessons.filter((l) => p.lessons.includes(l.id)).length : 0;
  const mods = course.modules.filter(
    (m) => p && m.lessons.every((l) => p.lessons.includes(l.id)),
  ).length;
  return {
    done,
    total: lessons.length,
    modulesDone: mods,
    modulesTotal: course.modules.length,
    complete: courseDone(course, p),
  };
}

export function CourseTile({
  course,
  size = "md",
}: {
  course: Course;
  size?: "md" | "lg";
}) {
  const Icon = CATEGORY_ICON[course.category];
  return (
    <div
      className={`${size === "lg" ? "h-32" : "h-20"} rounded-xl bg-mint text-link flex items-center justify-between px-4`}
      aria-hidden="true"
    >
      <Icon size={size === "lg" ? 40 : 28} />
      <span className="font-bold tracking-wide text-sm">{course.code}</span>
    </div>
  );
}

export function CourseCard({ course }: { course: Course }) {
  const { progress } = useApp();
  const p = progress[course.id];
  const cat = categoryById(course.category);
  const inst = instructorById(course.instructorId);
  const cp = courseProgress(course, p);
  const status = p
    ? cp.complete
      ? "Completed"
      : p.status === "allocated" && p.lessons.length === 0
        ? "Allocated"
        : "Enrolled"
    : !course.open
      ? "Intake closed"
      : null;
  return (
    <article className={`${card} p-4 flex flex-col gap-3 h-full`}>
      <CourseTile course={course} />
      <div className="flex flex-wrap gap-1.5">
        <Badge tone="brand">{cat.short}</Badge>
        {status && (
          <Badge tone={status === "Intake closed" ? "warn" : "brand"}>
            {status === "Completed" && (
              <CheckCircle2 size={12} aria-hidden="true" />
            )}
            {status}
          </Badge>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold leading-6">
          <Link
            to={`/courses/${course.id}`}
            className="hover:underline after:absolute after:inset-0 after:content-['']"
          >
            {course.title}
          </Link>
        </h3>
        <p className="text-xs text-muted mt-0.5">
          {course.code} · {course.subject}
        </p>
      </div>
      <p className="text-fg2 line-clamp-2">{course.summary}</p>
      <dl className="mt-auto grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-fg2">
        <div className="flex items-center gap-1.5 col-span-2">
          <User size={14} aria-hidden="true" />
          <dt className="sr-only">Instructor</dt>
          <dd>{inst.name}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={14} aria-hidden="true" />
          <dt className="sr-only">Duration</dt>
          <dd>{course.weeks} weeks</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen size={14} aria-hidden="true" />
          <dt className="sr-only">Difficulty</dt>
          <dd>{course.difficulty}</dd>
        </div>
      </dl>
      <div className="flex items-center justify-between pt-3 border-t border-soft">
        <span className="font-bold">{naira(course.price)}</span>
        <span className="text-sm font-semibold text-link">
          {p
            ? cp.complete
              ? "View course"
              : "Continue"
            : course.open
              ? "View details"
              : "Details"}
        </span>
      </div>
    </article>
  );
}

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: (props: {
    id: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
  }) => ReactNode;
}) {
  const id = useId();
  const desc =
    [hint ? `${id}-h` : "", error ? `${id}-e` : ""].filter(Boolean).join(" ") ||
    undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold mb-1.5">
        {label}
      </label>
      {children({
        id,
        "aria-describedby": desc,
        "aria-invalid": error ? true : undefined,
      })}
      {hint && (
        <p id={`${id}-h`} className="text-xs text-muted mt-1">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-e`}
          role="alert"
          className="text-xs font-semibold text-danger mt-1"
        >
          {error}
        </p>
      )}
    </div>
  );
}
export const inputCls =
  "w-full min-h-11 rounded-lg border border-control bg-surface px-3 text-fg placeholder:text-muted";

export function Notice({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "warn" | "error";
}) {
  const t =
    tone === "error"
      ? "bg-danger-bg text-danger border-transparent"
      : tone === "warn"
        ? "bg-warn text-warn-fg border-transparent"
        : "bg-selected text-fg border-line";
  return (
    <div
      role={tone === "error" ? "alert" : "note"}
      className={`rounded-xl border px-4 py-3 text-sm ${t}`}
    >
      {children}
    </div>
  );
}

export function LockedNote({ text }: { text: string }) {
  return (
    <p className="flex items-center gap-2 text-xs text-muted">
      <Lock size={14} aria-hidden="true" />
      {text}
    </p>
  );
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex items-center gap-2 text-fg2 py-10 justify-center"
    >
      <span
        className="size-4 rounded-full border-2 border-line border-t-brand animate-spin"
        aria-hidden="true"
      />
      {label}…
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small shared building blocks                                        */
/* ------------------------------------------------------------------ */

/** Centred page wrapper with fluid side padding (wider than Container: 1280px). */
export const Wrap = ({
  className = "",
  children,
  ...p
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,40px)] ${className}`}
    {...p}
  >
    {children}
  </div>
);

/** Large fluid section heading. */
export const H2 = ({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <h2
    className={`text-[clamp(2rem,4.6vw,3.3rem)] leading-[1.08] font-display font-bold tracking-[-.02em] ${className}`}
  >
    {children}
  </h2>
);

/** Small muted eyebrow text above a heading. */
export const Label = ({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <span className={`mb-4 block text-[.82rem] text-muted ${className}`}>
    {children}
  </span>
);

type Variant = "g" | "k" | "w" | "o";

// g = brand, k = black, w = white, o = outline
const VARIANT: Record<Variant, string> = {
  g: "border-transparent bg-brand text-on-brand hover:bg-brand-hover",
  k: "border-transparent bg-black text-white hover:bg-neutral-800",
  w: "border-transparent bg-white text-black hover:bg-neutral-100",
  o: "border-line bg-transparent text-fg hover:bg-subtle",
};

// Colour of the little arrow circle, chosen so it never disappears into the button.
const ARROW: Record<Variant, string> = {
  g: "bg-black text-white",
  k: "bg-white text-black",
  w: "bg-black text-white",
  o: "bg-brand text-on-brand",
};

interface ButtonCommon {
  v?: Variant;
  /** Smaller button. */
  sm?: boolean;
  /** Adds the round arrow on the right. */
  arrow?: boolean;
  className?: string;
  children?: ReactNode;
}
type ButtonAsButton = ButtonCommon & {
  to?: undefined;
  href?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;
/** `to` = in-app route (React Router). */
type ButtonAsRoute = ButtonCommon & { to: string; href?: undefined } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "className" | "children"
  >;
/** `href` = external link or file. */
type ButtonAsLink = ButtonCommon & { href: string; to?: undefined } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "className" | "children"
  >;
export type ButtonProps = ButtonAsButton | ButtonAsRoute | ButtonAsLink;

/**
 * Pill button. Renders a <button> by default, a router <Link> when `to` is set,
 * or a plain <a> when `href` is set.
 */
export function Button(props: ButtonProps) {
  const {
    v = "k",
    sm,
    arrow,
    className = "",
    children,
    to,
    href,
    ...rest
  } = props;
  const cls = `inline-flex items-center gap-2.5 rounded-full border font-medium no-underline cursor-pointer transition-colors disabled:cursor-default disabled:opacity-50 ${
    sm ? "min-h-9 px-4 text-sm" : "min-h-11 px-[22px]"
  } ${arrow ? "!py-1.5 !pr-1.5 !pl-[22px]" : ""} ${VARIANT[v]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && (
        <span
          aria-hidden="true"
          className={`grid size-[34px] place-items-center rounded-full ${ARROW[v]}`}
        >
          <ArrowRight size={16} />
        </span>
      )}
    </>
  );
  if (to !== undefined)
    return (
      <Link
        to={to}
        className={cls}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </Link>
    );
  if (href !== undefined)
    return (
      <a
        href={href}
        className={cls}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    );
  return (
    <button
      type="button"
      className={cls}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {inner}
    </button>
  );
}

/** Round icon button. Always pass an aria-label because it has no visible text. */
export const RoundBtn = ({
  light,
  className = "",
  ...p
}: { light?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    className={`grid size-11 cursor-pointer place-items-center rounded-full border text-xl leading-none hover:border-brand hover:bg-brand hover:text-on-brand ${light ? "border-line text-fg" : "border-white/30 text-white"} ${className}`}
    {...p}
  />
);

const ICONS = {
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14l-1.5 7 5-3 5 3-1.5-7" />
    </>
  ),
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
};

export type IconName = keyof typeof ICONS;

export const Icon = ({ name }: { name: IconName }) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {ICONS[name]}
  </svg>
);

/** Full-bleed image section with a dark overlay. Children render above the image. */
export const ImageSection = ({
  src,
  className = "",
  priority,
  children,
}: {
  src: string;
  className?: string;
  priority?: boolean;
  children?: ReactNode;
}) => (
  <div
    className={`relative overflow-hidden bg-neutral-800 text-white ${className}`}
  >
    <img
      src={src}
      alt=""
      className="absolute inset-0 size-full object-cover"
      {...(priority
        ? { fetchPriority: "high" as const }
        : { loading: "lazy" as const })}
    />
    <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/10 to-black/50" />
    {children}
  </div>
);
