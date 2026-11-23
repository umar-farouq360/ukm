import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Bot,
  CheckCircle2,
  ListChecks,
  Search,
  Smartphone,
  WifiOff,
} from "lucide-react";
import { CATEGORIES, COURSES } from "../data";
import { useApp } from "../store";
import { openAssistant } from "../components/Assistant";
import {
  CATEGORY_ICON,
  CourseCard,
  btnPrimary,
  btnSecondary,
  card,
  inputCls,
} from "../components/ui";

const STEPS = [
  {
    t: "Discover",
    d: "Search or filter courses across four programme categories.",
  },
  {
    t: "Understand",
    d: "Read objectives, outline, fees and prerequisites before you decide.",
  },
  { t: "Enrol", d: "Enrol in a few steps. Fees are shown before you confirm." },
  {
    t: "Learn and earn",
    d: "Follow lessons, track progress and earn a certificate.",
  },
];

export default function Home() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const { user } = useApp();
  const popular = COURSES.filter((c) => c.popular).slice(0, 6);

  const search = (e: FormEvent) => {
    e.preventDefault();
    nav(q.trim() ? `/courses?q=${encodeURIComponent(q.trim())}` : "/courses");
  };

  return (
    <>
      <section className="bg-surface border-b border-soft">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
          <p className="text-sm font-semibold text-link">
            Online learning and skills development
          </p>
          <h1
            id="page-title"
            tabIndex={-1}
            className="mt-2 text-[34px] leading-[40px] md:text-[40px] md:leading-[48px] font-bold max-w-3xl outline-none"
          >
            Find a course. Enrol. Learn at your own pace. Earn your certificate.
          </h1>
          <p className="mt-4 text-base text-fg2 max-w-2xl">
            UKM University brings undergraduate, Masters, postgraduate and
            certificate courses into one simple, lightweight platform built to
            work on any device and any connection.
          </p>

          <form
            onSubmit={search}
            role="search"
            className="mt-8 flex flex-col sm:flex-row gap-2 max-w-2xl"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search courses by name, code, subject or instructor
            </label>
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="hero-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses, e.g. Python, data, project management"
                className={`${inputCls} pl-10`}
              />
            </div>
            <button type="submit" className={btnPrimary}>
              Search courses
            </button>
          </form>
          <p className="mt-4 text-sm text-fg2 flex flex-wrap gap-x-4 gap-y-1">
            <Link
              to="/courses?price=free"
              className="text-link font-semibold underline underline-offset-2"
            >
              Browse free courses
            </Link>
            <Link
              to="/courses?difficulty=Beginner"
              className="text-link font-semibold underline underline-offset-2"
            >
              Beginner friendly
            </Link>
            {!user && (
              <Link
                to="/login"
                className="text-link font-semibold underline underline-offset-2"
              >
                Try the demo login
              </Link>
            )}
            {user && (
              <Link
                to="/dashboard"
                className="text-link font-semibold underline underline-offset-2"
              >
                Go to my learning
              </Link>
            )}
          </p>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 md:px-6 py-12"
        aria-labelledby="cats"
      >
        <h2 id="cats" className="text-2xl font-bold">
          Learning categories
        </h2>
        <p className="text-fg2 mt-1">
          Four ways to learn, from first degree to short professional courses.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICON[cat.id];
            const n = COURSES.filter((c) => c.category === cat.id).length;
            return (
              <li key={cat.id}>
                <Link
                  to={`/courses?category=${cat.id}`}
                  className={`${card} p-5 flex flex-col gap-3 h-full hover:border-brand`}
                >
                  <span
                    className="size-11 rounded-xl bg-mint text-link grid place-items-center"
                    aria-hidden="true"
                  >
                    <Icon size={22} />
                  </span>
                  <span className="text-lg font-semibold leading-6">
                    {cat.name}
                  </span>
                  <span className="text-fg2">{cat.description}</span>
                  <span className="text-xs text-muted">{cat.who}</span>
                  <span className="mt-auto pt-2 text-sm font-semibold text-link inline-flex items-center gap-1">
                    {n} courses <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 md:px-6 py-4"
        aria-labelledby="pop"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="pop" className="text-2xl font-bold">
              Popular courses
            </h2>
            <p className="text-fg2 mt-1">
              What learners are starting right now.
            </p>
          </div>
          <Link
            to="/courses"
            className="text-sm font-semibold text-link whitespace-nowrap"
          >
            View all courses
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((c) => (
            <li key={c.id} className="relative">
              <CourseCard course={c} />
            </li>
          ))}
        </ul>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 md:px-6 py-12"
        aria-labelledby="how"
      >
        <h2 id="how" className="text-2xl font-bold">
          How it works
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.t} className={`${card} p-5`}>
              <span
                className="size-8 rounded-full bg-brand text-on-brand grid place-items-center text-sm font-bold"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold">
                <span className="sr-only">Step {i + 1}: </span>
                {s.t}
              </h3>
              <p className="text-fg2 mt-1">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6" aria-labelledby="why">
        <h2 id="why" className="text-2xl font-bold">
          Built for real learners
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              Icon: ListChecks,
              t: "Clear progress",
              d: "See completed modules, remaining lessons and exactly what to do next.",
            },
            {
              Icon: WifiOff,
              t: "Light on data",
              d: "Text-first lessons, no autoplay, and a low-data mode that hides decorative visuals.",
            },
            {
              Icon: Smartphone,
              t: "Works on any screen",
              d: "Designed for phones first, then tablets and desktops.",
            },
          ].map(({ Icon, t, d }) => (
            <li key={t} className="flex gap-3">
              <span
                className="size-10 shrink-0 rounded-lg bg-mint text-link grid place-items-center"
                aria-hidden="true"
              >
                <Icon size={20} />
              </span>
              <div>
                <h3 className="font-semibold text-base">{t}</h3>
                <p className="text-fg2">{d}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="rounded-2xl bg-selected border border-line p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
          <span
            className="size-14 shrink-0 rounded-2xl bg-brand text-on-brand grid place-items-center decor"
            aria-hidden="true"
          >
            <Bot size={28} />
          </span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              Not sure where to start? Ask the learning assistant.
            </h2>
            <p className="text-fg2 mt-1 max-w-2xl">
              Ask about fees, how to enrol, or tell it your goal and it will
              suggest suitable courses. In this demo the assistant uses scripted
              answers from the sample course data.
            </p>
          </div>
          <button onClick={openAssistant} className={btnPrimary}>
            Open assistant
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-4">
        <div className={`${card} p-6 md:p-8 text-center`}>
          <Award
            size={28}
            className="mx-auto text-link decor"
            aria-hidden="true"
          />
          <h2 className="text-2xl font-bold mt-2">Start learning today</h2>
          <p className="text-fg2 mt-1 flex items-center justify-center gap-1.5">
            <CheckCircle2 size={16} aria-hidden="true" /> Many certificate
            courses are free.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
            <Link to="/courses" className={btnPrimary}>
              Explore courses
            </Link>
            <Link to="/register" className={btnSecondary}>
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
