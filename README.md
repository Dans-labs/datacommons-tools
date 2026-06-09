# UI for the EOSC DataCommons Tool Registry API

Tanstack Start + TypeScript + Vite Plus application using OIDC authentication.

## Configuration

Copy `.env.example` and fill in the values:

| Variable          | Description                                       |
| ----------------- | ------------------------------------------------- |
| `OIDC_ISSUER_URI` | OIDC provider URL                                 |
| `OIDC_CLIENT_ID`  | OIDC client ID                                    |
| `VITE_TOOLS_API`  | Tools Registry API base URL (for dynamic loading) |
| `TOOLS_API`       | Tools Registry API base URL (for SSR)             |

For local development use `.env.development`, for production use `.env.production`.

## Running locally

```bash
vp i
vp dev
```

## Cleanup

Use Vite Plus for linting and code formatting.

```bash
vp check
```

## Building

```bash
vp build
```

## Docker

Build the image, passing production env vars as build args:

```bash
docker build \
  --build-arg VITE_TOOLS_API=https://your-api \
  -t tool-registry-ui .
```

If you have a populated `.env.production`, you can source it instead of typing values manually:

```bash
set -a && source .env.production && set +a && docker build \
  --build-arg VITE_TOOLS_API \
  -t tool-registry-ui .
```

Run the container and specify the required runtime variables:

```bash
docker run -e OIDC_ISSUER_URI=https://... -e OIDC_CLIENT_ID=abc123 -e TOOLS_API=https://... -p 3000:3000 tool-registry-ui
```

Or when you have a populated .env file:

```bash
docker run --env-file .env -p 3000:3000 tool-registry-ui
```

The app will be available at http://localhost:3000.
