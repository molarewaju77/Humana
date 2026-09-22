import React from 'react'

interface CircularLoaderProps {
  /** Size variant of the loader */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Primary label displayed below the spinner */
  label?: string
  /** Secondary supporting description */
  sublabel?: string
  /** Whether to render in a centered container with padding */
  fullWidth?: boolean
  className?: string
}

const sizeConfig = {
  sm: {
    svgSize: 32,
    strokeWidth: 3.5,
    radius: 12,
    centerDot: 4,
    textSize: 'text-xs',
    subtextSize: 'text-[10px]',
  },
  md: {
    svgSize: 48,
    strokeWidth: 4,
    radius: 18,
    centerDot: 6,
    textSize: 'text-xs font-semibold',
    subtextSize: 'text-[11px]',
  },
  lg: {
    svgSize: 64,
    strokeWidth: 4.5,
    radius: 25,
    centerDot: 8,
    textSize: 'text-sm font-semibold',
    subtextSize: 'text-xs',
  },
  xl: {
    svgSize: 80,
    strokeWidth: 5,
    radius: 32,
    centerDot: 10,
    textSize: 'text-base font-semibold',
    subtextSize: 'text-xs',
  },
}

export default function CircularLoader({
  size = 'md',
  label,
  sublabel,
  fullWidth = true,
  className = '',
}: CircularLoaderProps) {
  const config = sizeConfig[size]
  const circumference = 2 * Math.PI * config.radius
  const strokeDasharray = `${circumference * 0.75} ${circumference * 0.25}`

  return (
    <div
      className={`flex flex-col items-center justify-center text-center animate-fade-in ${
        fullWidth ? 'py-12 px-4 w-full' : ''
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Visual Spinner with Layered Rings */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Glow */}
        <div
          className="absolute -inset-2 bg-primary/10 rounded-full blur-md animate-pulse pointer-events-none"
          style={{ width: config.svgSize + 16, height: config.svgSize + 16 }}
        />

        <svg
          width={config.svgSize}
          height={config.svgSize}
          viewBox={`0 0 ${config.svgSize} ${config.svgSize}`}
          className="relative animate-spin"
          style={{ animationDuration: '1.2s', animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <defs>
            <linearGradient id={`brandGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#78bc3e" />
              <stop offset="50%" stopColor="#4f8f24" />
              <stop offset="100%" stopColor="#356a18" />
            </linearGradient>
          </defs>

          {/* Background Track Ring */}
          <circle
            cx={config.svgSize / 2}
            cy={config.svgSize / 2}
            r={config.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-primary/15"
          />

          {/* Animated Gradient Active Arc */}
          <circle
            cx={config.svgSize / 2}
            cy={config.svgSize / 2}
            r={config.radius}
            fill="none"
            stroke={`url(#brandGrad-${size})`}
            strokeWidth={config.strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="origin-center"
          />
        </svg>

        {/* Center Breathing Pulse Core */}
        <div
          className="absolute rounded-full bg-primary/20 flex items-center justify-center animate-ping"
          style={{
            width: config.centerDot,
            height: config.centerDot,
            animationDuration: '2s',
          }}
        />
        <div
          className="absolute rounded-full bg-primary"
          style={{
            width: config.centerDot,
            height: config.centerDot,
          }}
        />
      </div>

      {/* Descriptive Labels */}
      {(label || sublabel) && (
        <div className="mt-4 space-y-0.5 max-w-xs">
          {label && (
            <p className={`${config.textSize} text-brand-deeptext tracking-tight`}>
              {label}
            </p>
          )}
          {sublabel && (
            <p className={`${config.subtextSize} text-brand-secondarytext font-normal`}>
              {sublabel}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
