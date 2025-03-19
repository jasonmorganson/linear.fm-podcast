# Linear FM Podcast Feed Generator

This simple Deno application scrapes the [Linear FM website](https://linear.app/fm) and generates an RSS podcast feed from the video content found there. It allows you to subscribe to Linear FM videos in your favorite podcast player.

## Features

- Scrapes video content from Linear FM
- Generates a standards-compliant podcast RSS feed
- Converts video entries to podcast episodes
- Serves the feed via HTTP for easy consumption

## How It Works

1. The application scrapes the Linear FM website
2. It extracts video titles, descriptions, and URLs
3. It generates a properly formatted podcast RSS feed
4. The feed is served via a simple HTTP server

## Prerequisites

This project requires [Deno](https://deno.land/) and uses [mise](https://github.com/jdx/mise) for environment management.

## Dependencies

- [@b-fuze/deno-dom](https://jsr.io/@b-fuze/deno-dom) - DOM parser for Deno

## Getting Started

1. Clone this repository
2. Make sure you have mise installed
3. Run the project

```bash
# Install mise if you don't have it
# https://mise.jdx.dev/getting-started.html

# Clone the repository
git clone https://github.com/yourusername/linear-fm-podcast.git
cd linear-fm-podcast

# Run the server
mise run run
```

The server will start and provide the RSS feed at http://localhost:8000

## Usage

1. Start the server using `mise run run`
2. Add the URL (http://localhost:8000) to your podcast player as a custom feed
3. Enjoy Linear FM content in your podcast player

## Development

```bash
# Format code
mise run format

# Lint code
mise run lint

# Start the server in development mode
mise run run
```

## Deployment

This application can be easily deployed to [Deno Deploy](https://deno.com/deploy), a serverless platform for Deno applications.

### Deploy to Deno Deploy

1. Create an account on [Deno Deploy](https://deno.com/deploy) if you don't have one
2. Create a new project in the Deno Deploy dashboard
3. Link your GitHub repository or deploy directly from the command line

#### GitHub Integration

1. Connect your GitHub account to Deno Deploy
2. Select your repository and branch
3. Set the entry point file to `main.ts`
4. Deploy the application

#### Command Line Deployment

Using the Deno Deploy CLI:

```bash
# Install Deno Deploy CLI
deno install -A --no-check -r -f https://deno.land/x/deploy/deployctl.ts

# Deploy your application
deployctl deploy --project=your-project-name main.ts
```

Once deployed, your podcast feed will be available at your Deno Deploy URL (e.g., `https://your-project-name.deno.dev`).

## Live Demo

A live version of this application is deployed and available at [linearfm-podcast.deno.dev](https://linearfm-podcast.deno.dev). 

You can use this URL directly in your podcast player to subscribe to the Linear FM content without having to run the application locally.

### Adding to Your Podcast Player

1. Open your favorite podcast app
2. Look for an option to add a podcast by URL
3. Enter `https://linearfm-podcast.deno.dev`
4. Subscribe to the feed

The deployed version is automatically kept up-to-date with the latest Linear FM content, ensuring you always have access to the newest episodes.