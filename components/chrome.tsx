import { Clock } from "@/components/clock";
import { Player } from "@/components/player";
import { Presence } from "@/components/presence";
import { site } from "@/lib/site";

export function Chrome() {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))] sm:p-6">
      <header className="pointer-events-auto flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="font-text text-[20px] font-semibold leading-none tracking-[-0.01em] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] sm:text-[22px]">
            दरबार
          </span>
          <p className="font-text text-[11px] leading-none tracking-[-0.01em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)] sm:text-[12px]">
            <span className="text-white/60">Designed by</span>{" "}
            <span className="font-semibold text-white">Anubhav</span>
          </p>
          <div className="mt-0.5 flex items-center gap-3">
            <Clock />
            <Presence />
          </div>
        </div>
        <nav className="flex flex-col items-end gap-1.5 text-[12px] font-medium tracking-[-0.01em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] sm:text-[13px]">
          <OutLink href={site.spotifyUrl}>Spotify</OutLink>
          <OutLink href={site.youtubeMusicUrl}>YT Music</OutLink>
        </nav>
      </header>

      <div className="pointer-events-auto w-full pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        <Player />
        <p className="mx-auto mt-2.5 max-w-[560px] text-center font-text text-[12px] italic leading-tight tracking-[-0.01em] text-white/70 drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)] sm:text-[13px]">
          हर सुर, एक अनुभव
        </p>
      </div>
    </div>
  );
}

function OutLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 transition hover:text-white"
    >
      {children}
      <svg viewBox="0 0 16 16" className="size-3 fill-current opacity-80">
        <path d="M5 3h8v8h-1.5V5.56L4.03 13 3 11.97 10.44 4.5H5V3z" />
      </svg>
    </a>
  );
}
