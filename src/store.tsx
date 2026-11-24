import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  COURSES,
  PROGRAMMES,
  allLessons,
  courseById,
  type Course,
} from "./data";

/**
 * Everything here lives in the browser (localStorage). There is no server.
 * The functions exposed by useApp() are the seam where a real API could be plugged in later.
 */

export interface Progress {
  status: "allocated" | "enrolled" | "completed";
  via: "allocated" | "manual";
  lessons: string[];
  last?: string;
  accessed?: string;
  enrolledOn: string;
  completedOn?: string;
}
interface Account {
  name: string;
  programme: string;
}
interface Persisted {
  session: string | null;
  accounts: Record<string, Account>;
  progress: Record<string, Record<string, Progress>>;
  days: Record<string, string[]>;
}

export const DEMO_EMAIL = "demo@ukm.example";
export const DEMO_PASSWORD = "demo1234";
const KEY = "ukm-demo-v1";
const PREFS = "ukm-prefs";

const iso = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => iso(new Date(Date.now() - n * 86400000));

function seed(): Persisted {
  const cert101 = courseById("cert-101")!;
  const csc101 = courseById("csc-101")!;
  const csc101Lessons = allLessons(csc101).map((l) => l.id);
  return {
    session: null,
    accounts: {
      [DEMO_EMAIL]: { name: "Amina Demo", programme: "bsc-csc-100" },
    },
    progress: {
      [DEMO_EMAIL]: {
        "cert-101": {
          status: "completed",
          via: "manual",
          lessons: allLessons(cert101).map((l) => l.id),
          last: allLessons(cert101).at(-1)!.id,
          accessed: daysAgo(40),
          enrolledOn: daysAgo(60),
          completedOn: daysAgo(40),
        },
        "csc-101": {
          status: "enrolled",
          via: "allocated",
          lessons: csc101Lessons.slice(0, 5),
          last: csc101Lessons[5],
          accessed: daysAgo(0),
          enrolledOn: daysAgo(30),
        },
        "csc-102": {
          status: "allocated",
          via: "allocated",
          lessons: [],
          enrolledOn: daysAgo(30),
        },
        "mth-101": {
          status: "allocated",
          via: "allocated",
          lessons: [],
          enrolledOn: daysAgo(30),
        },
      },
    },
    days: {
      [DEMO_EMAIL]: [
        daysAgo(4),
        daysAgo(3),
        daysAgo(2),
        daysAgo(1),
        daysAgo(0),
      ],
    },
  };
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Persisted;
      if (parsed && parsed.accounts && parsed.progress) return parsed;
    }
  } catch {
    /* storage unavailable: fall through to seed */
  }
  return seed();
}

type Theme = "light" | "dark";
function loadPrefs(): { theme: Theme; lowData: boolean } {
  try {
    const p = JSON.parse(localStorage.getItem(PREFS) || "{}");
    const theme: Theme =
      p.theme ??
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    return { theme, lowData: !!p.lowData };
  } catch {
    return { theme: "light", lowData: false };
  }
}

export interface Achievement {
  id: string;
  title: string;
  detail: string;
  earned: boolean;
  hint: string;
}

interface Ctx {
  user: { email: string; name: string; programme: string } | null;
  progress: Record<string, Progress>;
  theme: Theme;
  lowData: boolean;
  toggleTheme: () => void;
  toggleLowData: () => void;
  signIn: (email: string, password: string) => string | null;
  register: (
    name: string,
    email: string,
    password: string,
    programme: string,
  ) => string | null;
  signOut: () => void;
  enrol: (courseId: string) => void;
  completeLesson: (courseId: string, lessonId: string, done: boolean) => void;
  visitLesson: (courseId: string, lessonId: string) => void;
  resetDemo: () => void;
  achievements: Achievement[];
  streak: number;
}

const AppCtx = createContext<Ctx | null>(null);
export const useApp = () => {
  const v = useContext(AppCtx);
  if (!v) throw new Error("useApp must be used inside AppProvider");
  return v;
};

