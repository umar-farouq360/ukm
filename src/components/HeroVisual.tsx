import { delay } from '../lib/motion'

export default function HeroVisual() {
  return (
    <figure className="decor relative mx-auto w-full max-w-[560px]">
      <div className="overflow-hidden rounded-[1.5rem] border border-soft bg-tint-1">
        <img
          src={`${import.meta.env.BASE_URL}images/ukm-study-still-life.webp`}
          alt="Open textbook, notes and a potted plant on a study desk"
          width="760"
          height="620"
          fetchPriority="high"
          className="anim-hero-img block aspect-[1.16] w-full object-cover"
        />
      </div>
      <span aria-hidden="true" className="anim-float absolute -left-3 top-12 size-5 rounded-full bg-iris" style={{ ...delay(0), '--t': '7s' } as React.CSSProperties} />
      <span aria-hidden="true" className="anim-float absolute -right-2 top-6 size-4 rounded-full bg-azure" style={{ ...delay(900), '--t': '6s' } as React.CSSProperties} />
      <span aria-hidden="true" className="anim-float absolute -right-3 bottom-24 size-3.5 rounded-full border-2 border-accent" style={{ ...delay(400), '--t': '8s' } as React.CSSProperties} />
      <figcaption className="anim-rise absolute bottom-4 left-4 rounded-md border border-soft bg-surface/95 px-3 py-2 text-xs font-semibold text-fg" style={delay(700)}>
        A quieter place to make progress
      </figcaption>
    </figure>
  )
}
