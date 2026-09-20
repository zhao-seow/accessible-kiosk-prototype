import type { ReactNode } from "react";

interface IconProps {
  name: IconName;
  className?: string;
}

export type IconName =
  | "heart"
  | "globe"
  | "help"
  | "back"
  | "clinic"
  | "bill"
  | "mobile"
  | "printer"
  | "nets"
  | "credit"
  | "paynow"
  | "check"
  | "clock"
  | "speaker"
  | "flask"
  | "calendar";

const paths: Record<IconName, ReactNode> = {
  heart: <path d="M12 21s-7.5-4.9-10-9.3C.6 8.9 2 5 5.5 5 7.6 5 9 6.3 12 9c3-2.7 4.4-4 6.5-4C22 5 23.4 8.9 22 11.7 19.5 16.1 12 21 12 21z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1.3 1-1.3 1.9v.3" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" />
    </>
  ),
  back: <path d="M15 5l-7 7 7 7M8 12h12" />,
  clinic: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="1.5" />
      <path d="M9 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M12 12v4M10 14h4" />
    </>
  ),
  bill: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  mobile: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  printer: (
    <>
      <path d="M7 8V3h10v5" />
      <rect x="4" y="8" width="16" height="8" rx="1.5" />
      <path d="M7 14h10v6H7z" />
    </>
  ),
  nets: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
  credit: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18M7 15h4" />
    </>
  ),
  paynow: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <path d="M13 13h3v3M20 13v7M16 20h4M16 16h.01" />
    </>
  ),
  check: <path d="M4 12l5 5L20 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  speaker: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16 8.5a4 4 0 0 1 0 7M18.5 6a7 7 0 0 1 0 12" />
    </>
  ),
  flask: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M7.5 14h9" />,
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </>
  ),
};

export function Icon({ name, className = "w-8 h-8" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
