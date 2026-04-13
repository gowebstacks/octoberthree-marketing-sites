# Turborepo Monorepo

This repository is a Turborepo-powered monorepo using pnpm workspaces. It is designed to support multiple Next.js applications along with shared packages for UI components, configuration, styling, and CMS integrations.


## Monorepo Background

This monorepo was initially created using the Turborepo starter, which by default provides:
- A web application
- A docs application
- Shared configuration packages (ESLint, TypeScript, etc.)

The structure was later extended and customized:
- Added three new Next.js applications: main, rlc, and edge
- Added a dedicated Storybook application
- Added a shared UI component library
- Configured Tailwind CSS as a shared setup
- Integrated Storyblok as the CMS layer

## Repository Structure

.
├── apps
│   ├── web        
│   ├── main        
│   ├── rlc         
│   ├── edge       
│   └── storybook   # Storybook for UI development
│
├── packages
│   ├── ui                # Shared React UI component library
│   ├── storyblok         # Storyblok client and apis
│   ├── tailwind-config   # Shared Tailwind CSS configuration
│   ├── eslint-config     # Shared ESLint configuration
│   └── typescript-config # Shared TypeScript configuration
│
├── turbo.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── package.json
└── README.md

## Applications

All applications live inside the apps directory and are built with Next.js.


- main  

- rlc  
  
- edge  
  
- storybook  
  Dedicated Storybook application used to develop, test, and document UI components from the ui package.

## Packages

Reusable and shared code lives inside the packages directory.

- ui  
  Shared React component library used across all applications.

- storyblok  
  Centralized Storyblok utilities, and rendering helpers.

- tailwind-config  
  Shared Tailwind CSS configuration consumed by all applications and packages.

- eslint-config  
  Shared ESLint rules to enforce consistent code quality.

- typescript-config  
  Base TypeScript configuration extended by apps and packages.

All packages are written in TypeScript and consumed via pnpm workspace aliases.

## Styling

Tailwind CSS is configured once in the tailwind-config package and reused across:
- All Next.js applications
- The shared UI component library



## Tech Stack

- Turborepo
- pnpm
- Next.js
- TypeScript
- Tailwind CSS
- Storybook
- Storyblok

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm 8 or higher

### Install dependencies

pnpm install

## Development

Run all applications and packages:

pnpm turbo dev

Run a specific application:

pnpm turbo dev --filter=web
pnpm turbo dev --filter=storybook
pnpm turbo dev --filter=main
pnpm turbo dev --filter=rlc
pnpm turbo dev --filteredge

## Build

Build everything:

pnpm turbo build

Build a specific app or package:

pnpm turbo build --filter=web
pnpm turbo build --filter=ui
pnpm turbo build --filter=rlc
pnpm turbo build --filter=edge
pnpm turbo build --filter=main


Configuration is defined in turbo.json.

## Useful Links

- Turborepo: https://turborepo.com/docs
- pnpm Workspaces: https://pnpm.io/workspaces
- Next.js: https://nextjs.org
- Tailwind CSS: https://tailwindcss.com
- Storybook: https://storybook.js.org
- Storyblok: https://www.storyblok.com
