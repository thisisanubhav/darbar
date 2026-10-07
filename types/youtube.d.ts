export {};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: string | HTMLElement,
        options: YT.PlayerOptions,
      ) => YT.Player;
    };
    onYouTubeIframeAPIReady?: () => void;
  }

  namespace YT {
    interface PlayerOptions {
      width?: number | string;
      height?: number | string;
      videoId?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: { target: Player }) => void;
        onStateChange?: (event: { data: number; target: Player }) => void;
        onError?: (event: { data: number; target: Player }) => void;
      };
    }

    interface Player {
      playVideo(): void;
      pauseVideo(): void;
      nextVideo(): void;
      previousVideo(): void;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      getCurrentTime(): number;
      getDuration(): number;
      getVideoData(): { video_id?: string; title?: string; author?: string };
      getVideoUrl(): string;
      setLoop(loopPlaylists: boolean): void;
      setShuffle(shufflePlaylist: boolean): void;
      destroy(): void;
    }
  }
}
