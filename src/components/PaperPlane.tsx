/** Original paper-plane illustration for the footer call-to-action card. */
const PaperPlane: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 540 340" fill="none" aria-hidden="true" focusable="false">
        {/* motion lines */}
        <g stroke="#9a9b9d" strokeWidth="1" strokeLinecap="round">
            <path d="M92 76 L132 14" /><path d="M112 82 L150 24" /><path d="M72 92 L116 34" />
            <path d="M356 118 L430 96" /><path d="M300 135 L334 126" />
        </g>
        {/* rear plane */}
        <path d="M130 300 L395 118 L520 88 L525 118 L405 160Z" fill="#e4e3db" stroke="#3a3b3d" strokeWidth=".8" strokeLinejoin="round" />
        <path d="M130 300 L395 118 L405 160Z" fill="#c9c8bf" />
        {/* main plane: wings and folds */}
        <path d="M0 330 L262 6 L266 62 Z" fill="#eceae3" stroke="#3a3b3d" strokeWidth=".8" strokeLinejoin="round" />
        <path d="M0 330 L266 62 L340 98 Z" fill="#dcdad2" stroke="#3a3b3d" strokeWidth=".8" strokeLinejoin="round" />
        <path d="M0 330 L340 98 L215 232 Z" fill="#c4c3ba" stroke="#3a3b3d" strokeWidth=".8" strokeLinejoin="round" />
        <path d="M0 330 L215 232 L330 210 Z" fill="#ebe9e2" stroke="#3a3b3d" strokeWidth=".8" strokeLinejoin="round" />
        <path d="M0 330 L330 210 L470 100 L420 70 L340 98Z" fill="#f1efe8" stroke="#3a3b3d" strokeWidth=".8" strokeLinejoin="round" />
        <path d="M262 6 L266 62" stroke="#3a3b3d" strokeWidth=".8" />
    </svg>
)

export default PaperPlane
