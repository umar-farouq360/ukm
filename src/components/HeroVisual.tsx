export default function HeroVisual() {
  return (
    <figure className="decor relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[1.5rem] border border-soft bg-tint-1">
      <img
        src="/images/ukm-study-still-life.svg"
        alt="Open textbook, notes and a potted plant on a study desk"
        width="760"
        height="620"
        fetchPriority="high"
        className="block aspect-[1.16] w-full object-cover"
      />
      <figcaption className="absolute bottom-4 left-4 rounded-md border border-soft bg-surface/95 px-3 py-2 text-xs font-semibold text-fg">
        A quieter place to make progress
      </figcaption>
    </figure>
  )
}
