# Daily Balkan Recipes API

This FastAPI service generates and serves Balkan/Bulgarian weeknight recipes, storing
them in PostgreSQL so that each day's recipes remain consistent after the first
request. Recipes are generated with LangGraph + OpenAI and refreshed every night at
midnight.

## Getting Started

1. Copy `.env.example` to `.env` (or `.env.local` / `.env.production`) and fill in your
   `OPENAI_API_KEY`, then set `CORS_ALLOW_ORIGINS` to the URL that will load the Angular
   app.
2. If you plan to expose the API publicly over HTTPS, set `RECIPES_HOST` to the domain
   that points at your VPS (for example `recipes.zeroeighty.io`) and `ACME_EMAIL` to the
   address Caddy should use with Let's Encrypt.
3. Start the stack with Docker Compose (Postgres is exposed on port 5435 and Caddy
   listens on ports 80/443):

   ```bash
   docker compose up --build
   ```

3. Access the API locally at `http://localhost:8000/recipes`. Once DNS is in place and
   `RECIPES_HOST` is set, HTTPS traffic is served on `https://<RECIPES_HOST>/recipes`.

The scheduler pre-generates recipes at midnight in the configured timezone (default:
UTC). If you call the endpoint before midnight, it will lazily create and persist the
recipes for that day.

To swap between multiple environment files, run with `ENV_FILE`:

```bash
ENV_FILE=.env.production docker compose up --build
```
