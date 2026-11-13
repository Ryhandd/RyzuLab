export default function LogoMark({ className = "w-8 h-8", glow = true }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rzl-grad" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5EEAD4" />
          <stop offset="0.5" stopColor="#22D3EE" />
          <stop offset="1" stopColor="#818CF8" />
        </linearGradient>
        <linearGradient id="rzl-face" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0F172A" stopOpacity="0.15" />
          <stop offset="1" stopColor="#0F172A" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* hex shield */}
      <path
        d="M24 3.5 41.5 13.2v21.6L24 44.5 6.5 34.8V13.2L24 3.5Z"
        fill="url(#rzl-face)"
        stroke="url(#rzl-grad)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        style={glow ? { filter: "drop-shadow(0 0 6px rgba(34,211,238,0.35))" } : undefined}
      />

      {/* stylised R + lab notch */}
      <path
        d="M18.2 32.4V15.6h6.9c3.4 0 5.6 2 5.6 5.1 0 2.4-1.3 4.1-3.5 4.8l4.2 6.9h-4.1l-3.7-6.2h-2v6.2h-3.4Zm3.4-9.1h3.2c1.6 0 2.5-.9 2.5-2.4s-.9-2.4-2.5-2.4h-3.2v4.8Z"
        fill="url(#rzl-grad)"
      />
      {/* signal dot */}
      <circle cx="33.6" cy="16.4" r="2.1" fill="#5EEAD4" />
    </svg>
  );
}
