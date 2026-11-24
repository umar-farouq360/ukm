import { Award, Sparkles } from "lucide-react";

/**
 * An illustrated, smiling student drawn as inline SVG (about 3 KB, zero network requests).
 * Why an illustration and not a photo: it costs no bandwidth, themes with light and dark mode,
 * and avoids real-person photos, which the competition's fictional-data and privacy rules discourage.
 */
export function StudentIllustration({
  className = "",
}: {
  className?: string;
}) {
  const SKIN = "#A0623A";
  const HAIR = "#1B1310";
  return (
    <svg
      viewBox="0 0 420 420"
      className={className}
      role="presentation"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="ukm-hero-clip">
          <circle cx="210" cy="215" r="190" />
        </clipPath>
      </defs>

      {/* Soft backdrop circles */}
      <circle
        cx="210"
        cy="215"
        r="204"
        fill="none"
        strokeWidth="1.5"
        strokeDasharray="2 9"
        strokeLinecap="round"
        style={{ stroke: "var(--control)" }}
        opacity=".45"
      />
      <circle cx="210" cy="215" r="190" style={{ fill: "var(--tint-1)" }} />
      <circle cx="210" cy="215" r="146" style={{ fill: "var(--mint)" }} />

      <g clipPath="url(#ukm-hero-clip)">
        {/* Shoulders and shirt */}
        <path
          d="M66 440 C66 348 124 318 210 318 C296 318 354 348 354 440 Z"
          fill="#0B7A5B"
        />
        <path d="M178 320 L210 364 L242 320 Z" fill="#F8FAFC" />
        {/* Neck */}
        <path d="M191 284 h38 v42 q-19 20 -38 0 z" fill="#8A5030" />
        {/* Hair (back), ears, head */}
        <circle cx="210" cy="180" r="52" fill={HAIR} />
        <circle cx="170" cy="202" r="30" fill={HAIR} />
        <circle cx="250" cy="202" r="30" fill={HAIR} />
        <circle cx="160" cy="250" r="9" fill="#96583A" />
        <circle cx="260" cy="250" r="9" fill="#96583A" />
        <ellipse cx="210" cy="244" rx="50" ry="56" fill={SKIN} />
        {/* Hairline */}
        <path
          d="M160 230 C158 190 184 178 210 178 C236 178 262 190 260 230 C250 208 232 200 210 200 C188 200 170 208 160 230 Z"
          fill={HAIR}
        />
        {/* Face */}
        <ellipse cx="190" cy="248" rx="4.5" ry="6" fill={HAIR} />
        <ellipse cx="230" cy="248" rx="4.5" ry="6" fill={HAIR} />
        <path
          d="M180 234 Q190 228 200 233 M220 233 Q230 228 240 234"
          fill="none"
          stroke={HAIR}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="175" cy="268" r="9" fill="#E88A7A" opacity=".45" />
        <circle cx="245" cy="268" r="9" fill="#E88A7A" opacity=".45" />
        <path
          d="M210 254 q-5 11 0 13"
          fill="none"
          stroke="#7E4528"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M188 274 Q210 298 232 274 Z"
          fill="#FFFFFF"
          stroke="#4A2515"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Arms */}
        <path
          d="M102 346 C96 376 112 388 140 376"
          fill="none"
          stroke="#0E8A68"
          strokeWidth="38"
          strokeLinecap="round"
        />
        <path
          d="M318 346 C324 376 308 388 280 376"
          fill="none"
          stroke="#0E8A68"
          strokeWidth="38"
          strokeLinecap="round"
        />
        {/* Book stack */}
        <rect x="144" y="340" width="132" height="20" rx="5" fill="#F59E0B" />
        <rect
          x="150"
          y="360"
          width="120"
          height="18"
          rx="5"
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />
        <rect x="144" y="378" width="132" height="20" rx="5" fill="#065F46" />
        {/* Hands */}
        <circle cx="142" cy="372" r="15" fill={SKIN} />
        <circle cx="278" cy="372" r="15" fill={SKIN} />
      </g>

      {/* Sparkles */}
      {[
        { x: 66, y: 112, s: 1.2, c: "#F59E0B", d: "0s" },
        { x: 356, y: 92, s: 0.9, c: "#22C55E", d: "1.2s" },
        { x: 372, y: 292, s: 1.1, c: "#F59E0B", d: "2.1s" },
        { x: 50, y: 290, s: 0.8, c: "#22C55E", d: ".7s" },
      ].map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
          <path
            className="anim-twinkle"
            style={
              {
                "--d": p.d,
                transformBox: "fill-box",
                transformOrigin: "center",
              } as React.CSSProperties
            }
            d="M0 -12 Q2 -2 12 0 Q2 2 0 12 Q-2 2 -12 0 Q-2 -2 0 -12Z"
            fill={p.c}
          />
        </g>
      ))}
    </svg>
  );
}

const chip =
  "absolute anim-float rounded-2xl bg-surface border border-soft shadow-lift px-3 py-2 flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-fg";

export default function HeroVisual() {
  return (
    <div
      className="decor relative mx-auto w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] aspect-square"
      aria-hidden="true"
    >
      <StudentIllustration className="absolute inset-0 size-full anim-rise" />

      <div
        className={`${chip} top-[6%] left-[-2%] sm:left-[-6%]`}
        style={{ "--t": "6s", "--d": "0s" } as React.CSSProperties}
      >
        <div>
          <p className="text-muted font-medium">CSC-101 · 5 of 12 lessons</p>
          <div className="mt-1.5 h-2 w-36 rounded-full bg-subtle overflow-hidden">
            <div className="h-full w-[42%] rounded-full bg-brand anim-grow" />
          </div>
        </div>
      </div>

      <div
        className={`${chip} top-[44%] right-[-3%] sm:right-[-8%]`}
        style={{ "--t": "7s", "--d": "1s" } as React.CSSProperties}
      >
        <span className="size-8 rounded-full bg-tint-4 grid place-items-center">
          <Award size={16} className="text-warn-fg" />
        </span>
        <span>Certificate earned</span>
      </div>

      <div
        className={`${chip} bottom-[8%] left-[2%] sm:left-[-2%]`}
        style={{ "--t": "5.5s", "--d": "2s" } as React.CSSProperties}
      >
        <span className="size-8 rounded-full bg-tint-1 grid place-items-center">
          <Sparkles size={16} className="text-link" />
        </span>
        <span>Free to start</span>
      </div>
    </div>
  );
}
