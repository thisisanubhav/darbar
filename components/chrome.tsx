import { Clock } from "@/components/clock";
import { Player } from "@/components/player";
import { Presence } from "@/components/presence";
import { site } from "@/lib/site";

export function Chrome() {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
      <header className="pointer-events-auto flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Clock />
          <Presence />
        </div>
        <nav className="flex flex-col items-end gap-1.5 text-[12px] font-medium tracking-[-0.01em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] sm:text-[13px]">
          <OutLink href={site.spotifyUrl}>Spotify</OutLink>
          <OutLink href={site.youtubeMusicUrl}>YT Music</OutLink>
        </nav>
      </header>

      <div className="pointer-events-auto w-full pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        <Player />
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
