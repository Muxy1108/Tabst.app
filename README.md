# Tabst

Write guitar tabs like markdown.

## Features

Write. Play. Share.

Efficiently write alphaTex. Play scores. Share PDF/GP.

## Why Tabst

Say no to bulky binaries and XML; the world belongs to plain text.

While document writing already has a plethora of out-of-the-box Markdown editors, precise typesetting tools like LaTeX, and innovative tools like Typst, why in the realm of guitar tabs are we still connecting notes on scores like in Word?

MusiXTeX and Lilypond have set a publishing-grade example in music notation languages, while alphaTab.js has made interactive and playable scores possible.

This is just the beginning. My vision is to transform scattered PDFs and images of scores into alphaTex stored in Tabst. Visual language models (OMR Optical Music Recognition) are on the way.

## Tech Stack

- pnpm
- TypeScript
- Vite
- [Electron](https://www.electronjs.org/docs/latest/)
- [React 19](https://react.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwindcss 3](https://tailwindcss.com/docs/installation) (Ultimately decided to revert to v3 as v4 is not stable enough)
- [biome](https://biomejs.dev/guides/getting-started/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Lucide Icon](https://lucide.dev/guide/packages/lucide-react)

## Development Environment

MCP Server

- context7
- shadcn/ui

## Installation

```powershell
pnpm install
```

## Development

```powershell
pnpm run dev  # Run React development server + Electron development process
```
