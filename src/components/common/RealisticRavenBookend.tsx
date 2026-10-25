import React from 'react';

interface RealisticRavenBookendProps {
  flip?: boolean;
}

export const RealisticRavenBookend: React.FC<RealisticRavenBookendProps> = ({ flip = false }) => {
  return (
    <div
      className={`shrink-0 flex flex-col items-center justify-end select-none pointer-events-none pb-0 z-20 ${
        flip ? 'ml-1 sm:ml-2' : 'mr-1 sm:mr-2'
      }`}
    >
      <div
        className={`relative flex flex-col items-center justify-end transition-transform ${
          flip ? 'scale-x-100' : '-scale-x-100'
        }`}
      >
        <img
          src="/raven-woodcut-bookend.png"
          alt="Raven on Branch Bookend"
          className="h-[215px] sm:h-[242px] w-auto object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.95)]"
          loading="eager"
        />
      </div>
    </div>
  );
};
