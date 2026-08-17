# UI for the EOSC DataCommons Tool Registry API

Tanstack Start + TypeScript + Vite Plus application using OIDC authentication. Multilingual ready.

## Configuration

Copy `.env.example` and fill in the values:

| Variable          | Description                                       |
| ----------------- | ------------------------------------------------- |
| `OIDC_ISSUER_URI` | OIDC provider URL                                 |
| `OIDC_CLIENT_ID`  | OIDC client ID                                    |
| `TOOLS_API`       | Tools Registry API base URL                       |

For local development use `.env.development`, for production use `.env.production`.

## Running locally
Make sure Vite Plus is installed. If not, install:
```bash
curl -fsSL https://vite.plus | bash
```
and open a new terminal tab.

When Vite Plus is installed, run:

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

Build the image:

```bash
docker build \
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
