import type { PropsWithChildren } from 'react'

/** Purple gradient backdrop with the light card that holds the header, hero and stats strip. */
const HeroFrame: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="hx-backdrop px-3 sm:px-6 xl:px-12 pt-[clamp(12px,9vw,135px)] pb-10 md:pb-14">
            <div className="bg-hx-card text-hx-ink rounded-md overflow-hidden">{children}</div>
        </div>
    )
}

export default HeroFrame
