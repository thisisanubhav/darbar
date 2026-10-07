# Darbar

A full-screen qawwali room. YouTube plays the audio. Your artwork stays the hero.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Swap the scene / playlist

| What | Where |
| --- | --- |
| Background | Replace `public/bg.png` (wide 16:9 works best) |
| YouTube playlist | `NEXT_PUBLIC_YT_PLAYLIST_ID` or `lib/site.ts` |
| Spotify / YT Music links | same env vars or `lib/site.ts` |

Copy `.env.example` → `.env.local` to override without editing code.

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project on [vercel.com/new](https://vercel.com/new)
3. Add the same env vars in the Vercel dashboard if you want a different playlist
4. Deploy

Music is streamed by YouTube’s player (iframe is hidden). Do not host MP3s. Do not monetize the page off the tracks.

The online count is approximate on serverless (per instance). Fine for a small room.
