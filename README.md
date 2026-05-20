# UI for the EOSC DataCommons Tool Registry API

React + TypeScript + Vite application using OIDC authentication.

## Configuration

Copy `.env` and fill in the values:

| Variable | Description |
|---|---|
| `VITE_OIDC_AUTHORITY` | OIDC provider URL |
| `VITE_OIDC_CLIENT_ID` | OIDC client ID |
| `VITE_OIDC_REDIRECT_URI` | Redirect URI after login |
| `VITE_TOOLS_API` | Tools Registry API base URL |

For local development use `.env.development`, for production use `.env.production`.

## Running locally

```bash
npm i
npm run dev
```

## Building

```bash
npm run build
```

## Docker

Build the image, passing production env vars as build args:

```bash
docker build \
  --build-arg VITE_OIDC_AUTHORITY=https://your-auth-server \
  --build-arg VITE_OIDC_CLIENT_ID=your-client-id \
  --build-arg VITE_OIDC_REDIRECT_URI=https://your-app/signin-callback \
  --build-arg VITE_TOOLS_API=https://your-api \
  -t tool-registry-ui .
```

If you have a populated `.env.production`, you can source it instead of typing values manually:
 
```bash
set -a && source .env.production && set +a && docker build \
  --build-arg VITE_OIDC_AUTHORITY \
  --build-arg VITE_OIDC_CLIENT_ID \
  --build-arg VITE_OIDC_REDIRECT_URI \
  --build-arg VITE_TOOLS_API \
  -t tool-registry-ui .
```

Run the container:

```bash
docker run -p 8080:80 tool-registry-ui
```

The app will be available at http://localhost:8080.

> **Note:** env vars are baked into the static bundle at build time. Do not commit `.env.production` — pass secrets via `--build-arg` only.
