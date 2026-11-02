interface RealisticRavenBookendProps {
  flip?: boolean;
  compact?: boolean;
}

export function RealisticRavenBookend({ flip = false, compact = true }: RealisticRavenBookendProps) {
  return (
    <div
      className={`shrink-0 flex flex-col items-center justify-end select-none pointer-events-none pb-0 z-20 ${
        flip ? "ml-0.5 sm:ml-1" : "mr-0.5 sm:mr-1"
      }`}
    >
      <div
        className={`relative flex flex-col items-center justify-end transition-transform ${
          flip ? "scale-x-100" : "-scale-x-100"
        }`}
      >
        <img
          src="/raven-woodcut-bookend.png"
          alt="Raven on Branch Bookend"
          className={`${
            compact ? "h-[135px] sm:h-[148px]" : "h-[165px] sm:h-[188px]"
          } w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)]`}
          loading="eager"
        />
      </div>
    </div>
  );
}