export function courseDone(course: Course, p?: Progress) {
  return !!p && allLessons(course).every((l) => p.lessons.includes(l.id));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Persisted>(load);
  const [prefs, setPrefs] = useState(loadPrefs);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data]);
  useEffect(() => {
    document.documentElement.dataset.theme = prefs.theme;
    if (prefs.lowData) document.documentElement.dataset.lowdata = "1";
    else delete document.documentElement.dataset.lowdata;
    try {
      localStorage.setItem(PREFS, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs]);

  const email = data.session;
  const account = email ? data.accounts[email] : undefined;
  const progress = (email && data.progress[email]) || {};
  const user =
    email && account
      ? { email, name: account.name, programme: account.programme }
      : null;

  const patch = useCallback(
    (fn: (d: Persisted) => Persisted) => setData((d) => fn(d)),
    [],
  );

  const signIn = useCallback(
    (e: string, pw: string) => {
      const em = e.trim().toLowerCase();
      if (em === DEMO_EMAIL) {
        if (pw !== DEMO_PASSWORD)
          return "That password is not correct. Use the demo password shown on this page.";
      } else if (!data.accounts[em]) {
        return "No account found for that email in this browser. Create an account first, or use the demo login.";
      }
      patch((d) => ({ ...d, session: em }));
      return null;
    },
    [data.accounts, patch],
  );

  const register = useCallback(
    (name: string, e: string, pw: string, programme: string) => {
      const em = e.trim().toLowerCase();
      if (data.accounts[em])
        return "An account with this email already exists in this browser. Sign in instead.";
      void pw; // never stored: this demo does not keep passwords
      const prog = PROGRAMMES.find((p) => p.id === programme) ?? PROGRAMMES[0];
      const mine: Record<string, Progress> = {};
      prog.allocated.forEach((id) => {
        mine[id] = {
          status: "allocated",
          via: "allocated",
          lessons: [],
          enrolledOn: iso(new Date()),
        };
      });
      patch((d) => ({
        ...d,
        session: em,
        accounts: { ...d.accounts, [em]: { name: name.trim(), programme } },
        progress: { ...d.progress, [em]: mine },
        days: { ...d.days, [em]: [] },
      }));
      return null;
    },
    [data.accounts, patch],
  );

  const signOut = useCallback(
    () => patch((d) => ({ ...d, session: null })),
    [patch],
  );

  const enrol = useCallback(
    (courseId: string) => {
      patch((d) => {
        if (!d.session) return d;
        const mine = d.progress[d.session] ?? {};
        if (mine[courseId]) return d;
        return {
          ...d,
          progress: {
            ...d.progress,
            [d.session]: {
              ...mine,
              [courseId]: {
                status: "enrolled",
                via: "manual",
                lessons: [],
                enrolledOn: iso(new Date()),
              },
            },
          },
        };
      });
    },
    [patch],
  );

  const visitLesson = useCallback(
    (courseId: string, lessonId: string) => {
      patch((d) => {
        if (!d.session) return d;
        const mine = d.progress[d.session] ?? {};
        const p = mine[courseId];
        if (!p || (p.last === lessonId && p.accessed === iso(new Date())))
          return d;
        const status = p.status === "allocated" ? "enrolled" : p.status;
        return {
          ...d,
          progress: {
            ...d.progress,
            [d.session]: {
              ...mine,
              [courseId]: {
                ...p,
                status,
                last: lessonId,
                accessed: iso(new Date()),
              },
            },
          },
        };
      });
    },
    [patch],
  );

  const completeLesson = useCallback(
    (courseId: string, lessonId: string, done: boolean) => {
      patch((d) => {
        if (!d.session) return d;
        const course = courseById(courseId);
        const mine = d.progress[d.session] ?? {};
        const p = mine[courseId];
        if (!course || !p) return d;
        const set = new Set(p.lessons);
        if (done) set.add(lessonId);
        else set.delete(lessonId);
        const lessons = allLessons(course)
          .map((l) => l.id)
          .filter((id) => set.has(id));
        const complete = courseDone(course, { ...p, lessons });
        const next: Progress = {
          ...p,
          lessons,
          last: lessonId,
          accessed: iso(new Date()),
          status: complete ? "completed" : "enrolled",
          completedOn: complete
            ? (p.completedOn ?? iso(new Date()))
            : undefined,
        };
        const days = new Set(d.days[d.session] ?? []);
        if (done) days.add(iso(new Date()));
        return {
          ...d,
          progress: {
            ...d.progress,
            [d.session]: { ...mine, [courseId]: next },
          },
          days: { ...d.days, [d.session]: [...days] },
        };
      });
    },
    [patch],
  );

  const resetDemo = useCallback(() => setData(seed()), []);

  const toggleTheme = useCallback(
    () =>
      setPrefs((p) => ({ ...p, theme: p.theme === "dark" ? "light" : "dark" })),
    [],
  );
  const toggleLowData = useCallback(
    () => setPrefs((p) => ({ ...p, lowData: !p.lowData })),
    [],
  );

  const streak = useMemo(() => {
    const set = new Set((email && data.days[email]) || []);
    let n = 0;
    for (let i = 0; i < 400; i++) {
      if (set.has(daysAgo(i))) n++;
      else if (i === 0)
        continue; // today not yet studied does not break the streak
      else break;
    }
    return n;
  }, [data.days, email]);

  const achievements = useMemo<Achievement[]>(() => {
    const all = Object.entries(progress);
    const anyLesson = all.some(([, p]) => p.lessons.length > 0);
    const anyModule = all.some(([id, p]) => {
      const c = courseById(id);
      return c?.modules.some((m) =>
        m.lessons.every((l) => p.lessons.includes(l.id)),
      );
    });
    const completed = all.filter(([, p]) => p.status === "completed");
    const certDone = completed.some(
      ([id]) => courseById(id)?.category === "certificate",
    );
    return [
      {
        id: "a1",
        title: "First lesson completed",
        detail: "You finished your first lesson.",
        hint: "Complete any lesson.",
        earned: anyLesson,
      },
      {
        id: "a2",
        title: "First module completed",
        detail: "You finished every lesson in a module.",
        hint: "Finish all lessons in one module.",
        earned: !!anyModule,
      },
      {
        id: "a3",
        title: "First course completed",
        detail: "You completed a whole course.",
        hint: "Complete every lesson in a course.",
        earned: completed.length > 0,
      },
      {
        id: "a4",
        title: "Seven-day learning streak",
        detail: "You learned on seven days in a row.",
        hint: `Learn seven days in a row (current streak: ${streak}).`,
        earned: streak >= 7,
      },
      {
        id: "a5",
        title: "Certificate Programme graduate",
        detail: "You completed a Certificate Programme course.",
        hint: "Complete a Certificate Programme course.",
        earned: certDone,
      },
    ];
  }, [progress, streak]);

  const value: Ctx = {
    user,
    progress,
    theme: prefs.theme,
    lowData: prefs.lowData,
    toggleTheme,
    toggleLowData,
    signIn,
    register,
    signOut,
    enrol,
    completeLesson,
    visitLesson,
    resetDemo,
    achievements,
    streak,
  };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export { COURSES };
