# Handmade Digital Mixtape

A small web app for making a personal digital mixtape that feels like a handmade cassette gift.

You choose a cover and add stickers and songs and write a short letter. Then you share one permanent link with the person you made it for. No login needed.

## What you get

- A warm handmade look with paper cards and a cassette preview
- A simple creation flow that works on mobile and desktop
- A permanent public page for every finished mixtape
- A single music player that switches between tracks
- A shareable link that is easy to copy and send

## Creation flow

The creation flow has four steps with a progress indicator on every screen.

### 1 Choose a cover

- Pick from built in covers
- Upload your own JPG or PNG or WebP image up to 5 MB
- See the cassette preview update right away
- The uploaded file stays in the browser until you publish

### 2 Add stickers

- Pick from a static sticker catalog with hearts and stars and retro shapes
- Place up to 6 stickers in preset slots
- Each sticker gets a slight rotation for a handmade feel
- Change or remove stickers before publishing

### 3 Add songs and write a letter

Songs

- Add 1 to 50 YouTube tracks by pasting links
- Supports watch links and short links and Shorts and embeds
- Type the title by hand when auto lookup is not available
- Simple order with add to end plus remove

Letter

- Paper style letter with To and Body and From fields
- The letter is optional
- Text is trimmed for clean display with safe length limits

### 4 Preview and publish

- See the full gift exactly as the recipient will see it
- Go back to fix anything before you publish
- Publishing is permanent with no edit screen in this version
- Your draft stays on screen if publishing fails so you can retry

## Public mixtape page

Every mixtape lives at a short random address under m plus 8 characters.

The public page shows

- The cassette and cover art
- A friendly headline made for gifting
- One main player for the selected track
- The full song list with track numbers
- The letter on paper

Only one YouTube embed loads at a time so long lists stay fast and clean. If a track cannot embed it still shows as a safe external link.

## Covers stickers songs and letters

Covers come from two sources. Built in art stored in the app and uploads stored in Supabase Storage in the covers bucket. Uploads use unique filenames and are removed if publishing fails.

Stickers are static definitions in the app. Only the chosen sticker ids plus position plus rotation are saved in the database.

Songs store the original URL plus provider plus provider id plus title plus position. The current version supports YouTube only. Spotify is not enabled yet.

Letters store recipient plus body plus sender with length limits for safe display.

## How sharing works

After publishing you get a success screen with your link and two actions.

- Copy Link
- Open Mixtape

Anyone with the link can view the page. Links use random non sequential ids so they are hard to guess. There is no dashboard and no edit page in this version. To make another mixtape just start a new one.

## Tech stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Supabase Postgres for data
- Supabase Storage for cover uploads
- Vercel for hosting

Data tables are mixtapes and songs and mixtape stickers with row level security for public read only. Writes go through a secure server route and a Postgres function so browsers never use the service key.

## Run locally

You need Node 20 plus a Supabase project.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open the dev server address shown in your terminal and start at the home page. Add your Supabase values in `.env.local` before publishing. Run the SQL files in `supabase` once to create tables and the storage bucket.

## Project structure

```text
src/app
  page for landing
  create for the four step flow
  m for public mixtape pages
  api for mixtape creation and music lookup
src/components
  mixtape for cassette and player and letter
  creation for step screens
  ui for buttons and inputs
src/lib
  music for YouTube link parsing
  supabase for clients
  covers and stickers and slug helpers
supabase
  schema plus storage setup
```

## Limits in this version

- YouTube only
- Max 50 songs per mixtape
- Max 6 stickers per mixtape
- Max 5 MB per cover image
- No edit and no delete from the UI
- No accounts and no private links
