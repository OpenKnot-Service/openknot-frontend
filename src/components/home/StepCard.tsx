import type { ReactNode } from 'react';

interface StepCardProps {
  step?: string;
  icon: ReactNode;
  title: string;
  description: string;
  isLast?: boolean;
  delay?: number;
  isVisible?: boolean;
}

export function StepCard({ icon, title, description, delay = 0, isVisible = false }: StepCardProps) {
  const activationDelay = isVisible ? delay : 999999; // Very large delay if not visible

  return (
    <div className="flex flex-col items-center text-center">
      {/* Icon Circle with Ripple Effect */}
      <div className="relative mb-6">
        {/* Ripple waves - appear when activated */}
        <div
          className="absolute inset-0 rounded-full step-ripple-container"
          style={{
            ['--activation-delay' as any]: `${activationDelay}s`
          }}
        >
          <div className="absolute inset-0 rounded-full step-ripple step-ripple-1"></div>
          <div className="absolute inset-0 rounded-full step-ripple step-ripple-2"></div>
          <div className="absolute inset-0 rounded-full step-ripple step-ripple-3"></div>
        </div>

        {/* Main Icon Circle - Initially inactive, then activates */}
        <div
          className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 step-icon-container"
          style={{
            ['--activation-delay' as any]: `${activationDelay}s`,
            animation: `activateIcon 0.8s ease-out ${activationDelay}s both`
          }}
        >
          {icon}
        </div>
      </div>

      {/* Content - Initially gray, then activates */}
      <div
        className="max-w-xs step-content"
        style={{
          animation: `activateContent 0.8s ease-out ${activationDelay}s both`,
          ['--activation-delay' as any]: `${activationDelay}s`
        }}
      >
        <h3 className="text-xl font-bold mb-3 transition-colors step-title">
          {title}
        </h3>
        <p className="leading-relaxed step-description">
          {description}
        </p>
      </div>

      <style>{`
        /* Icon container - inactive state */
        .step-icon-container {
          transform: scale(0.85);
          background: rgba(229, 231, 235, 0.5);
          border: 3px solid #d1d5db;
          filter: brightness(0.7) saturate(0.3);
        }

        @media (prefers-color-scheme: dark) {
          .step-icon-container {
            background: rgba(55, 65, 81, 0.5);
            border: 3px solid #4b5563;
          }
        }

        /* Icon activation animation */
        @keyframes activateIcon {
          from {
            transform: scale(0.85);
            background: rgba(229, 231, 235, 0.5);
            border-color: #d1d5db;
            filter: brightness(0.7) saturate(0.3);
          }
          to {
            transform: scale(1);
            background: rgba(229, 231, 235, 0.3);
            border-color: #22c55e;
            filter: brightness(1) saturate(1);
          }
        }

        @media (prefers-color-scheme: dark) {
          @keyframes activateIcon {
            from {
              transform: scale(0.85);
              background: rgba(55, 65, 81, 0.5);
              border-color: #4b5563;
              filter: brightness(0.7) saturate(0.3);
            }
            to {
              transform: scale(1);
              background: rgba(55, 65, 81, 0.3);
              border-color: #22c55e;
              filter: brightness(1) saturate(1);
            }
          }
        }

        /* Icon color changes */
        .step-icon-container svg {
          filter: grayscale(100%);
          opacity: 0.4;
          animation: activateIconColor 0.8s ease-out var(--activation-delay) both;
        }

        @keyframes activateIconColor {
          to {
            filter: grayscale(0%);
            opacity: 1;
          }
        }

        /* Ripple container - hidden until activated */
        .step-ripple-container {
          opacity: 0;
          animation: showRipples 0.3s ease-out var(--activation-delay) forwards;
        }

        @keyframes showRipples {
          to {
            opacity: 1;
          }
        }

        /* Green ripple waves */
        .step-ripple {
          border: 2px solid #22c55e;
          opacity: 0;
        }

        .step-ripple-1 {
          animation: ripple 2s ease-out var(--activation-delay) infinite;
        }

        .step-ripple-2 {
          animation: ripple 2s ease-out calc(var(--activation-delay) + 0.4s) infinite;
        }

        .step-ripple-3 {
          animation: ripple 2s ease-out calc(var(--activation-delay) + 0.8s) infinite;
        }

        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        /* Content activation animation */
        @keyframes activateContent {
          from {
            filter: brightness(0.7) saturate(0.3);
          }
          to {
            filter: brightness(1) saturate(1);
          }
        }

        /* Content color changes */
        .step-title {
          color: #9ca3af;
          animation: activateTitleColor 0.8s ease-out var(--activation-delay) both;
        }

        @keyframes activateTitleColor {
          to {
            color: #111827;
          }
        }

        @media (prefers-color-scheme: dark) {
          .step-title {
            color: #6b7280;
          }

          @keyframes activateTitleColor {
            to {
              color: #ffffff;
            }
          }
        }

        .step-description {
          color: #d1d5db;
          animation: activateDescColor 0.8s ease-out var(--activation-delay) both;
        }

        @keyframes activateDescColor {
          to {
            color: #6b7280;
          }
        }

        @media (prefers-color-scheme: dark) {
          .step-description {
            color: #4b5563;
          }

          @keyframes activateDescColor {
            to {
              color: #9ca3af;
            }
          }
        }
      `}</style>
    </div>
  );
}
