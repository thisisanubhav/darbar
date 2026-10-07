export const site = {
  name: "Darbar",
  youtubePlaylistId:
    process.env.NEXT_PUBLIC_YT_PLAYLIST_ID ??
    "PLSRj-VDlSajZRf78T9Nn-B4SMkN3LoydP",
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
