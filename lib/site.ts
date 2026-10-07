export const site = {
  name: "Darbar",
  youtubePlaylistId:
    process.env.NEXT_PUBLIC_YT_PLAYLIST_ID ??
    "PLSRj-VDlSajZRf78T9Nn-B4SMkN3LoydP",
  // Plays once at the top, then the playlist takes over (shuffled).
  firstVideoId: process.env.NEXT_PUBLIC_YT_FIRST_VIDEO_ID ?? "63-bNj4oGp8",
  spotifyUrl:
    process.env.NEXT_PUBLIC_SPOTIFY_URL ??
    "https://open.spotify.com/search/qawwali",
  youtubeMusicUrl:
    process.env.NEXT_PUBLIC_YT_MUSIC_URL ??
    `https://music.youtube.com/playlist?list=${
      process.env.NEXT_PUBLIC_YT_PLAYLIST_ID ??
      "PLSRj-VDlSajZRf78T9Nn-B4SMkN3LoydP"
    }`,
} as const;
