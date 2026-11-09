import type { IconTheme } from './types';

interface IconProps {
  theme: IconTheme;
}

export const SuccessIcon = ({ theme }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill={theme.primary} />
    <path
      className="tostack-check"
      d="M7.2 12.4l3.1 3.1 6.5-6.7"
      fill="none"
      stroke={theme.secondary}
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ErrorIcon = ({ theme }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="tostack-shake">
    <circle cx="12" cy="12" r="11" fill={theme.primary} />
    <path
      d="M8.4 8.4l7.2 7.2M15.6 8.4l-7.2 7.2"
      stroke={theme.secondary}
      strokeWidth="2.3"
      strokeLinecap="round"
    />
  </svg>
);

export const WarningIcon = ({ theme }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M10.3 3.4a2 2 0 013.4 0l8.6 15a2 2 0 01-1.7 3H3.4a2 2 0 01-1.7-3z"
      fill={theme.primary}
    />
    <path d="M12 9v5" stroke={theme.secondary} strokeWidth="2.3" strokeLinecap="round" />
    <circle cx="12" cy="17.6" r="1.3" fill={theme.secondary} />
  </svg>
);

export const InfoIcon = ({ theme }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill={theme.primary} />
    <circle cx="12" cy="7.4" r="1.4" fill={theme.secondary} />
    <path d="M12 11v6.2" stroke={theme.secondary} strokeWidth="2.3" strokeLinecap="round" />
  </svg>
);

/** iOS style activity indicator: 8 spokes stepping around. */
export const LoaderIcon = ({ theme }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <g className="tostack-spin">
      {Array.from({ length: 8 }, (_, i) => (
        <line
          key={i}
          x1="12"
          y1="3"
          x2="12"
          y2="7.2"
          stroke={theme.primary}
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity={1 - i * 0.11}
          transform={`rotate(${-i * 45} 12 12)`}
        />
      ))}
    </g>
  </svg>
);
