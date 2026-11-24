/** Original abstract artwork for the right-hand panel: blue sky, translucent red slabs, black fade, film grain. */
const AuthArt: React.FC = () => {
  return (
    <svg className="absolute inset-0 size-full" viewBox="0 0 676 873" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3C5F9F" /><stop offset=".3" stopColor="#7F9CCB" /><stop offset=".55" stopColor="#E4E9F1" />
        </linearGradient>
        <linearGradient id="slab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD9D6" stopOpacity=".9" /><stop offset=".35" stopColor="#FF5A52" stopOpacity=".92" />
          <stop offset=".7" stopColor="#FF1010" /><stop offset="1" stopColor="#D00000" />
        </linearGradient>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".42" stopColor="#050505" stopOpacity="0" /><stop offset=".72" stopColor="#050505" stopOpacity=".92" /><stop offset="1" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#CFC8BF" /><stop offset="1" stopColor="#A8A096" />
        </linearGradient>
        <filter id="soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.5" /></filter>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="linear" slope=".55" /></feComponentTransfer>
        </filter>
      </defs>
      <rect width="676" height="873" fill="url(#sky)" />
      <path d="M676 440 L560 500 L470 560 L676 600Z" fill="#101214" />
      <g filter="url(#soft)">
        <path d="M55 120 L225 0 L225 560 L55 560Z" fill="url(#slab)" opacity=".92" />
        <path d="M205 100 L375 0 L375 600 L205 600Z" fill="url(#slab)" opacity=".85" />
        <path d="M355 40 L525 0 L525 560 L355 560Z" fill="url(#slab)" opacity=".78" />
      </g>
      <path d="M0 520 L120 505 L170 520 L170 873 L0 873Z" fill="url(#wall)" />
      <path d="M470 440 C540 420 600 390 676 360 L676 700 L470 700Z" fill="#0B0C0E" opacity=".9" />
      <rect width="676" height="873" fill="url(#fade)" />
      <path d="M590 0 H676 V105 H600 Q590 105 590 95Z" fill="#0A0A0A" />
      <path d="M600 90 L630 62 L650 78 L676 54 V100 H600Z" fill="#4A5360" opacity=".7" />
      <rect width="676" height="873" filter="url(#grain)" style={{ mixBlendMode: 'overlay' }} opacity=".7" />
    </svg>
  )
}

export default AuthArt
