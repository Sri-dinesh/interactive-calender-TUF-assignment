export function SpiralBinding() {
  return (
    <div className="w-full flex justify-center -translate-y-4 mb-[-16px] z-20 relative px-4">
      <svg
        width="100%"
        height="32"
        viewBox="0 0 600 32"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-800 dark:text-gray-400 opacity-90 drop-shadow-md"
      >
        <defs>
          <pattern
            id="spiral-pattern"
            x="0"
            y="0"
            width="24"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M4,16 C4,4 12,4 12,16 C12,28 4,28 4,16 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="8" cy="24" r="3" fill="var(--color-background, #fff)" />
            <circle cx="8" cy="24" r="3" fill="black" fillOpacity="0.3" />
            <circle
              cx="8"
              cy="24"
              r="2.5"
              fill="var(--color-paper-alt, #f8f9fb)"
            />
          </pattern>
        </defs>
        <rect width="100%" height="32" fill="url(#spiral-pattern)" />
      </svg>
    </div>
  );
}
