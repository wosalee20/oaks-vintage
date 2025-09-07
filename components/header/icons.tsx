export const IconSearch = (p: any) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    {...p}
  >
    <circle cx="11" cy="11" r="7" strokeWidth="2" />
    <path d="M20 20l-3.2-3.2" strokeWidth="2" />
  </svg>
);

export const IconHome = (p: any) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    {...p}
  >
    <path
      d="M3 11.5l9-7 9 7V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z"
      strokeWidth="2"
    />
  </svg>
);

// ✅ default filled color now BLUE; you can still override via the `color` prop
export const IconHomeFill = ({ color = "#2563EB", ...p }: any) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill={color} {...p}>
    <path d="M12 4l9 7v8a2 2 0 0 1-2 2h-5v-6H10v6H5a2 2 0 0 1-2-2v-8l9-7z" />
  </svg>
);

export const IconGrid = (p: any) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    {...p}
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth="2" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" strokeWidth="2" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" strokeWidth="2" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" strokeWidth="2" />
  </svg>
);

export const IconUser = (p: any) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    {...p}
  >
    <path d="M20 21a8 8 0 10-16 0" strokeWidth="2" />
    <circle cx="12" cy="7" r="4" strokeWidth="2" />
  </svg>
);

export const IconHelp = (p: any) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    {...p}
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path d="M9.1 9a3 3 0 115.8 1c0 1.5-1.2 2-2 2" strokeWidth="2" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);

export const IconCart = (p: any) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    {...p}
  >
    <circle cx="9" cy="20" r="1.8" />
    <circle cx="17" cy="20" r="1.8" />
    <path
      d="M3 4h2l2.2 10.4A2 2 0 009.1 16h7.8a2 2 0 001.9-1.4L21 8H6.2"
      strokeWidth="2"
    />
  </svg>
);

export const IconChevron = ({ up = false, ...p }: { up?: boolean } & any) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    {...p}
  >
    <path d={up ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} strokeWidth="2" />
  </svg>
);

export const IconMenu = (p: any) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    {...p}
  >
    <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" />
  </svg>
);

export const IconClose = (p: any) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    {...p}
  >
    <path d="M6 6l12 12M18 6l-12 12" strokeWidth="2" />
  </svg>
);

export const IconHeart = (p: any) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
    <path d="M12 21s-7-4.6-9.5-8C.3 10 2.2 6 6 6c2 0 3.2 1 4 2 .8-1 2-2 4-2 3.8 0 5.7 4 3.5 7-2.5 3.4-9.5 8-9.5 8z" />
  </svg>
);
