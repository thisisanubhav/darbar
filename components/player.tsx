"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { site } from "@/lib/site";
import { loadYouTubeApi } from "@/lib/youtube";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function Player() {
  const playerRef = useRef<YT.Player | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const durationRef = useRef(0);
  // Virtual queue: "pinned" = the opening song sits at position 0;
  // "playlist" = the named playlist occupies positions 1..N (shuffled).
  const modeRef = useRef<"pinned" | "playlist">("pinned");
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState({
    title: "Cueing the darbar…",
    author: "",
    id: "",
  });

  const syncTrack = useCallback((player: YT.Player) => {
    const data = player.getVideoData?.();
    if (!data?.title) return;
    let id = data.video_id ?? "";
    if (!id) {
      try {
        id = new URL(player.getVideoUrl()).searchParams.get("v") ?? "";
      } catch {
        id = "";
      }
    }
    setTrack({
      title: data.title,
      author: data.author ?? "",
      id,
    });
    durationRef.current = player.getDuration() || 0;
  }, []);

  // Hand off from the pinned opener into the shuffled playlist (positions 1..N).
  const enterPlaylist = useCallback((player: YT.Player) => {
    modeRef.current = "playlist";
    player.loadPlaylist({ listType: "playlist", list: site.youtubePlaylistId });
    player.setShuffle(true);
    player.setLoop(true);
  }, []);

  // Return to position 0 — the pinned opening song.
  const goToPinned = useCallback((player: YT.Player) => {
    modeRef.current = "pinned";
    player.loadVideoById(site.firstVideoId);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let raf = 0;

    const paint = () => {
      const player = playerRef.current;
      if (player) {
        const current = player.getCurrentTime?.() ?? 0;
        const duration = player.getDuration?.() || durationRef.current;
        durationRef.current = duration;
        if (barRef.current && duration > 0) {
          barRef.current.style.width = `${Math.min(100, (current / duration) * 100)}%`;
        }
        if (timeRef.current) {
          timeRef.current.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
        }
      }
      raf = requestAnimationFrame(paint);
    };

    async function init() {
      await loadYouTubeApi();
      if (cancelled || !window.YT) return;

      playerRef.current = new window.YT.Player("yt-player", {
        width: 1,
        height: 1,
        videoId: site.firstVideoId,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            // Programmatic playback can otherwise start muted in some browsers.
            event.target.unMute?.();
            event.target.setVolume?.(100);
            syncTrack(event.target);
            setReady(true);
          },
          onStateChange: (event) => {
            setPlaying(event.data === 1);
            // Opening track ended on its own → roll into the playlist.
            if (event.data === 0 && modeRef.current === "pinned") {
              enterPlaylist(event.target);
              return;
            }
            if (event.data === 1 || event.data === 0 || event.data === 5) {
              syncTrack(event.target);
            }
          },
          onError: (event) => {
            try {
              if (modeRef.current === "pinned") enterPlaylist(event.target);
              else event.target.nextVideo();
            } catch {
              /* skip broken tracks */
            }
          },
        },
      });

      raf = requestAnimationFrame(paint);
    }

    init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [syncTrack, enterPlaylist]);

  const handleNext = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    // From the pinned opener, "next" steps into the playlist at position 1.
    if (modeRef.current === "pinned") enterPlaylist(player);
    else player.nextVideo();
  }, [enterPlaylist]);

  const handlePrev = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (modeRef.current === "pinned") {
      player.seekTo(0, true); // already at position 0 — restart it
      return;
    }
    // At the first playlist item, "prev" returns to the pinned opener.
    const index = player.getPlaylistIndex?.() ?? -1;
    if (index <= 0) goToPinned(player);
    else player.previousVideo();
  }, [goToPinned]);

  function seek(event: PointerEvent<HTMLButtonElement>) {
    const player = playerRef.current;
    const duration = durationRef.current;
    if (!player || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );
    player.seekTo(ratio * duration, true);
  }

  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="pointer-events-none absolute -left-[200vw] top-0 h-px w-px overflow-hidden opacity-0">
        <div id="yt-player" />
      </div>

      <div className="flex items-center gap-3 rounded-full border border-white/12 bg-black/45 px-3 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:gap-4 sm:px-4">
        <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-white/10 sm:size-12">
          {track.id ? (
            <Image
              src={`https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-text text-[13px] font-medium leading-tight tracking-[-0.01em] text-white sm:text-sm">
            {track.title}
          </p>
          <p className="mt-0.5 truncate font-text text-[11px] text-white/65">
            {track.author || "YouTube"}
          </p>
          <button
            type="button"
            aria-label="Seek"
            onPointerDown={seek}
            className="mt-1.5 block h-1 w-full rounded-full bg-white/20"
          >
            <span
              ref={barRef}
              className="block h-full rounded-full bg-white/90"
              style={{ width: "0%" }}
            />
          </button>
          <span
            ref={timeRef}
            className="mt-1 block text-[10px] tabular-nums text-white/55"
          >
            0:00 / 0:00
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1 pr-0.5 sm:gap-1.5">
          <IconButton label="Previous" disabled={!ready} onClick={handlePrev}>
            <PrevIcon />
          </IconButton>
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            disabled={!ready}
            onClick={() =>
              playing
                ? playerRef.current?.pauseVideo()
                : playerRef.current?.playVideo()
            }
            className="grid size-10 place-items-center rounded-full bg-white text-black transition enabled:hover:scale-105 disabled:opacity-40 sm:size-11"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <IconButton label="Next" disabled={!ready} onClick={handleNext}>
            <NextIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-8 place-items-center text-white/90 transition enabled:hover:text-white disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 translate-x-px fill-current">
      <path d="M8 5.5v13l11-6.5L8 5.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M7 5h3.5v14H7V5zm6.5 0H17v14h-3.5V5z" />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M6 6h2v12H6V6zm12 12V6l-8.5 6 8.5 6z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M16 6h2v12h-2V6zM6 18V6l8.5 6L6 18z" />
    </svg>
  );
}
